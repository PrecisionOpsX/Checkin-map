import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

interface AnimatedSplashProps {
  /** True when the app's main data (auth, profile, ...) is ready. */
  ready: boolean;
  /** Called once the splash has fully animated off-screen. */
  onFinish: () => void;
  /** Minimum visible duration in ms so the brand always gets a moment. */
  minimumVisibleMs?: number;
}

const ANIM = {
  entranceMs: 700,
  wordmarkDelayMs: 250,
  exitMs: 450,
  ringLoopMs: 2000,
};

export function AnimatedSplash({
  ready,
  onFinish,
  minimumVisibleMs = 1400,
}: AnimatedSplashProps) {
  // Whole-screen container opacity, animated to 0 on exit.
  const containerOpacity = useRef(new Animated.Value(1)).current;
  // Logo entrance (fade + scale).
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  // Wordmark entrance.
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkTranslateY = useRef(new Animated.Value(8)).current;
  // Continuous ripple ring.
  const rippleScale = useRef(new Animated.Value(0.4)).current;
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;

  const mountedAt = useRef(Date.now());

  // Entrance animation, runs once.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: ANIM.entranceMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: ANIM.entranceMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(ANIM.wordmarkDelayMs),
        Animated.parallel([
          Animated.timing(wordmarkOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(wordmarkTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  // Continuous ripple loop.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rippleScale, {
            toValue: 1.6,
            duration: ANIM.ringLoopMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: ANIM.ringLoopMs,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Exit animation, triggered when ready=true and the minimum visible
  // window has elapsed.
  useEffect(() => {
    if (!ready) return;
    const elapsed = Date.now() - mountedAt.current;
    const remaining = Math.max(0, minimumVisibleMs - elapsed);
    const t = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: ANIM.exitMs,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onFinish());
    }, remaining);
    return () => clearTimeout(t);
  }, [ready, minimumVisibleMs, onFinish, containerOpacity]);

  return (
    <Animated.View
      pointerEvents={ready ? 'none' : 'auto'}
      style={[styles.container, { opacity: containerOpacity }]}
    >
      <Animated.View
        style={[
          styles.markStage,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Ripple ring, animates outward continuously */}
        <Animated.View
          style={[
            styles.ring,
            styles.rippleRing,
            {
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />

        {/* Static rings for the Pulse mark */}
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={[styles.ring, styles.ringInner]} />
        <View style={styles.dot} />
      </Animated.View>

      <Animated.View
        style={[
          styles.wordmarkBlock,
          {
            opacity: wordmarkOpacity,
            transform: [{ translateY: wordmarkTranslateY }],
          },
        ]}
      >
        <Text style={styles.wordmark}>CheckInMap</Text>
        <Text style={styles.tagline}>Show up. Check in.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const MARK_SIZE = 120;
const RING_COLOR = '#ffffff';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markStage: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderColor: RING_COLOR,
    borderRadius: 999,
  },
  rippleRing: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    borderWidth: 1.5,
  },
  ringOuter: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    borderWidth: MARK_SIZE * 0.06,
    opacity: 0.22,
  },
  ringMid: {
    width: MARK_SIZE * 0.7,
    height: MARK_SIZE * 0.7,
    borderWidth: MARK_SIZE * 0.06,
    opacity: 0.55,
  },
  ringInner: {
    width: MARK_SIZE * 0.42,
    height: MARK_SIZE * 0.42,
    borderWidth: MARK_SIZE * 0.06,
    opacity: 1,
  },
  dot: {
    width: MARK_SIZE * 0.18,
    height: MARK_SIZE * 0.18,
    borderRadius: (MARK_SIZE * 0.18) / 2,
    backgroundColor: RING_COLOR,
  },
  wordmarkBlock: {
    alignItems: 'center',
    marginTop: 48,
  },
  wordmark: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
