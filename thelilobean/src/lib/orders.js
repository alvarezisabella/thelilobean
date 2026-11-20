import { supabase } from './supabaseClient';

/**
 * Saves an order to Supabase and returns the new order's id.
 * `items` are cart items: { slug, size, shots, quantity, selections }
 */
export async function placeOrder({ firstName, lastName, phone, paymentMethod, pickupDate, pickupTime, items }) {
  const { data, error } = await supabase.rpc('place_order', {
    p_first_name: firstName,
    p_last_name: lastName,
    p_phone: phone,
    p_payment_method: paymentMethod,
    p_pickup_date: pickupDate,
    p_pickup_time: pickupTime,
    p_items: items.map((i) => ({
      slug: i.slug,
      size: i.size ?? null,
      shots: i.shots ?? 0,
      quantity: i.quantity ?? 1,
      selections: i.selections ?? {},
    })),
  });

  if (error) throw error;
  return data; // the order id (uuid)
}