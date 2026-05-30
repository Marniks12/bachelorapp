import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type ErrorScreenProps = NativeStackScreenProps<RootStackParamList, 'Error'>;

export function ErrorScreen({ navigation, route }: ErrorScreenProps) {
  return (
    <PhoneCard contentStyle={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={styles.title}>Analyse mislukt</Text>
      <Text style={styles.message}>{route.params.message}</Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>Nieuwe foto maken</Text>
      </Pressable>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#FEF0F1',
    borderRadius: 36,
  },
  iconText: {
    color: '#E60F30',
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 48,
  },
  title: {
    marginBottom: 12,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    textAlign: 'center',
  },
  message: {
    maxWidth: 300,
    marginBottom: 34,
    color: '#000000',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'center',
  },
});
