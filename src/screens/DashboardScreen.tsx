import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../types/navigation';

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.greeting}>Hallo Emma</Text>
        <Text style={styles.subtitle}>Welkom terug bij Sonaris</Text>

        <Pressable style={styles.scanCard} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/Rectangle.png')} style={styles.scanIcon} />
          <Text style={styles.scanTitle}>Nieuwe audiogram scannen</Text>
          <Text style={styles.scanDescription}>
            Maak een foto van je audiogram en ontvang je direct analyse voor je patient
          </Text>
          <View style={styles.redArrowCircle}>
            <Text style={styles.whiteArrow}>›</Text>
          </View>
        </Pressable>

        <Text style={styles.latestTitle}>Laaste  Analyse</Text>

        <Pressable style={styles.latestCard} onPress={() => navigation.navigate('OldAnalysis')}>
          <Image source={require('../../assets/image 17.png')} style={styles.latestThumb} />
          <Text style={styles.latestDate}>24 februari 2026</Text>
          <Text style={styles.latestSeverity}>Ernstige gehoorvlies</Text>
          <Text style={styles.cardArrow}>›</Text>
        </Pressable>

        <Text style={styles.earlierTitle}>Eerder analyses</Text>
        <Pressable onPress={() => navigation.navigate('AnalysisOverview')}>
          <Text style={styles.viewAll}>Bekijk alle</Text>
        </Pressable>

        <View style={styles.earlierCardOne}>
          <Image source={require('../../assets/image 17.png')} style={styles.earlierThumbOne} />
          <Text style={styles.earlierDateOne}>24 februari 2026</Text>
          <View style={styles.pillOne} />
          <Text style={styles.pillTextOne}>Matige gehoorverlies</Text>
          <Text style={styles.earlierArrowOne}>›</Text>
        </View>

        <View style={styles.earlierCardTwo}>
          <Image source={require('../../assets/image 17.png')} style={styles.earlierThumbTwo} />
          <Text style={styles.earlierDateTwo}>24 februari 2026</Text>
          <View style={styles.pillTwo} />
          <Text style={styles.pillTextTwo}>Lichte gehoorverlies</Text>
          <Text style={styles.earlierArrowTwo}>›</Text>
        </View>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Verdergaan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 950,
    paddingVertical: 16,
  },
  content: {
    position: 'relative',
    width: 393,
    minHeight: 950,
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
  },
  greeting: {
    position: 'absolute',
    top: 90,
    left: 49,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  subtitle: {
    position: 'absolute',
    top: 127,
    left: 49,
    width: 225,
    color: 'rgba(0,0,0,0.72)',
    fontSize: 15,
    lineHeight: 20,
  },
  scanCard: {
    position: 'absolute',
    top: 151,
    left: 23,
    width: 356,
    height: 140,
    backgroundColor: '#FEF0F1',
    borderRadius: 19,
  },
  scanIcon: {
    position: 'absolute',
    top: 23,
    left: 5,
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  scanTitle: {
    position: 'absolute',
    top: 29,
    left: 55,
    color: '#000000',
    fontSize: 20,
    lineHeight: 26,
  },
  scanDescription: {
    position: 'absolute',
    top: 60,
    left: 57,
    width: 225,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  redArrowCircle: {
    position: 'absolute',
    top: 49,
    left: 315,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E60F30',
    borderRadius: 9999,
  },
  whiteArrow: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 29,
  },
  latestTitle: {
    position: 'absolute',
    top: 304,
    left: 28,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  latestCard: {
    position: 'absolute',
    top: 341,
    left: 23,
    width: 329,
    height: 111,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  latestThumb: {
    position: 'absolute',
    top: 14,
    left: 18,
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  latestDate: {
    position: 'absolute',
    top: 28,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  latestSeverity: {
    position: 'absolute',
    top: 59,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  cardArrow: {
    position: 'absolute',
    top: 28,
    left: 294,
    color: '#000000',
    fontSize: 34,
    lineHeight: 36,
  },
  earlierTitle: {
    position: 'absolute',
    top: 531,
    left: 31,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  viewAll: {
    position: 'absolute',
    top: 531,
    left: 265,
    color: '#F62222',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierCardOne: {
    position: 'absolute',
    top: 582,
    left: 23,
    width: 329,
    height: 79,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  earlierCardTwo: {
    position: 'absolute',
    top: 691,
    left: 23,
    width: 329,
    height: 79,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  earlierThumbOne: {
    position: 'absolute',
    top: 14,
    left: 18,
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  earlierThumbTwo: {
    position: 'absolute',
    top: 14,
    left: 18,
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  earlierDateOne: {
    position: 'absolute',
    top: 14,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierDateTwo: {
    position: 'absolute',
    top: 14,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  pillOne: {
    position: 'absolute',
    top: 40,
    left: 125,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTwo: {
    position: 'absolute',
    top: 41,
    left: 129,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTextOne: {
    position: 'absolute',
    top: 39,
    left: 144,
    color: '#D9D9D9',
    fontSize: 12,
    lineHeight: 16,
  },
  pillTextTwo: {
    position: 'absolute',
    top: 40,
    left: 148,
    color: '#D9D9D9',
    fontSize: 12,
    lineHeight: 16,
  },
  earlierArrowOne: {
    position: 'absolute',
    top: 24,
    left: 294,
    color: '#000000',
    fontSize: 34,
    lineHeight: 36,
  },
  earlierArrowTwo: {
    position: 'absolute',
    top: 24,
    left: 294,
    color: '#000000',
    fontSize: 34,
    lineHeight: 36,
  },
  button: {
    position: 'absolute',
    top: 857,
    left: 69,
    width: 255,
    height: 68.66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F62222',
    borderRadius: 999,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
