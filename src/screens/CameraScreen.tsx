import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { uploadAudiogramAnalysis } from '../api/analysisApi';
import { PhoneCard } from '../components/PhoneCard';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export function CameraScreen({ navigation }: CameraScreenProps) {
  const { logout, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [patientLabel, setPatientLabel] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleTakePhoto() {
    if (isUploading) {
      return;
    }

    try {
      setErrorMessage(null);

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setErrorMessage('Camera-toegang is nodig om een audiogram te fotograferen.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch {
      setErrorMessage('Foto maken is mislukt. Probeer opnieuw.');
    }
  }

  async function handleSelectFromGallery() {
    if (isUploading) {
      return;
    }

    try {
      setErrorMessage(null);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setErrorMessage('Galerij-toegang is nodig om een audiogram te selecteren.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch {
      setErrorMessage('Afbeelding selecteren is mislukt. Controleer of het bestand een afbeelding is.');
    }
  }

  async function handleUploadAnalysis() {
    if (isUploading) {
      return;
    }

    if (!selectedImage) {
      setErrorMessage('Geen audiogram gekozen. Selecteer of maak eerst een foto.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const trimmedPatientLabel = patientLabel.trim();

      if (!trimmedPatientLabel) {
        setErrorMessage('Vul een patientlabel in voor deze analyse.');
        return;
      }

      const mimeType = selectedImage.mimeType ?? 'image/jpeg';

      if (!mimeType.startsWith('image/')) {
        setErrorMessage('Ongeldig bestand. Kies een afbeelding van een audiogram.');
        return;
      }

      const analysis = await uploadAudiogramAnalysis({
        uri: selectedImage.uri,
        patientLabel: trimmedPatientLabel,
      });

      navigation.navigate('Result', { analysis });
    } catch (error) {
      const message = error instanceof Error ? error.message : null;
      setErrorMessage(getUploadErrorMessage(message));

      if (message?.includes('Sessie verlopen') || message?.includes('Authenticatie vereist')) {
        await logout();
      }
    } finally {
      setIsUploading(false);
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
          <Image
            source={selectedImage ? { uri: selectedImage.uri } : require('../../assets/image 4.png')}
            style={styles.previewImage}
          />
          {isUploading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#ffffff" size="large" />
              <Text style={styles.loadingText}>Analyse wordt uitgevoerd...</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.patientLabelField}>
        <Text style={styles.inputLabel}>Patientlabel</Text>
        <TextInput
          style={styles.patientLabelInput}
          value={patientLabel}
          onChangeText={setPatientLabel}
          placeholder={user?.name ? `Bijv. ${user.name}` : 'Bijv. patient 1'}
          placeholderTextColor="#64748B"
          autoCapitalize="words"
          editable={!isUploading}
          maxLength={80}
          returnKeyType="done"
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionItem, pressed && styles.controlPressed]}
          onPress={handleTakePhoto}
          disabled={isUploading}
        >
          <View style={styles.iconCircle}>
            <Image source={require('../../assets/lucide_camera.png')} style={styles.cameraIcon} />
          </View>
          <Text style={styles.actionLabel}>Neem een foto</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionItem, pressed && styles.controlPressed]}
          onPress={handleSelectFromGallery}
          disabled={isUploading}
        >
          <View style={styles.iconCircle}>
            <Image source={require('../../assets/lineicons_gallery.png')} style={styles.galleryIcon} />
          </View>
          <Text style={styles.actionLabel}>Of uit je galerij</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!selectedImage || !patientLabel.trim() || isUploading) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleUploadAnalysis}
        disabled={!selectedImage || !patientLabel.trim() || isUploading}
      >
        {isUploading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#ffffff" />
            <Text style={styles.buttonText}>Analyse wordt uitgevoerd...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Analyseer audiogram</Text>
        )}
      </Pressable>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-start',
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
    position: 'relative',
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
    maxHeight: 360,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.72)',
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginVertical: 18,
  },
  patientLabelField: {
    width: '100%',
    marginTop: 16,
  },
  inputLabel: {
    marginBottom: 6,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  patientLabelInput: {
    width: '100%',
    minHeight: 48,
    paddingHorizontal: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 22,
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
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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

function getUploadErrorMessage(message: string | null): string {
  if (!message) {
    return 'Upload mislukt. Controleer je verbinding en probeer opnieuw.';
  }

  if (message.includes('Network request failed') || message.includes('Failed to fetch')) {
    return 'Backend offline. Probeer later opnieuw.';
  }

  if (message.includes('Sessie verlopen') || message.includes('Authenticatie vereist')) {
    return 'Sessie verlopen. Log opnieuw in.';
  }

  if (message.toLowerCase().includes('upload') || message.toLowerCase().includes('audiogram')) {
    return 'Upload mislukt. Probeer opnieuw.';
  }

  return message;
}
