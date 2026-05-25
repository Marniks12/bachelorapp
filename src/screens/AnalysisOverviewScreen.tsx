import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { RootStackParamList } from '../types/navigation';

type AnalysisOverviewScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisOverview'>;

function formatAnalysisDate(createdAt?: string): string {
  if (!createdAt) {
    return 'Onbekende datum';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Onbekende datum';
  }

  return new Intl.DateTimeFormat('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function AnalysisOverviewScreen({ navigation }: AnalysisOverviewScreenProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [statusMessage, setStatusMessage] = useState('Analyses laden...');

  const loadAnalyses = useCallback(async () => {
    try {
      setStatusMessage('Analyses laden...');
      const analyses = await getAnalyses();
      setAnalyses(analyses);
      setStatusMessage(analyses.length === 0 ? 'Nog geen analyses beschikbaar.' : '');
    } catch {
      setAnalyses([]);
      setStatusMessage('Analyses konden niet geladen worden.');
    }
  }, []);

  useEffect(() => {
    loadAnalyses();

    const unsubscribe = navigation.addListener('focus', loadAnalyses);

    return unsubscribe;
  }, [loadAnalyses, navigation]);

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

        {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}

        {analyses.map((analysis, index) => (
          <Pressable
            key={analysis._id}
            style={[styles.card, { top: 160 + index * 109 }]}
            onPress={() => navigation.navigate('AnalysisDetails', { analysis })}
          >
            <Image source={{ uri: analysis.imageUrl }} style={styles.thumbnail} />
            <Text style={styles.date}>{formatAnalysisDate(analysis.createdAt)}</Text>
            <View style={styles.pill} />
            <Text style={styles.pillText}>
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
  statusText: {
    position: 'absolute',
    left: 23,
    right: 23,
    top: 160,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
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
    top: 40,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillText: {
    position: 'absolute',
    left: 144,
    top: 39,
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
