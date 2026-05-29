import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type LoadingScreenProps = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export function LoadingScreen(_props: LoadingScreenProps) {
  return (
    <PhoneCard contentStyle={styles.card}>
      <Image source={require('../../assets/image 13.png')} style={styles.image} />

      <View style={styles.copyGroup}>
        <Text style={styles.title}>Analyse wordt uitgevoerd...</Text>
        <Text style={styles.subtitle}>Dit duurt een paar seconden</Text>
      </View>

      <View style={styles.spinnerWrap}>
        <ActivityIndicator color="#E60F30" size="large" />
      </View>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxWidth: 312,
    aspectRatio: 312 / 322,
    marginBottom: 36,
    resizeMode: 'contain',
  },
  copyGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    maxWidth: 280,
    marginBottom: 14,
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'center',
  },
  spinnerWrap: {
    height: 44,
    justifyContent: 'center',
  },
});
