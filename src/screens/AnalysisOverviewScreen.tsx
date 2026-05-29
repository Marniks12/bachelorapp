import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { useAuth } from '../context/AuthContext';
import { webViewportStyle } from '../styles/responsive';
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
  const { logout } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [statusMessage, setStatusMessage] = useState('Analyses laden...');

  const loadAnalyses = useCallback(async () => {
    try {
      setStatusMessage('Analyses laden...');
      const analyses = await getAnalyses();
      setAnalyses(analyses);
      setStatusMessage(analyses.length === 0 ? 'Nog geen analyses beschikbaar.' : '');
    } catch (error) {
      setAnalyses([]);
      const message = error instanceof Error ? error.message : 'Analyses konden niet geladen worden.';
      setStatusMessage(message);

      if (message.includes('Sessie verlopen') || message.includes('Authenticatie vereist')) {
        await logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    loadAnalyses();

    const unsubscribe = navigation.addListener('focus', loadAnalyses);

    return unsubscribe;
  }, [loadAnalyses, navigation]);

  return (
    <SafeAreaView style={[styles.container, webViewportStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Al jouw analyses</Text>
            <Pressable style={styles.closeButton} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>

          {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}

          {analyses.map((analysis) => (
            <Pressable
              key={analysis._id}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AnalysisDetails', { analysis })}
            >
              <Image source={{ uri: analysis.imageUrl }} style={styles.thumbnail} />
              <View style={styles.cardCopy}>
                <Text style={styles.date}>{formatAnalysisDate(analysis.createdAt)}</Text>
                <Text style={styles.pillText} numberOfLines={1}>
                  {analysis.severity}
                </Text>
              </View>
              <Text style={styles.arrow}>&gt;</Text>
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.buttonText}>Verdergaan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 48 : 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
    borderRadius: 30,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  closeButton: {
    width: 36,
    height: 36,
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
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  statusText: {
    marginBottom: 16,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
    padding: 14,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  thumbnail: {
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
  },
  date: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  pillText: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: '#ffffff',
    backgroundColor: '#F62222',
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 16,
    overflow: 'hidden',
  },
  arrow: {
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    backgroundColor: '#F62222',
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  pressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
