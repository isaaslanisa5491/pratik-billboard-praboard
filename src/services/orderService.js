import { supabase } from '../config/supabase';

/**
 * Gorsel veya videoyu Supabase Storage'a yukle ve public URL'ini dondur.
 * base64 data URI, blob URI veya file URI destekler.
 * Zaten http(s) URL ise dogrudan dondurur.
 */
async function uploadOrderMedia(mediaUri, orderId, mediaType) {
  try {
    if (!mediaUri) return null;
    if (mediaUri.startsWith('http://') || mediaUri.startsWith('https://')) {
      return mediaUri;
    }

    const isVideo = mediaType === 'video';
    let ext = isVideo ? 'mp4' : 'jpg';
    let contentType = isVideo ? 'video/mp4' : 'image/jpeg';

    if (mediaUri.startsWith('data:')) {
      const mimeMatch = mediaUri.match(/^data:([^;]+);/);
      if (mimeMatch) {
        contentType = mimeMatch[1];
        if (contentType === 'image/png') ext = 'png';
        else if (contentType === 'image/webp') ext = 'webp';
        else if (contentType === 'image/gif') ext = 'gif';
      }
    }

    const response = await fetch(mediaUri);
    const blob = await response.blob();
    const filePath = `orders/${orderId}.${ext}`;

    const { error } = await supabase.storage
      .from('tv-content')
      .upload(filePath, blob, { contentType, upsert: true });

    if (error) {
      console.warn('Order medya yukleme hatasi:', error.message);
      return null;
    }

    const { data } = supabase.storage
      .from('tv-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.warn('Order medya yukleme hatasi:', error);
    return null;
  }
}

/**
 * Supabase satir → uygulama formati
 */
function mapOrderRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    adTitle: row.ad_title,
    adImage: row.ad_image,
    mediaType: row.media_type || 'image',
    panel: {
      id: row.panel_id,
      name: row.panel_name,
      location: row.panel_location,
      size: row.panel_size,
      price: row.panel_price,
      image: row.panel_image,
    },
    dates: row.dates || [],
    adDuration: row.ad_duration,
    totalPrice: row.total_price,
    campaignDetails: row.campaign_details,
    status: row.status,
    rejectReason: row.reject_reason,
    proofPhoto: row.proof_photo,
    proofDate: row.proof_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Tum siparisleri getir (admin icin)
 */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapOrderRow);
}

/**
 * Belirli kullanicinin siparislerini getir
 */
export async function fetchUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapOrderRow);
}

/**
 * Yeni siparis olustur
 */
export async function createOrder(orderData) {
  const id = `ORD-${Date.now()}`;
  const mediaType = orderData.mediaType || 'image';

  // Gorseli/videoyu Storage'a yukle, base64'u veritabanina yazmaktan kacin
  let adImageUrl = orderData.adImage;
  if (orderData.adImage && !orderData.adImage.startsWith('http')) {
    const uploaded = await uploadOrderMedia(orderData.adImage, id, mediaType);
    if (uploaded) {
      adImageUrl = uploaded;
    }
  }

  const row = {
    id,
    user_id: orderData.userId || null,
    ad_title: orderData.adTitle,
    ad_image: adImageUrl,
    media_type: mediaType,
    panel_id: orderData.panel?.id || null,
    panel_name: orderData.panel?.name || null,
    panel_location: orderData.panel?.location || null,
    panel_size: orderData.panel?.size || null,
    panel_price: orderData.panel?.price || null,
    panel_image: orderData.panel?.image || null,
    dates: orderData.dates || [],
    ad_duration: `${orderData.adDuration || 15} saniye`,
    total_price: `${(orderData.dates?.length || 1) * (parseInt(orderData.panel?.price) || 1166)} TL`,
    campaign_details: orderData.campaignDetails || null,
    status: 'onay_bekliyor',
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}

/**
 * Siparis durumunu guncelle
 */
export async function updateOrderStatus(orderId, newStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}

/**
 * Siparisi reddet
 */
export async function rejectOrderInDB(orderId, reason) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'rejected',
      reject_reason: reason || 'Reklam icerigi uygun bulunmadi.',
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return mapOrderRow(data);
}
