import { supabase } from './lib/supabaseClient';

export const categoryOrder = ['Espresso', 'Matcha'];


export async function fetchDrinks() {
  const { data, error } = await supabase
    .from('drinks')
    .select(`
      slug, name, category, image_url, sort_order,
      drink_sizes ( label, cup_image_url, sort_order ),
      drink_ingredients ( ingredient, sort_order )
    `)
    .eq('is_available', true)
    .order('sort_order');

  if (error) throw error;

  const bySortOrder = (a, b) => a.sort_order - b.sort_order;

  return Object.fromEntries(
    data.map((d) => [
      d.slug,
      {
        name: d.name,
        category: d.category,
        imageUrl: d.image_url,
        sizes: [...d.drink_sizes]
          .sort(bySortOrder)
          .map((s) => ({ label: s.label, imageUrl: s.cup_image_url })),
        included: [...d.drink_ingredients]
          .sort(bySortOrder)
          .map((i) => i.ingredient),
      },
    ])
  );
}

export async function fetchCustomizeCategories() {
  const { data, error } = await supabase
    .from('customize_categories')
    .select('label, sort_order, customize_options ( value, sort_order )')
    .order('sort_order');

  if (error) throw error;

  return data.map((c) => ({
    label: c.label,
    options: [...c.customize_options]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((o) => o.value),
  }));
}