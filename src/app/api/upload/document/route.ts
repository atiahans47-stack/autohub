import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const userId = formData.get('userId') as string;

    if (!file || !fileName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', fileName, 'for user:', userId);

    const supabaseAdmin = getSupabaseAdmin();

    // Upload file to Supabase storage — bypasses RLS via service role
    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(fileName);

    console.log('File uploaded successfully:', publicUrl);

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}