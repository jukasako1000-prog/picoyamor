import { supabase } from './supabase';
import { PRODUCTS } from '../constants';

export const syncProducts = async () => {
    try {
        // 1. Get current products from Supabase
        const { data: dbProducts, error: fetchError } = await supabase
            .from('products')
            .select('id');

        if (fetchError) throw fetchError;

        const dbIds = new Set(dbProducts?.map(p => p.id) || []);

        // 2. Identify missing products
        const missingProducts = PRODUCTS.filter(p => !dbIds.has(p.id));

        if (missingProducts.length > 0) {
            console.log(`Syncing ${missingProducts.length} new products to Supabase...`);
            const { error: insertError } = await supabase
                .from('products')
                .insert(missingProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    stock_quantity: 0 // Default to 0
                })));

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Error syncing products:', error);
    }
};

export const updateStock = async (items: { id: string, quantity: number }[]) => {
    try {
        const { error } = await supabase.rpc('decrement_stock', {
            items_to_update: items
        });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating stock via RPC:', error);
        // We catch here but the checkout flow handles the failure gracefully
        throw error;
    }
};

export const saveOrder = async (orderData: any) => {
    const { error } = await supabase
        .from('orders')
        .insert([orderData]);

    if (error) throw error;
    return { success: true };
};

export const saveProfile = async (userId: string, profileData: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...profileData,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};
