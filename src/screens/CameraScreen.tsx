import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { createDemoAnalysis } from '../api/analysisApi';
import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export function CameraScreen({ navigation }: CameraScreenProps) {
  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleTakePhoto() {
    if (isCreatingAnalysis) {
      return;
    }

    try {
      setIsCreatingAnalysis(true);
      setErrorMessage(null);
      await createDemoAnalysis();
      navigation.navigate('Result');
    } catch {
      setErrorMessage('Analyse kon niet aangemaakt worden.');
    } finally {
      setIsCreatingAnalysis(false);
    }
  }

  return (
    <PhoneCard contentStyle={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.controlPressed]}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../../assets/back_icon.png')} style={styles.backIcon} />
        </Pressable>
      </View>

      <View style={styles.previewContainer}>
        <View style={styles.scanArea}>
          <Image source={require('../../assets/image 4.png')} style={styles.previewImage} />
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <Image source={require('../../assets/lucide_camera.png')} style={styles.cameraIcon} />
          </View>
          <Text style={styles.actionLabel}>Neem een foto</Text>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <Image source={require('../../assets/lineicons_gallery.png')} style={styles.galleryIcon} />
          </View>
          <Text style={styles.actionLabel}>Of uit je gallerij</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleTakePhoto}
        disabled={isCreatingAnalysis}
      >
        <Text style={styles.buttonText}>{isCreatingAnalysis ? 'Analyse...' : 'Neem foto'}</Text>
      </Pressable>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-between',
  },
  header: {
    height: 48,
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F7',
    borderColor: '#C2D1D9',
    borderWidth: 1,
    borderRadius: 22,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  controlPressed: {
    opacity: 0.72,
  },
  previewContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#F2F5F7',
    borderColor: '#C2D1D9',
    borderRadius: 18,
    borderWidth: 1,
  },
  scanArea: {
    width: '100%',
    aspectRatio: 315 / 363,
    padding: 8,
    borderColor: '#000000',
    borderRadius: 14,
    borderWidth: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginVertical: 24,
  },
  actionItem: {
    width: 118,
    alignItems: 'center',
  },
  iconCircle: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 27,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  galleryIcon: {
    width: 25,
    height: 24,
    resizeMode: 'contain',
  },
  actionLabel: {
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
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
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
  errorText: {
    alignSelf: 'center',
    marginTop: 12,
    color: '#E60F30',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
});
