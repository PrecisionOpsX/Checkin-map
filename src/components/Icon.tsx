import React from 'react';
import { StyleSheet, View } from 'react-native';

export type IconName = 'home' | 'compass' | 'user' | 'chevron-left' | 'chevron-right';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}

/**
 * Minimal monoline icons built from Views. No external dependencies.
 * Designed to look refined at small sizes (16-24 px).
 */
export function Icon({ name, size = 20, color = '#0f172a', filled = false }: IconProps) {
  switch (name) {
    case 'home':
      return <Home size={size} color={color} filled={filled} />;
    case 'compass':
      return <Compass size={size} color={color} filled={filled} />;
    case 'user':
      return <UserGlyph size={size} color={color} filled={filled} />;
    case 'chevron-left':
      return <Chevron size={size} color={color} direction="left" />;
    case 'chevron-right':
      return <Chevron size={size} color={color} direction="right" />;
    default:
      return null;
  }
}

function Home({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  const w = size;
  const stroke = Math.max(1.5, size * 0.1);
  return (
    <View style={{ width: w, height: w, alignItems: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.5,
          borderRightWidth: w * 0.5,
          borderBottomWidth: w * 0.42,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      <View
        style={{
          width: w * 0.76,
          height: w * 0.42,
          backgroundColor: filled ? color : 'transparent',
          borderColor: color,
          borderWidth: filled ? 0 : stroke,
          marginTop: -stroke / 2,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            width: w * 0.22,
            height: w * 0.22,
            backgroundColor: filled ? '#ffffff' : color,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

function Compass({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  const stroke = Math.max(1.5, size * 0.1);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: stroke,
        borderColor: color,
        backgroundColor: filled ? color : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.12,
          borderRightWidth: size * 0.12,
          borderBottomWidth: size * 0.32,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: filled ? '#ffffff' : color,
          transform: [{ rotate: '35deg' }, { translateY: -size * 0.06 }],
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.12,
          borderRightWidth: size * 0.12,
          borderTopWidth: size * 0.32,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: filled ? '#ffffff' : color,
          transform: [{ rotate: '35deg' }, { translateY: size * 0.06 }],
          marginTop: -size * 0.06,
        }}
      />
    </View>
  );
}

function UserGlyph({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  const stroke = Math.max(1.5, size * 0.1);
  const headSize = size * 0.45;
  const bodyWidth = size * 0.85;
  const bodyHeight = size * 0.45;
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          backgroundColor: filled ? color : 'transparent',
          borderColor: color,
          borderWidth: filled ? 0 : stroke,
          marginTop: 0,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          backgroundColor: filled ? color : 'transparent',
          borderColor: color,
          borderWidth: filled ? 0 : stroke,
          borderBottomWidth: 0,
          marginTop: size * 0.06,
        }}
      />
    </View>
  );
}

function Chevron({
  size,
  color,
  direction,
}: {
  size: number;
  color: string;
  direction: 'left' | 'right';
}) {
  const stroke = Math.max(1.6, size * 0.12);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.chevron,
          {
            width: size * 0.45,
            height: size * 0.45,
            borderColor: color,
            borderTopWidth: stroke,
            borderRightWidth: stroke,
            transform: [{ rotate: direction === 'right' ? '45deg' : '-135deg' }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    backgroundColor: 'transparent',
  },
});
