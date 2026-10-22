import { supabase } from '../lib/supabase';
const PROPOSAL_ASSETS_BUCKET = 'proposal-assets';

export const listProposals = () => supabase.from('proposals').select('id, client_name, name, slug, status, updated_at, published_at').order('updated_at', { ascending: false });

export const getProposalForAdmin = (id) => supabase.from('proposals').select('*, proposal_sections(*)').eq('id', id).single();
export const getPublishedProposal = (slug) => supabase.from('proposals').select('*, proposal_sections(*)').eq('slug', slug).eq('status', 'published').single();
export const deleteProposal = (id) => supabase.from('proposals').delete().eq('id', id);

export async function uploadProposalAsset(folderId, file, kind) {
  const extensionByType = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
  const extension = extensionByType[file.type];
  if (!extension) return { data: null, error: new Error('Formato no compatible. Usa PNG, JPG o WebP.') };

  const assetId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `proposals/${folderId}/${kind}/${assetId}.${extension}`;
  try {
    const { error } = await supabase.storage.from(PROPOSAL_ASSETS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });
    if (error) return { data: null, error };

    const { data } = supabase.storage.from(PROPOSAL_ASSETS_BUCKET).getPublicUrl(path);
    return { data: { path, url: data.publicUrl }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function saveProposal({ id, proposal, sections }) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { data: null, error: authError ?? new Error('La sesión administrativa expiró.') };
  }

  const payload = {
    client_name: proposal.client_name,
    name: proposal.name,
    slug: proposal.slug,
    title: proposal.title,
    status: proposal.status,
    updated_by: authData.user.id,
    published_at: proposal.status === 'published' ? new Date().toISOString() : null,
    ...(!id && { created_by: authData.user.id }),
  };
  const query = id
    ? supabase.from('proposals').update(payload).eq('id', id).select().single()
    : supabase.from('proposals').insert(payload).select().single();
  let { data, error } = await query;

  // Recupera una propuesta propia que haya quedado sin secciones por un fallo previo.
  if (!id && error?.code === '23505') {
    const { data: existing } = await supabase
      .from('proposals')
      .select('id, proposal_sections(count)')
      .eq('slug', proposal.slug)
      .maybeSingle();
    const sectionCount = existing?.proposal_sections?.[0]?.count ?? 0;
    if (existing && sectionCount === 0) {
      const recovered = await supabase.from('proposals').update(payload).eq('id', existing.id).select().single();
      data = recovered.data;
      error = recovered.error;
    }
  }

  if (error) return { data: null, error };
  const { error: deleteError } = await supabase.from('proposal_sections').delete().eq('proposal_id', data.id);
  if (deleteError) return { data: null, error: deleteError };
  const rows = sections.map((section, index) => ({ proposal_id: data.id, section_type: section.section_type, order_index: index, title: section.title, content: section.content }));
  const { error: sectionsError } = await supabase.from('proposal_sections').insert(rows);
  return { data, error: sectionsError };
}
