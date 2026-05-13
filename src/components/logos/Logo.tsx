import React from 'react';
import { StyleSheet, View } from 'react-native';

export type LogoVariant = 'mark' | 'drop' | 'pulse' | 'frame' | 'compass';

interface LogoProps {
  variant: LogoVariant;
  size?: number;
  color?: string;
  background?: 'transparent' | 'tile';
}

/**
 * Five candidate brand marks for CheckInMap. All built from View primitives,
 * no SVG and no extra dependencies. Each renders crisply at any size.
 */
export function Logo({
  variant,
  size = 96,
  color = '#0f172a',
  background = 'transparent',
}: LogoProps) {
  const tile = background === 'tile';
  return (
    <View
      style={[
        styles.tile,
        {
          width: tile ? size * 1.6 : size,
          height: tile ? size * 1.6 : size,
          backgroundColor: tile ? '#ffffff' : 'transparent',
          borderRadius: tile ? size * 0.22 : 0,
          borderWidth: tile ? 1 : 0,
          borderColor: '#e5e7eb',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {variant === 'mark' && <Mark size={size} color={color} />}
      {variant === 'drop' && <Drop size={size} color={color} />}
      {variant === 'pulse' && <Pulse size={size} color={color} />}
      {variant === 'frame' && <Frame size={size} color={color} />}
      {variant === 'compass' && <Compass size={size} color={color} />}
    </View>
  );
}

function Mark({ size, color }: { size: number; color: string }) {
  const w = size;
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: w * 0.85,
          height: w * 0.85,
          borderRadius: (w * 0.85) / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: w * 0.28,
            height: w * 0.28,
            borderRadius: (w * 0.28) / 2,
            backgroundColor: '#ffffff',
          }}
        />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.2,
          borderRightWidth: w * 0.2,
          borderTopWidth: w * 0.28,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -w * 0.1,
        }}
      />
    </View>
  );
}

function Drop({ size, color }: { size: number; color: string }) {
  const w = size;
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: w,
          height: w * 0.82,
          borderRadius: w * 0.24,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: w * 0.22,
            height: w * 0.22,
            borderRadius: (w * 0.22) / 2,
            backgroundColor: '#ffffff',
          }}
        />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.14,
          borderRightWidth: w * 0.14,
          borderTopWidth: w * 0.18,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -w * 0.02,
          marginLeft: w * 0.15,
        }}
      />
    </View>
  );
}

function Pulse({ size, color }: { size: number; color: string }) {
  const w = size;
  const stroke = Math.max(2, w * 0.06);
  return (
    <View
      style={{
        width: w,
        height: w,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: w,
          height: w,
          borderRadius: w / 2,
          borderWidth: stroke,
          borderColor: color,
          opacity: 0.2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: w * 0.7,
          height: w * 0.7,
          borderRadius: (w * 0.7) / 2,
          borderWidth: stroke,
          borderColor: color,
          opacity: 0.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: w * 0.42,
          height: w * 0.42,
          borderRadius: (w * 0.42) / 2,
          borderWidth: stroke,
          borderColor: color,
        }}
      />
      <View
        style={{
          width: w * 0.18,
          height: w * 0.18,
          borderRadius: (w * 0.18) / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

function Frame({ size, color }: { size: number; color: string }) {
  const w = size;
  const stroke = Math.max(3, w * 0.07);
  const armLen = w * 0.34;
  const inset = w * 0.05;
  const cornerStyle = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    const horizontal = {
      position: 'absolute' as const,
      width: armLen,
      height: stroke,
      backgroundColor: color,
      borderRadius: stroke / 2,
    };
    const vertical = {
      position: 'absolute' as const,
      width: stroke,
      height: armLen,
      backgroundColor: color,
      borderRadius: stroke / 2,
    };
    switch (corner) {
      case 'tl':
        return { h: { ...horizontal, top: inset, left: inset }, v: { ...vertical, top: inset, left: inset } };
      case 'tr':
        return { h: { ...horizontal, top: inset, right: inset }, v: { ...vertical, top: inset, right: inset } };
      case 'bl':
        return { h: { ...horizontal, bottom: inset, left: inset }, v: { ...vertical, bottom: inset, left: inset } };
      case 'br':
        return { h: { ...horizontal, bottom: inset, right: inset }, v: { ...vertical, bottom: inset, right: inset } };
    }
  };

  const corners = (['tl', 'tr', 'bl', 'br'] as const).map((c) => cornerStyle(c));

  return (
    <View
      style={{
        width: w,
        height: w,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {corners.map((c, i) => (
        <View key={i}>
          <View style={c.h} />
          <View style={c.v} />
        </View>
      ))}
      <View
        style={{
          width: w * 0.16,
          height: w * 0.16,
          borderRadius: (w * 0.16) / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

function Compass({ size, color }: { size: number; color: string }) {
  const w = size;
  const stroke = Math.max(2, w * 0.055);
  return (
    <View
      style={{
        width: w,
        height: w,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: w * 0.7,
          height: w * 0.7,
          borderWidth: stroke,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.1,
          borderRightWidth: w * 0.1,
          borderBottomWidth: w * 0.34,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          transform: [{ rotate: '30deg' }, { translateY: -w * 0.04 }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {},
});
