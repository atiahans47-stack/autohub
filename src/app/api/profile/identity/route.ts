import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest } from '@/lib/auth';
import type { UserProfile } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const cniFront = formData.get('cni_front') as File;
    const cniBack = formData.get('cni_back') as File;
    const permisFront = formData.get('permis_front') as File;
    const permisBack = formData.get('permis_back') as File;

    const updates: Partial<UserProfile> = {};

    if (cniFront) {
      const fileExt = cniFront.name.split('.').pop();
      const fileName = `${user.id}_cni_front_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('identity-documents').upload(fileName, cniFront);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('identity-documents').getPublicUrl(fileName);
      updates.cni_front = publicUrl;
    }

    if (cniBack) {
      const fileExt = cniBack.name.split('.').pop();
      const fileName = `${user.id}_cni_back_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('identity-documents').upload(fileName, cniBack);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('identity-documents').getPublicUrl(fileName);
      updates.cni_back = publicUrl;
    }

    if (permisFront) {
      const fileExt = permisFront.name.split('.').pop();
      const fileName = `${user.id}_permis_front_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('identity-documents').upload(fileName, permisFront);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('identity-documents').getPublicUrl(fileName);
      updates.permis_front = publicUrl;
    }

    if (permisBack) {
      const fileExt = permisBack.name.split('.').pop();
      const fileName = `${user.id}_permis_back_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('identity-documents').upload(fileName, permisBack);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('identity-documents').getPublicUrl(fileName);
      updates.permis_back = publicUrl;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await (supabase.from('profiles') as any).update(updates).eq('id', user.id);
      if (error) throw error;
    }

    return NextResponse.json({ message: 'Identity documents uploaded successfully' });
  } catch (error) {
    console.error('Identity upload error:', error);
    return NextResponse.json({ error: 'Failed to upload identity documents' }, { status: 500 });
  }
}
