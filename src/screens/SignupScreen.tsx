import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { webViewportStyle } from '../styles/responsive';
import { RootStackParamList } from '../types/navigation';

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignup() {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await signup(name, email, password);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, 'Registreren is mislukt. Controleer je gegevens.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.container, webViewportStyle]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>)))</Text>
            </View>

            <Text style={styles.title}>Maak je Sonaris account</Text>
            <Text style={styles.subtitle}>Bewaar analyses veilig en bekijk alleen je eigen resultaten.</Text>

            <TextInput
              style={styles.input}
              placeholder="Naam"
              placeholderTextColor="#64748B"
              autoComplete="name"
              value={name}
              onChangeText={setName}
            />

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
              autoComplete="new-password"
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
              onPress={handleSignup}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#ffffff" />
                  <Text style={styles.buttonText}>Account maken...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Account maken</Text>
              )}
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Heb je al een account? </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: Platform.OS === 'web' ? 48 : 24,
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
    return 'Backend offline. Probeer later opnieuw.';
  }

  return error.message || fallback;
}
