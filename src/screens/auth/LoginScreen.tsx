import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { signIn } from '@/services/authService';
import { theme } from '@/theme';
import type { AuthStackParamList } from '@/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(friendlyAuthError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + theme.spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>CheckInMap</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>
          Welcome back. Please enter your details.
        </Text>

        <View style={{ height: theme.spacing.xl }} />

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Sign in" onPress={onSubmit} loading={loading} size="lg" />

        <View style={styles.linksRow}>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot password?
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('Signup')}
          >
            Create an account
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function friendlyAuthError(code?: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a moment.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Could not sign in. Please try again.';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  brand: {
    fontSize: theme.font.small,
    fontWeight: '600',
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.font.display,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  linksRow: {
    alignItems: 'flex-start',
    marginTop: theme.spacing.md,
  },
  link: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: theme.font.small,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.font.small,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
  },
  footerLink: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: theme.font.small,
  },
});
