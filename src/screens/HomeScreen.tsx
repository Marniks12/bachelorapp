import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <PhoneCard contentStyle={styles.card}>
      <Image source={require('../../assets/image 14.png')} style={styles.image} />

      <View style={styles.copyGroup}>
        <Text style={styles.bodyText}>
          Scan jou audiogrammen met onze app en geef de beste resultaten aan u patienten
        </Text>

        <Text style={styles.bodyText}>
          Ontvang een analyse en inzichten over je audiogram
        </Text>

        <Pressable
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
          onPress={() => navigation.navigate('InfoCarousel')}
        >
          <Text style={styles.link}>Meer info over de app</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>Verdergaan</Text>
      </Pressable>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 230,
    height: 263,
    marginBottom: 64,
    resizeMode: 'contain',
  },
  copyGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 54,
  },
  bodyText: {
    maxWidth: 296,
    marginBottom: 22,
    color: '#000000',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 29,
    textAlign: 'center',
  },
  link: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 28,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  linkPressed: {
    opacity: 0.62,
  },
  button: {
    width: 255,
    height: 60,
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
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
