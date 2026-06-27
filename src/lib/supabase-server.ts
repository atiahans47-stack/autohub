import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, phone, profile_photo')
      .eq('id', payload.id as string)
      .single() as { data: { id: string; email: string; full_name: string; role: string; phone: string; profile_photo: string } | null; error: unknown };

    return profile;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return { user: payload };
  } catch {
    return null;
  }
}
