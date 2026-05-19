import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation }: ResultScreenProps) {
  return (
    <PhoneCard contentStyle={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Image source={require('../../assets/back_icon.png')} style={styles.backIcon} />
        </Pressable>
      </View>

      <Text style={styles.title}>Ernstige hoorverlies</Text>

      <Image source={require('../../assets/image 17.png')} style={styles.chart} />

      <View style={styles.resultCopy}>
        <Text style={styles.subtitle}>Ernstige hoorverlies</Text>
        <Text style={styles.description}>
          Binnen verschillende richtlijnen worden voor dit profiel aanvullende klinische
          parameters meegenomen bij de evaluatie.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.readMoreButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate('ResultDetail')}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.downloadButton, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('DashboardNewUser')}
      >
        <Text style={styles.downloadText}>Download PDF</Text>
      </Pressable>
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
    marginBottom: 18,
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
  pressed: {
    opacity: 0.72,
  },
  title: {
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
    textAlign: 'left',
  },
  chart: {
    alignSelf: 'center',
    width: 319,
    height: 256,
    marginTop: 28,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  resultCopy: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  subtitle: {
    marginBottom: 10,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'left',
  },
  description: {
    maxWidth: 280,
    marginBottom: 18,
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 26,
    textAlign: 'left',
  },
  readMoreButton: {
    width: 142,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#161A1D',
    borderRadius: 999,
    borderWidth: 1,
  },
  readMoreText: {
    color: '#161A1D',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'center',
  },
  downloadButton: {
    alignSelf: 'center',
    width: 255,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    backgroundColor: '#E60F30',
    borderRadius: 999,
    shadowColor: '#E60F30',
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
  downloadText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
