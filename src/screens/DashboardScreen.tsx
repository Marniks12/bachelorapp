import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
type DashboardAnalysisCard = {
  id: string;
  patientLabel: string;
  severity: string;
  createdAt: string;
};

const MOCK_ANALYSIS_DATE = '24 februari 2026';
const MOCK_ANALYSIS_CARDS: DashboardAnalysisCard[] = [
  {
    id: 'mock-latest',
    patientLabel: 'Emma',
    severity: 'Ernstige gehoorvlies',
    createdAt: MOCK_ANALYSIS_DATE,
  },
  {
    id: 'mock-earlier-one',
    patientLabel: 'Emma',
    severity: 'Matige gehoorverlies',
    createdAt: MOCK_ANALYSIS_DATE,
  },
  {
    id: 'mock-earlier-two',
    patientLabel: 'Emma',
    severity: 'Lichte gehoorverlies',
    createdAt: MOCK_ANALYSIS_DATE,
  },
];

function formatAnalysisDate(createdAt?: string): string {
  if (!createdAt) {
    return MOCK_ANALYSIS_DATE;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return MOCK_ANALYSIS_DATE;
  }

  return new Intl.DateTimeFormat('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAnalyses = useCallback(async () => {
    try {
      setIsLoadingAnalyses(true);
      setErrorMessage(null);
      const analyses = await getAnalyses();
      setAnalyses(analyses);
    } catch {
      setAnalyses([]);
      setErrorMessage('Analyses konden niet geladen worden.');
    } finally {
      setIsLoadingAnalyses(false);
    }
  }, []);

  useEffect(() => {
    loadAnalyses();

    const unsubscribe = navigation.addListener('focus', loadAnalyses);

    return unsubscribe;
  }, [loadAnalyses, navigation]);

  const analysisCards: DashboardAnalysisCard[] = analyses.slice(0, 3).map((analysis) => ({
    id: analysis._id,
    patientLabel: analysis.patientLabel,
    severity: analysis.severity,
    createdAt: formatAnalysisDate(analysis.createdAt),
  }));
  const visibleAnalysisCards = analysisCards.length > 0 ? analysisCards : MOCK_ANALYSIS_CARDS;
  const statusMessage = isLoadingAnalyses ? 'Analyses laden...' : errorMessage;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.greeting}>Hallo Emma</Text>
        <Text style={styles.subtitle}>Welkom terug bij Sonaris</Text>

        <Pressable style={styles.scanCard} onPress={() => navigation.navigate('Camera')}>
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

        {statusMessage ? (
          <View style={styles.latestCard}>
            <Image source={require('../../assets/image 17.png')} style={styles.latestThumb} />
            <Text style={styles.latestDate}>{statusMessage}</Text>
          </View>
        ) : null}

        {!statusMessage && visibleAnalysisCards.map((analysis, index) => {
          if (index === 0) {
            return (
              <Pressable
                key={analysis.id}
                style={styles.latestCard}
                onPress={() => navigation.navigate('OldAnalysis')}
              >
                <Image source={require('../../assets/image 17.png')} style={styles.latestThumb} />
                <Text style={styles.latestDate}>{analysis.patientLabel}</Text>
                <Text style={styles.latestSeverity}>{analysis.severity}</Text>
                <Text style={styles.latestCreatedAt}>{analysis.createdAt}</Text>
                <Text style={styles.cardArrow}>›</Text>
              </Pressable>
            );
          }

          const earlierStyles =
            index === 1
              ? {
                  card: styles.earlierCardOne,
                  thumb: styles.earlierThumbOne,
                  patientLabel: styles.earlierDateOne,
                  pill: styles.pillOne,
                  severity: styles.pillTextOne,
                  arrow: styles.earlierArrowOne,
                  createdAt: styles.earlierCreatedAtOne,
                }
              : {
                  card: styles.earlierCardTwo,
                  thumb: styles.earlierThumbTwo,
                  patientLabel: styles.earlierDateTwo,
                  pill: styles.pillTwo,
                  severity: styles.pillTextTwo,
                  arrow: styles.earlierArrowTwo,
                  createdAt: styles.earlierCreatedAtTwo,
                };

          return (
            <Pressable
              key={analysis.id}
              style={earlierStyles.card}
              onPress={() => navigation.navigate('OldAnalysis')}
            >
              <Image source={require('../../assets/image 17.png')} style={earlierStyles.thumb} />
              <Text style={earlierStyles.patientLabel}>{analysis.patientLabel}</Text>
              <Text style={earlierStyles.createdAt}>{analysis.createdAt}</Text>
              <View style={earlierStyles.pill} />
              <Text style={earlierStyles.severity}>{analysis.severity}</Text>
              <Text style={earlierStyles.arrow}>›</Text>
            </Pressable>
          );
        })}

        <Text style={styles.earlierTitle}>Eerder analyses</Text>
        <Pressable onPress={() => navigation.navigate('AnalysisOverview')}>
          <Text style={styles.viewAll}>Bekijk alle</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Camera')}>
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
    top: 22,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  latestSeverity: {
    position: 'absolute',
    top: 50,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  latestCreatedAt: {
    position: 'absolute',
    top: 76,
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
    top: 10,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierDateTwo: {
    position: 'absolute',
    top: 10,
    left: 129,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierCreatedAtOne: {
    position: 'absolute',
    top: 29,
    left: 129,
    color: '#000000',
    fontSize: 12,
    lineHeight: 16,
  },
  earlierCreatedAtTwo: {
    position: 'absolute',
    top: 29,
    left: 129,
    color: '#000000',
    fontSize: 12,
    lineHeight: 16,
  },
  pillOne: {
    position: 'absolute',
    top: 50,
    left: 125,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTwo: {
    position: 'absolute',
    top: 50,
    left: 129,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTextOne: {
    position: 'absolute',
    top: 49,
    left: 144,
    color: '#D9D9D9',
    fontSize: 12,
    lineHeight: 16,
  },
  pillTextTwo: {
    position: 'absolute',
    top: 49,
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
