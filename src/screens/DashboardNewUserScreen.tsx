import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';

type DashboardNewUserScreenProps = NativeStackScreenProps<RootStackParamList, 'DashboardNewUser'>;

function getAnalysisCardTitle(patientLabel: string | undefined): string {
  const label = patientLabel?.trim();

  if (label) {
    return label;
  }

  return 'Mijn analyse';
}

export function DashboardNewUserScreen({ navigation }: DashboardNewUserScreenProps) {
  const { user, logout } = useAuth();
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
  const [statusMessage, setStatusMessage] = useState('Analyses laden...');

  const loadLatestAnalysis = useCallback(async () => {
    try {
      setStatusMessage('Analyses laden...');
      const analyses = await getAnalyses();
      setLatestAnalysis(analyses[0] ?? null);
      setStatusMessage(analyses.length === 0 ? 'Nog geen analyses beschikbaar.' : '');
    } catch (error) {
      setLatestAnalysis(null);
      const message = error instanceof Error ? error.message : 'Analyses konden niet geladen worden.';
      setStatusMessage(message);

      if (message.includes('Sessie verlopen') || message.includes('Authenticatie vereist')) {
        await logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    loadLatestAnalysis();

    const unsubscribe = navigation.addListener('focus', loadLatestAnalysis);

    return unsubscribe;
  }, [loadLatestAnalysis, navigation]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.greeting}>Hallo {user?.name ?? 'Sonaris'}</Text>
        <Text style={styles.subtitle}>Welkom Sonaris dashboard</Text>

        <Pressable style={styles.scanCard} onPress={() => navigation.navigate('Camera')}>
          <Image source={require('../../assets/Rectangle.png')} style={styles.scanIcon} />
          <Text style={styles.scanTitle}>Nieuwe audiogram scannen</Text>
          <Text style={styles.scanDescription}>
            Maak een foto van je audiogram en ontvang je direct analyse voor je patient
          </Text>
          <View style={styles.redArrowCircle}>
            <Text style={styles.whiteArrow}>&gt;</Text>
          </View>
        </Pressable>

        <Text style={styles.firstAnalysisTitle}>Jouw laatste analyse</Text>

        {latestAnalysis ? (
          <Pressable
            style={styles.firstAnalysisCard}
            onPress={() => navigation.navigate('AnalysisDetails', { analysis: latestAnalysis })}
          >
            <Image source={{ uri: latestAnalysis.imageUrl }} style={styles.firstAnalysisThumb} />
            <Text style={styles.firstAnalysisDate}>
              {getAnalysisCardTitle(latestAnalysis.patientLabel)}
            </Text>
            <Text style={styles.firstAnalysisSeverity}>{latestAnalysis.severity}</Text>
            <Text style={styles.cardArrow}>&gt;</Text>
          </Pressable>
        ) : (
          <View style={styles.firstAnalysisCard}>
            <Text style={styles.emptyText}>{statusMessage}</Text>
          </View>
        )}

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
    justifyContent: 'center',
    minHeight: 760,
    paddingVertical: 16,
    backgroundColor: '#111827',
  },
  content: {
    position: 'relative',
    width: 393,
    height: 720,
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
  },
  greeting: {
    position: 'absolute',
    left: 49,
    top: 90,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  subtitle: {
    position: 'absolute',
    left: 49,
    top: 127,
    width: 225,
    color: 'rgba(0,0,0,0.72)',
    fontFamily: 'Anek Tamil',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  scanCard: {
    position: 'absolute',
    left: 23,
    top: 151,
    width: 356,
    height: 140,
    backgroundColor: '#FEF0F1',
    borderRadius: 19,
  },
  scanIcon: {
    position: 'absolute',
    left: 5,
    top: 23,
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  scanTitle: {
    position: 'absolute',
    left: 55,
    top: 29,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 20,
    lineHeight: 26,
  },
  scanDescription: {
    position: 'absolute',
    left: 57,
    top: 60,
    width: 225,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  redArrowCircle: {
    position: 'absolute',
    left: 315,
    top: 49,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E60F30',
    borderRadius: 9999,
  },
  whiteArrow: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  firstAnalysisTitle: {
    position: 'absolute',
    left: 28,
    top: 304,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 15,
    lineHeight: 20,
  },
  firstAnalysisCard: {
    position: 'absolute',
    left: 23,
    top: 341,
    width: 329,
    height: 111,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  firstAnalysisThumb: {
    position: 'absolute',
    left: 18,
    top: 14,
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  firstAnalysisDate: {
    position: 'absolute',
    left: 129,
    top: 28,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  firstAnalysisSeverity: {
    position: 'absolute',
    left: 129,
    top: 59,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  emptyText: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 42,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  cardArrow: {
    position: 'absolute',
    left: 294,
    top: 33,
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
  button: {
    position: 'absolute',
    left: 62,
    top: 585,
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
