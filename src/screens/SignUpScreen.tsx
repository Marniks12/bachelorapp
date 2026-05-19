import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RootStackParamList } from '../types/navigation';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.reference}>
        <View style={styles.card} />

        <View style={styles.logo}>
          <Text style={styles.logoText}>)))</Text>
        </View>

        <TextInput
          style={styles.emailInput}
          placeholder="Email adress"
          placeholderTextColor="rgba(0,0,0,0.51)"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="rgba(0,0,0,0.51)"
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  reference: {
    position: 'relative',
    width: '100%',
    maxWidth: 393,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  card: {
    position: 'absolute',
    top: 62,
    left: 34,
    width: 325,
    height: 745,
    backgroundColor: '#FCE2E4',
    borderRadius: 36,
  },
  logo: {
    position: 'absolute',
    top: 104,
    left: 154,
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E60F30',
    borderRadius: 1000,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 30,
  },
  emailInput: {
    position: 'absolute',
    top: 306,
    left: 58,
    width: 278,
    height: 60,
    paddingHorizontal: 22,
    borderColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
  },
  passwordInput: {
    position: 'absolute',
    top: 426,
    left: 58,
    width: 278,
    height: 60,
    paddingHorizontal: 22,
    borderColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
  },
  button: {
    position: 'absolute',
    top: 558,
    left: 69,
    width: 255,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E60F30',
    borderRadius: 999,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
  bottomRow: {
    position: 'absolute',
    top: 636,
    left: 0,
    width: 393,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
  },
  linkText: {
    color: '#E60F30',
    fontSize: 16,
    fontWeight: '600',
  },
});
