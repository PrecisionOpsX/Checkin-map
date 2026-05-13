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
import { BrandHeader } from '@/components/BrandHeader';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { sendReset } from '@/services/authService';
import { theme } from '@/theme';
import type { AuthStackParamList } from '@/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await sendReset(email.trim());
      setSuccess(true);
    } catch (e: any) {
      setError(
        e?.code === 'auth/user-not-found'
          ? 'No account found for that email.'
          : 'Could not send reset email. Try again.'
      );
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
        <View style={styles.brand}>
          <BrandHeader />
        </View>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          We will email you a link to reset your password.
        </Text>

        <View style={{ height: theme.spacing.xl }} />

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
          <Text style={styles.success}>
            If an account exists for that email, a reset link has been sent.
          </Text>
        ) : null}
        <Button label="Send reset link" onPress={onSubmit} loading={loading} size="lg" />
        <Button
          label="Back to sign in"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={{ marginTop: theme.spacing.xs }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  brand: {
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
  error: {
    color: theme.colors.danger,
    fontSize: theme.font.small,
    marginBottom: theme.spacing.sm,
  },
  success: {
    color: theme.colors.success,
    fontSize: theme.font.small,
    marginBottom: theme.spacing.sm,
  },
});
