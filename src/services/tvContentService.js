/**
 * TV Icerik Servisi - Supabase Entegrasyonu
 *
 * Supabase Tablolari:
 *   tv_contents  - Yayinlanacak reklam icerikleri
 *   tv_panels    - Fiziksel pano/TV cihaz durumlari
 *
 * Admin onayladiginda icerik Supabase'e yazilir,
 * TV Display ekrani Realtime subscription ile gercek zamanli dinler.
 */

import { supabase } from '../config/supabase';

// Lokal cache (realtime'dan guncellenir)
let _tvContents = [];
let _tvPanels = [];
let _listeners = [];
let _contentSubscription = null;
let _panelsSubscription = null;
let _snapshotActive = false;
let _retryTimer = null;

const notifyListeners = () => _listeners.forEach((fn) => fn());

/** Supabase Realtime aktif mi */
export function isSnapshotActive() {
  return _snapshotActive;
}

// ============================================================
// GERCEK ZAMANLI DINLEME (Supabase Realtime)
// ============================================================

/** Supabase Realtime dinlemelerini baslat */
export function startListening() {
  // TV Content dinle
  if (!_contentSubscription) {
    _contentSubscription = supabase
      .channel('tv_contents_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_contents' }, (payload) => {
        handleContentChange(payload);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          _snapshotActive = true;
          fetchContentsDirectly().catch(() => {});
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[TVContent] Realtime baglanti basarisiz, lokal veriyle devam ediliyor.');
          _snapshotActive = false;
          // Kanal temizle ki tekrar denemede yeni kanal acilsin
          if (_contentSubscription) {
            supabase.removeChannel(_contentSubscription);
            _contentSubscription = null;
          }
        }
      });
  }

  // TV Panels dinle
  if (!_panelsSubscription) {
    _panelsSubscription = supabase
      .channel('tv_panels_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_panels' }, (payload) => {
        handlePanelChange(payload);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          fetchPanelsDirectly().catch(() => {});
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[TVPanels] Realtime baglanti basarisiz, lokal veriyle devam ediliyor.');
          if (_panelsSubscription) {
            supabase.removeChannel(_panelsSubscription);
            _panelsSubscription = null;
          }
        }
      });
  }
}

/** Realtime degisiklik handler - tv_contents */
function handleContentChange(payload) {
  const { eventType, new: newRow, old: oldRow } = payload;

  if (eventType === 'INSERT') {
    const mapped = mapContentRow(newRow);
    if (!_tvContents.find((c) => c.id === mapped.id)) {
      _tvContents = [mapped, ..._tvContents];
    }
  } else if (eventType === 'UPDATE') {
    const mapped = mapContentRow(newRow);
    _tvContents = _tvContents.map((c) => (c.id === mapped.id ? mapped : c));
  } else if (eventType === 'DELETE') {
    _tvContents = _tvContents.filter((c) => c.id !== oldRow.id);
  }

  notifyListeners();
}

/** Realtime degisiklik handler - tv_panels */
function handlePanelChange(payload) {
  const { eventType, new: newRow, old: oldRow } = payload;

  if (eventType === 'INSERT') {
    const mapped = mapPanelRow(newRow);
    if (!_tvPanels.find((p) => p.id === mapped.id)) {
      _tvPanels = [..._tvPanels, mapped];
    }
  } else if (eventType === 'UPDATE') {
    const mapped = mapPanelRow(newRow);
    _tvPanels = _tvPanels.map((p) => (p.id === mapped.id ? mapped : p));
  } else if (eventType === 'DELETE') {
    _tvPanels = _tvPanels.filter((p) => p.id !== oldRow.id);
  }

  notifyListeners();
}

/** Supabase satir → uygulama formati (tv_contents) */
function mapContentRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    adTitle: row.ad_title,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    panelId: row.panel_id,
    panelName: row.panel_name,
    duration: row.duration,
    scheduledDates: row.scheduled_dates || [],
    status: row.status,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  };
}

/** Supabase satir → uygulama formati (tv_panels) */
function mapPanelRow(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    status: row.status,
    lastHeartbeat: row.last_heartbeat,
    currentContentId: row.current_content_id,
    resolution: row.resolution,
  };
}

/** Dinlemeleri durdur */
export function stopListening() {
  if (_contentSubscription) {
    supabase.removeChannel(_contentSubscription);
    _contentSubscription = null;
  }
  if (_panelsSubscription) {
    supabase.removeChannel(_panelsSubscription);
    _panelsSubscription = null;
  }
  _snapshotActive = false;
}

// Uygulama basladiginda dinlemeyi otomatik baslat
startListening();

// ============================================================
// TV ICERIK ISLEMLERI
// ============================================================

/** Medyayi (gorsel veya video) Supabase Storage'a yukle ve public URL'ini dondur */
async function uploadMediaToStorage(mediaUri, contentId, mediaType) {
  try {
    if (!mediaUri) return null;
    if (mediaUri.startsWith('http://') || mediaUri.startsWith('https://')) {
      return mediaUri;
    }

    const isVideo = mediaType === 'video';
    let ext = isVideo ? 'mp4' : 'jpg';
    let contentType = isVideo ? 'video/mp4' : 'image/jpeg';

    // base64 data URI'den MIME type belirle
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
    const filePath = `${contentId}.${ext}`;

    const { error } = await supabase.storage
      .from('tv-content')
      .upload(filePath, blob, { contentType, upsert: true });

    if (error) {
      console.warn('Supabase Storage yukleme hatasi:', error.message);
      return mediaUri;
    }

    const { data } = supabase.storage
      .from('tv-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.warn('Medya yukleme hatasi:', error);
    return mediaUri;
  }
}

/** Onaylanan siparisi TV icin icerik olarak Supabase'e yaz ve direkt oynat */
export async function pushContentToTV(order) {
  const contentId = `tv-${Date.now()}`;
  const orderMediaType = order.mediaType || 'image';
  const mediaUrl = await uploadMediaToStorage(order.adImage, contentId, orderMediaType);
  const panelId = String(order.panel.id);
  const content = {
    orderId: order.id,
    adTitle: order.adTitle,
    mediaUrl: mediaUrl || order.adImage,
    mediaType: orderMediaType,
    panelId: panelId,
    panelName: order.panel.name,
    duration: parseInt(order.adDuration) || 15,
    scheduledDates: order.dates || [],
    status: 'playing',
    createdAt: Date.now(),
    approvedAt: Date.now(),
  };

  // Lokal cache'i hemen guncelle (UI aninda gorsun)
  _tvContents = _tvContents
    .map((c) => (String(c.panelId) === panelId && (c.status === 'playing' || c.status === 'approved'))
      ? { ...c, status: 'completed' } : c);
  _tvContents = [{ id: contentId, ...content }, ..._tvContents];
  notifyListeners();

  try {
    // Ayni panodaki eski playing/approved icerikleri completed yap
    await supabase
      .from('tv_contents')
      .update({ status: 'completed' })
      .eq('panel_id', panelId)
      .in('status', ['playing', 'approved']);

    // Yeni icerigi ekle
    await supabase.from('tv_contents').upsert({
      id: contentId,
      order_id: content.orderId,
      ad_title: content.adTitle,
      media_url: content.mediaUrl,
      media_type: content.mediaType,
      panel_id: content.panelId,
      panel_name: content.panelName,
      duration: content.duration,
      scheduled_dates: content.scheduledDates,
      status: content.status,
      created_at: content.createdAt,
      approved_at: content.approvedAt,
    });

    // Panelin mevcut icerigini ve durumunu guncelle
    await supabase.from('tv_panels').upsert({
      id: panelId,
      current_content_id: contentId,
      status: 'online',
      last_heartbeat: Date.now(),
    }, { onConflict: 'id', ignoreDuplicates: false });

    return { id: contentId, ...content };
  } catch (error) {
    console.warn('pushContentToTV hatasi:', error);
    return { id: contentId, ...content };
  }
}

/** Icerigi TV'de oynatmaya basla */
export async function startPlayingContent(contentId) {
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'playing' } : c
  );
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .update({ status: 'playing' })
      .eq('id', contentId);

    const content = _tvContents.find((c) => c.id === contentId);
    if (content) {
      await supabase
        .from('tv_panels')
        .update({ current_content_id: contentId, status: 'online' })
        .eq('id', content.panelId);
    }
  } catch (error) {
    console.warn('startPlayingContent hatasi:', error);
  }
}

/** Icerigi tamamla */
export async function completeContent(contentId) {
  _tvContents = _tvContents.map((c) =>
    c.id === contentId ? { ...c, status: 'completed' } : c
  );
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .update({ status: 'completed' })
      .eq('id', contentId);
  } catch (error) {
    console.warn('completeContent hatasi:', error);
  }
}

/** Icerigi kaldir/iptal et */
export async function removeContent(contentId) {
  const content = _tvContents.find((c) => c.id === contentId);
  _tvContents = _tvContents.filter((c) => c.id !== contentId);
  notifyListeners();

  try {
    await supabase
      .from('tv_contents')
      .delete()
      .eq('id', contentId);

    if (content) {
      await supabase
        .from('tv_panels')
        .update({ current_content_id: null })
        .eq('id', content.panelId);
    }
  } catch (error) {
    console.warn('removeContent hatasi:', error);
  }
}

// ============================================================
// TV PANO ISLEMLERI
// ============================================================

/** Pano kaydet veya guncelle (TV ilk acildiginda) */
export async function registerPanel(panelId, panelData) {
  try {
    const data = {
      id: panelId,
      name: panelData.name || `Panel ${panelId}`,
      location: panelData.location || '',
      status: 'online',
      last_heartbeat: Date.now(),
      resolution: panelData.resolution || '1920x1080',
    };

    await supabase.from('tv_panels').upsert(data, { onConflict: 'id', ignoreDuplicates: false });
  } catch (error) {
    console.warn('registerPanel hatasi:', error);
  }
}

/** Pano heartbeat gonder */
export async function updatePanelHeartbeat(panelId) {
  try {
    await supabase
      .from('tv_panels')
      .update({ status: 'online', last_heartbeat: Date.now() })
      .eq('id', panelId);
  } catch (error) {
    console.warn('updatePanelHeartbeat hatasi:', error);
  }
}

/** Panoya su anda oynatilan icerigi kaydet */
export async function updatePanelCurrentContent(panelId, contentId) {
  try {
    await supabase
      .from('tv_panels')
      .update({ current_content_id: contentId, last_heartbeat: Date.now() })
      .eq('id', panelId);
  } catch (error) {
    console.warn('updatePanelCurrentContent hatasi:', error);
  }
}

// ============================================================
// VARSAYILAN PANOLARI OLUSTUR (ilk kurulumda)
// ============================================================

const DEFAULT_PANELS = [
  { id: '1', name: 'Kızılay Meydanı', location: 'Kızılay, Ankara', resolution: '1920x1080' },
  { id: '2', name: 'Tunalı Hilmi Caddesi', location: 'Çankaya, Ankara', resolution: '1920x1080' },
  { id: '3', name: 'Ulus Meydanı', location: 'Altındağ, Ankara', resolution: '1920x1080' },
  { id: '4', name: 'Bahçelievler AVM Girişi', location: 'Çankaya, Ankara', resolution: '1920x1080' },
  { id: '5', name: 'Batıkent Metro Çıkışı', location: 'Yenimahalle, Ankara', resolution: '1920x1080' },
  { id: '6', name: 'Gölbaşı Sahil Yolu', location: 'Gölbaşı, Ankara', resolution: '1920x1080' },
];

let _panelsInitialized = false;
export async function initializeDefaultPanels() {
  if (_panelsInitialized) return;
  _panelsInitialized = true;
  try {
    if (_tvPanels.length > 0) return;

    const { data, error } = await supabase.from('tv_panels').select('id');
    if (error) throw error;

    if (!data || data.length === 0) {
      const panelRows = DEFAULT_PANELS.map((panel) => ({
        id: panel.id,
        name: panel.name,
        location: panel.location,
        resolution: panel.resolution,
        status: 'offline',
        last_heartbeat: 0,
        current_content_id: null,
      }));

      await supabase.from('tv_panels').upsert(panelRows);
      console.log('Varsayilan panolar olusturuldu');
    }
  } catch (error) {
    _panelsInitialized = false;
    console.warn('initializeDefaultPanels hatasi:', error);
  }
}

// Panolari 3 saniye gecikmeyle olustur (baslangic yukunu azalt)
setTimeout(() => initializeDefaultPanels(), 3000);

// ============================================================
// VERI OKUMA
// ============================================================

/** Supabase'den direkt oku (realtime calismiyorsa fallback) */
export async function fetchContentsDirectly() {
  try {
    const { data, error } = await supabase
      .from('tv_contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    _tvContents = (data || []).map(mapContentRow);
    notifyListeners();
    return _tvContents;
  } catch (error) {
    console.warn('fetchContentsDirectly hatasi:', error);
    return _tvContents;
  }
}

/** Supabase'den panolari direkt oku */
async function fetchPanelsDirectly() {
  try {
    const { data, error } = await supabase.from('tv_panels').select('*');
    if (error) throw error;
    _tvPanels = (data || []).map(mapPanelRow);
    notifyListeners();
    return _tvPanels;
  } catch (error) {
    console.warn('fetchPanelsDirectly hatasi:', error);
    return _tvPanels;
  }
}

/** Tum TV iceriklerini getir (cache'den) */
export function getTvContents() {
  return [..._tvContents];
}

/** Belirli panoya ait icerikleri getir */
export function getContentsByPanel(panelId) {
  const pid = String(panelId);
  return _tvContents.filter((c) => String(c.panelId) === pid);
}

/** Belirli panoya ait aktif (oynatilacak) icerikleri getir */
export function getActiveContentsByPanel(panelId) {
  const pid = String(panelId);
  return _tvContents.filter(
    (c) => String(c.panelId) === pid && (c.status === 'approved' || c.status === 'playing')
  );
}

/** Tum pano durumlarini getir (cache'den) */
export function getTvPanels() {
  return _tvPanels.map((p) => {
    const isOnline = Date.now() - (p.lastHeartbeat || 0) < 300000;
    return { ...p, status: isOnline ? 'online' : 'offline' };
  });
}

/** Degisiklikleri dinle (basit observer pattern - UI icin) */
export function subscribe(listener) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((fn) => fn !== listener);
  };
}
