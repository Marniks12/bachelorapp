import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { getAnalyses } from '../api/analysisApi';
import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type OldAnalysisScreenProps = NativeStackScreenProps<RootStackParamList, 'OldAnalysis'>;

export function OldAnalysisScreen({ navigation }: OldAnalysisScreenProps) {
  const [message, setMessage] = useState('Analyse laden...');
  const [isLoading, setIsLoading] = useState(true);

  const loadLatestAnalysis = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('Analyse laden...');
      const analyses = await getAnalyses();
      const latestAnalysis = analyses[0];

      if (latestAnalysis) {
        navigation.replace('AnalysisDetails', { analysis: latestAnalysis });
        return;
      }

      setMessage('Nog geen analyses beschikbaar.');
    } catch {
      setMessage('Analyse kon niet geladen worden.');
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadLatestAnalysis();
  }, [loadLatestAnalysis]);

  return (
    <PhoneCard contentStyle={styles.card}>
      {isLoading ? <ActivityIndicator color="#E60F30" size="large" /> : null}
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>Naar dashboard</Text>
      </Pressable>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    maxWidth: 280,
    marginTop: 18,
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 220,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    backgroundColor: '#E60F30',
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
});
