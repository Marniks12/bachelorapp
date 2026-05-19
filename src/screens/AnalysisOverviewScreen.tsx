import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../types/navigation';

type AnalysisOverviewScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisOverview'>;

type AnalysisCard = {
  date: string;
  severity: string;
  top: number;
  pillTop: number;
};

const analyses: AnalysisCard[] = [
  {
    date: '22 februari 2026',
    severity: 'Matige gehoorverlies',
    top: 160,
    pillTop: 200,
  },
  {
    date: '14 januari 2026',
    severity: 'Matige gehoorverlies',
    top: 269,
    pillTop: 309,
  },
  {
    date: '14 februari 2026',
    severity: 'Lichte gehoorverlies',
    top: 378,
    pillTop: 419,
  },
  {
    date: '24 februari 2026',
    severity: 'Matige gehoorverlies',
    top: 495,
    pillTop: 535,
  },
  {
    date: '24 maart 2026',
    severity: 'Matige gehoorverlies',
    top: 604,
    pillTop: 644,
  },
];

export function AnalysisOverviewScreen({ navigation }: AnalysisOverviewScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Pressable style={styles.closeButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.closeText}>X</Text>
        </Pressable>

        <Text style={styles.title}>AL jou analyses</Text>

        {analyses.map((analysis) => (
          <Pressable
            key={`${analysis.date}-${analysis.top}`}
            style={[styles.card, { top: analysis.top }]}
            onPress={() => navigation.navigate('OldAnalysis')}
          >
            <Image source={require('../../assets/image 17.png')} style={styles.thumbnail} />
            <Text style={styles.date}>{analysis.date}</Text>
            <View style={[styles.pill, { top: analysis.pillTop - analysis.top }]} />
            <Text style={[styles.pillText, { top: analysis.pillTop - analysis.top - 1 }]}>
              {analysis.severity}
            </Text>
            <Text style={styles.arrow}>&gt;</Text>
          </Pressable>
        ))}

        <Pressable style={styles.button} onPress={() => navigation.navigate('Dashboard')}>
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
    backgroundColor: '#111827',
  },
  content: {
    position: 'relative',
    width: 393,
    height: 950,
    backgroundColor: '#ffffff',
  },
  closeButton: {
    position: 'absolute',
    left: 345,
    top: 36,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  title: {
    position: 'absolute',
    left: 23,
    top: 84,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  card: {
    position: 'absolute',
    left: 23,
    width: 329,
    height: 79,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  thumbnail: {
    position: 'absolute',
    left: 18,
    top: 11,
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  date: {
    position: 'absolute',
    left: 129,
    top: 14,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  pill: {
    position: 'absolute',
    left: 125,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillText: {
    position: 'absolute',
    left: 144,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  arrow: {
    position: 'absolute',
    left: 294,
    top: 24,
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
  button: {
    position: 'absolute',
    left: 69,
    top: 857,
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
