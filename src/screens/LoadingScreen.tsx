import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type LoadingScreenProps = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export function LoadingScreen({ navigation }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Result');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <PhoneCard contentStyle={styles.card}>
      <Image source={require('../../assets/image 13.png')} style={styles.image} />

      <View style={styles.copyGroup}>
        <Text style={styles.title}>Je audiogram wordt geanalyseerd...</Text>
        <Text style={styles.subtitle}>Dit duurt een paar seconden</Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={styles.progressFill} />
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
    width: 312,
    height: 322,
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
  progressBackground: {
    width: '100%',
    maxWidth: 242,
    height: 20,
    backgroundColor: '#B8B6B6',
    borderRadius: 25,
    overflow: 'hidden',
  },
  progressFill: {
    width: '80%',
    height: '100%',
    backgroundColor: '#E60F30',
    borderRadius: 25,
  },
});
