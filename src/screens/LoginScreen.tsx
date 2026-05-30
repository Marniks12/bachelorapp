import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Image,
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
import { fontFamilies } from '../styles/typography';
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
      setErrorMessage(getAuthErrorMessage(error, 'Inloggen is mislukt. Controleer je gegevens.'));
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
            <Image source={require('../../assets/logo.png')} style={styles.logo} />

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
              {isSubmitting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#ffffff" />
                  <Text style={styles.buttonText}>Inloggen...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Inloggen</Text>
              )}
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Nog geen account? </Text>
              <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Maak er een aan</Text>
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
    backgroundColor: '#FEF0F1',
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  logo: {
    width: 86,
    height: 86,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    width: '100%',
    color: '#000000',
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 56,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF7F7',
    borderColor: '#000000',
    borderRadius: 14,
    borderWidth: 1,
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 16,
  },
  errorText: {
    width: '100%',
    marginBottom: 14,
    color: '#DC2626',
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#F62222',
    borderRadius: 999,
    shadowColor: '#F62222',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonDisabled: {
    backgroundColor: '#FCA5A5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
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
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 15,
  },
  linkText: {
    color: '#F62222',
    fontFamily: fontFamilies.bodyBold,
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
