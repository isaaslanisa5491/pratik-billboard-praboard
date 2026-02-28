import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/colors';

/**
 * PraboardLogo — Kalın çizgilerle çizilmiş "P" harfi
 *
 * variant="onGradient"  → beyaz P  (kırmızı/gradient zemin için)
 * variant="standalone"  → kırmızı P  (beyaz zemin için)
 */
export default function PraboardLogo({ size = 80, variant = 'onGradient' }) {
  const isOnGradient = variant === 'onGradient';
  const color = isOnGradient ? colors.white : colors.primary;

  const strokeW = Math.round(size * 0.19);
  const bowlH = Math.round(size * 0.60);
  const bowlW = size - Math.round(strokeW * 0.5);

  return (
    <View style={{ width: size, height: size, backgroundColor: 'transparent' }}>
      {/* Sol dikey gövde — tam yükseklik */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: strokeW,
          height: size,
          borderRadius: strokeW / 2,
          backgroundColor: color,
        }}
      />

      {/* D-şekli yay (bowl) — üst, sağ, alt kenarda çizgi; sol taraf açık */}
      <View
        style={{
          position: 'absolute',
          left: Math.round(strokeW / 2),
          top: 0,
          width: bowlW,
          height: bowlH,
          borderTopWidth: strokeW,
          borderRightWidth: strokeW,
          borderBottomWidth: strokeW,
          borderLeftWidth: 0,
          borderColor: color,
          borderTopRightRadius: bowlH / 2,
          borderBottomRightRadius: bowlH / 2,
          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}
