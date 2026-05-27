import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await login(email, password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Inloggen is mislukt');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>)))</Text>
        </View>

        <Text style={styles.title}>Welkom terug</Text>
        <Text style={styles.subtitle}>Log in om je audiogram analyses te bekijken.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mailadres"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          placeholderTextColor="#64748B"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Inloggen</Text>}
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Nog geen account? </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Maak er een aan</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  card: {
    width: '100%',
    maxWidth: 393,
    padding: 28,
    backgroundColor: '#ffffff',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
  },
  logo: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#0F2A44',
    borderRadius: 36,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: '#475569',
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    height: 56,
    marginBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 16,
  },
  errorText: {
    marginBottom: 14,
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    backgroundColor: '#0F2A44',
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  bottomText: {
    color: '#475569',
    fontSize: 15,
  },
  linkText: {
    color: '#0F2A44',
    fontSize: 15,
    fontWeight: '700',
  },
});
