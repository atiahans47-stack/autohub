import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { SiteContent, SingleResult } from '@/types/database';

// GET content for a section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const supabaseAdmin = getSupabaseAdmin();

    const { data: content, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('section', section)
      .single() as SingleResult<SiteContent>;

    if (error) {
      return NextResponse.json({
        content: getDefaultContent(section),
      });
    }

    return NextResponse.json({ content: content?.content });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update content for a section (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    if (!isAdminUser(user)) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { content } = await request.json();
    const userId = user.id;
    const supabaseAdmin = getSupabaseAdmin();

    const { data: existingContent } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('section', section)
      .single() as SingleResult<SiteContent>;

    let result;
    if (existingContent) {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .update({
          content,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq('section', section)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .insert({
          section,
          content,
          updated_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      message: 'Content updated successfully',
      content: result,
    });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDefaultContent(section: string) {
  switch (section) {
    case 'hero':
      return {
        slides: [
          {
            image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920&q=80',
            title: 'Find Your Perfect Ride',
            subtitle: 'Rent or buy with ease',
            ctaText: 'Browse Cars',
            ctaLink: '/rent-cars',
          },
          {
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
            title: 'Premium Fleet',
            subtitle: 'Luxury at affordable prices',
            ctaText: 'View Fleet',
            ctaLink: '/buy-cars',
          },
        ],
      };
    case 'footer':
      return {
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          whatsapp: '',
        },
        companyInfo: {
          name: 'AUTOHub',
          address: '',
          phone: '',
          email: '',
        },
        quickLinks: [
          { label: 'Home', href: '/' },
          { label: 'Rent Cars', href: '/rent-cars' },
          { label: 'Buy Cars', href: '/buy-cars' },
          { label: 'About Us', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      };
    case 'settings':
      return {
        siteName: 'AUTOHub',
        tagline: 'Your Trusted Car Rental & Sales Partner',
        logo: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        businessHours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      };
    default:
      return {};
  }
}
