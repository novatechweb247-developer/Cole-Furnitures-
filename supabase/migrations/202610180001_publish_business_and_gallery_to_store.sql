-- Cole public-store publish sync enhancement.
-- Review and apply to the Cole Supabase project only after the PR is approved.
-- Preserves the existing administrator membership check and existing hero/product sync.
create or replace function public.publish_cole_admin_content()
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  published_data jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  ) then
    raise exception 'Administrator access required';
  end if;

  update public.cole_store s
  set data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(s.data, '{content,heroTitle}',
              to_jsonb(coalesce((select h.title from public.hero_slides h where h.slide_number=1 and h.is_published), s.data#>>'{content,heroTitle}')), true),
            '{content,heroSubtitle}',
              to_jsonb(coalesce((select h.subtitle from public.hero_slides h where h.slide_number=1 and h.is_published), s.data#>>'{content,heroSubtitle}')), true),
          '{content,promo}',
            coalesce((select jsonb_build_object(
              'title',h.title,'subtitle',h.subtitle,'badge',h.badge,'buttonText',h.button_text,
              'buttonLink',h.button_url,'image',h.image_url
            ) from public.hero_slides h where h.slide_number=1 and h.is_published), s.data#>'{content,promo}'), true),
        '{content,visuals,heroImage}',
          to_jsonb(coalesce((select h.image_url from public.hero_slides h where h.slide_number=1 and h.is_published), s.data#>>'{content,visuals,heroImage}')), true),
      '{content,aboutText}',
        to_jsonb(coalesce((select st.description from public.site_settings st where st.id='main' and st.is_published), s.data#>>'{content,aboutText}')), true),
    '{content,visuals,aboutImage}',
      to_jsonb(coalesce((select st.editorial_image_url from public.site_settings st where st.id='main' and st.is_published), s.data#>>'{content,visuals,aboutImage}')), true),
    updated_at = now()
  where s.id='main';

  -- Publish page copy and every editable editorial/category visual.
  update public.cole_store s
  set data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(coalesce(s.data, '{}'::jsonb), '{content,aboutTitle}',
                    to_jsonb(coalesce(nullif(st.draft_data->>'about_title',''), s.data#>>'{content,aboutTitle}', 'About Cole World Furniture')), true),
                  '{content,aboutText}',
                    to_jsonb(coalesce(nullif(st.draft_data->>'about_text',''), st.description, s.data#>>'{content,aboutText}')), true),
                '{content,interiorDesignTitle}',
                  to_jsonb(coalesce(nullif(st.draft_data->>'interior_design_title',''), s.data#>>'{content,interiorDesignTitle}', 'Interior Design Services')), true),
              '{content,interiorDesignText}',
                to_jsonb(coalesce(nullif(st.draft_data->>'interior_design_text',''), s.data#>>'{content,interiorDesignText}')), true),
            '{content,visuals,aboutImage}',
              to_jsonb(coalesce(nullif(st.draft_data->>'home_about_image_url',''), s.data#>>'{content,visuals,aboutImage}')), true),
          '{content,visuals,servicesImage}',
            to_jsonb(coalesce(nullif(st.draft_data->>'home_services_image_url',''), s.data#>>'{content,visuals,servicesImage}')), true),
        '{content,visuals,aboutPageImage}',
          to_jsonb(coalesce(nullif(st.draft_data->>'about_page_image_url',''), st.editorial_image_url, s.data#>>'{content,visuals,aboutPageImage}')), true),
      '{content,visuals,servicesPageImage}',
        to_jsonb(coalesce(nullif(st.draft_data->>'interior_page_image_url',''), s.data#>>'{content,visuals,servicesPageImage}')), true),
    '{categories}',
      coalesce(nullif(st.draft_data->'categories', 'null'::jsonb), s.data->'categories', '[]'::jsonb),
    true),
    updated_at=now()
  from public.site_settings st
  where s.id='main' and st.id='main' and st.is_published=true;

  update public.cole_store s
  set data = jsonb_set(
    s.data,
    '{products}',
    coalesce((
      select jsonb_agg(
        coalesce(oldp, jsonb_build_object(
          'id', p.id, 'price', 0, 'images', jsonb_build_array(p.image_url),
          'categoryId', coalesce((select c->>'id' from jsonb_array_elements(s.data->'categories') c where lower(c->>'name')=lower(p.category) limit 1),'cat-1'),
          'isFeatured', false, 'availability', 'Made to Order', 'createdAt', now()::text
        )) || jsonb_build_object(
          'id',p.id,'name',p.name,'description',p.description,
          'images', case when coalesce(p.image_url,'') <> '' then jsonb_build_array(p.image_url) else coalesce(oldp->'images','[]'::jsonb) end,
          'sortOrder',p.sort_order,
          'categoryId',coalesce(oldp->>'categoryId',(select c->>'id' from jsonb_array_elements(s.data->'categories') c where lower(c->>'name')=lower(p.category) limit 1),'cat-1')
        )
        order by p.sort_order, p.id
      )
      from public.products p
      left join lateral (
        select o as oldp from jsonb_array_elements(s.data->'products') o where o->>'id'=p.id limit 1
      ) old on true
      where p.is_published = true
    ), '[]'::jsonb),
    true
  ),
  updated_at=now()
  where s.id='main';

  -- Publish business details as a stable top-level object without discarding existing store keys.
  update public.cole_store s
  set data = s.data || jsonb_build_object(
    'business', coalesce((
      select jsonb_build_object(
        'name', st.business_name,
        'tagline', st.tagline,
        'address', st.address,
        'phone', st.phone,
        'phoneInternational', st.phone_international,
        'whatsappUrl', st.whatsapp_url,
        'mapUrl', st.map_url,
        'description', st.description,
        'logoUrl', st.logo_url,
        'editorialImageUrl', st.editorial_image_url
      )
      from public.site_settings st
      where st.id='main' and st.is_published=true
    ), s.data->'business'),
    'gallery', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id,
        'title', g.title,
        'category', g.category,
        'image', g.image_url,
        'description', g.description,
        'sortOrder', g.sort_order
      ) order by g.sort_order, g.id)
      from public.gallery_items g
      where g.is_published=true
    ), '[]'::jsonb)
  ),
  updated_at=now()
  where s.id='main';

  select data into published_data from public.cole_store where id='main';
  return jsonb_build_object(
    'published', true,
    'product_count', jsonb_array_length(coalesce(published_data->'products','[]'::jsonb)),
    'gallery_count', jsonb_array_length(coalesce(published_data->'gallery','[]'::jsonb)),
    'business_synced', (published_data ? 'business')
  );
end;
$function$;

revoke all on function public.publish_cole_admin_content() from public;
grant execute on function public.publish_cole_admin_content() to authenticated;
