import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { useAuth } from '../context/AuthContext';
import { webViewportStyle } from '../styles/responsive';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

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

function formatConfidence(confidence?: string): string {
  if (!confidence?.trim()) {
    return 'Betrouwbaarheid onbekend';
  }

  return confidence.toLowerCase().includes('betrouwbaarheid')
    ? confidence
    : `Betrouwbaarheid: ${confidence}`;
}

function getAnalysisCardTitle(patientLabel: string | undefined): string {
  const label = patientLabel?.trim();

  return label || 'Mijn analyse';
}

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user, logout } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.navigate('Login');
  }, [logout, navigation]);

  const loadAnalyses = useCallback(async () => {
    try {
      setIsLoadingAnalyses(true);
      setErrorMessage(null);
      const analyses = await getAnalyses();
      setAnalyses(analyses);
    } catch (error) {
      setAnalyses([]);
      const message = getDashboardErrorMessage(error);
      setErrorMessage(message);

      if (message.includes('Sessie verlopen') || message.includes('Authenticatie vereist')) {
        await logout();
      }
    } finally {
      setIsLoadingAnalyses(false);
    }
  }, [logout]);

  useEffect(() => {
    loadAnalyses();

    const unsubscribe = navigation.addListener('focus', loadAnalyses);

    return unsubscribe;
  }, [loadAnalyses, navigation]);

  const latestAnalysis = analyses[0];
  const earlierAnalyses = analyses.slice(1, 3);
  const statusMessage = isLoadingAnalyses ? 'Analyses laden...' : errorMessage;
  const emptyMessage =
    !statusMessage && analyses.length === 0
      ? 'Nog geen analyses gevonden. Start je eerste audiogramanalyse.'
      : null;

  return (
    <SafeAreaView style={[styles.container, webViewportStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting} numberOfLines={1}>
                Hallo {user?.name ?? 'Sonaris'}
              </Text>
              <Text style={styles.subtitle}>Welkom terug bij Sonaris</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Uitloggen</Text>
            </Pressable>
          </View>

          <Pressable style={({ pressed }) => [styles.scanCard, pressed && styles.pressed]} onPress={() => navigation.navigate('Camera')}>
            <Image source={require('../../assets/Rectangle.png')} style={styles.scanIcon} />
            <View style={styles.scanCopy}>
              <Text style={styles.scanTitle}>Nieuwe audiogram scannen</Text>
              <Text style={styles.scanDescription}>
                Maak een foto van je audiogram en ontvang je direct analyse voor je patient
              </Text>
            </View>
            <View style={styles.redArrowCircle}>
              <Text style={styles.whiteArrow}>&gt;</Text>
            </View>
          </Pressable>

          <Text style={styles.sectionTitle}>Laatste analyse</Text>

          {statusMessage ? (
            <View style={styles.latestCard}>
              {isLoadingAnalyses ? <ActivityIndicator color="#E60F30" /> : null}
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          {emptyMessage ? (
            <View style={styles.latestCard}>
              <Text style={styles.statusText}>{emptyMessage}</Text>
            </View>
          ) : null}

          {!statusMessage && latestAnalysis ? (
            <AnalysisCard
              analysis={latestAnalysis}
              isLatest
              onPress={() => navigation.navigate('AnalysisDetails', { analysis: latestAnalysis })}
            />
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eerdere analyses</Text>
            <Pressable onPress={() => navigation.navigate('AnalysisOverview')}>
              <Text style={styles.viewAll}>Bekijk alle</Text>
            </Pressable>
          </View>

          {earlierAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis._id}
              analysis={analysis}
              onPress={() => navigation.navigate('AnalysisDetails', { analysis })}
            />
          ))}

          {!statusMessage && earlierAnalyses.length === 0 ? (
            <Text style={styles.emptyEarlierText}>Geen eerdere analyses.</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.buttonText}>Verdergaan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AnalysisCard({
  analysis,
  isLatest,
  onPress,
}: {
  analysis: Analysis;
  isLatest?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.analysisCard, isLatest && styles.latestAnalysisCard, pressed && styles.pressed]} onPress={onPress}>
      <Image
        source={analysis.imageUrl ? { uri: analysis.imageUrl } : require('../../assets/image 17.png')}
        style={isLatest ? styles.latestThumb : styles.analysisThumb}
      />
      <View style={styles.analysisCopy}>
        <Text style={styles.analysisTitle} numberOfLines={1}>
          {getAnalysisCardTitle(analysis.patientLabel)}
        </Text>
        <Text style={styles.analysisDate}>{formatAnalysisDate(analysis.createdAt)}</Text>
        <Text style={styles.analysisSeverity} numberOfLines={1}>
          {analysis.severity}
        </Text>
        <Text style={styles.analysisConfidence} numberOfLines={1}>
          {formatConfidence(analysis.confidence)}
        </Text>
      </View>
      <Text style={styles.cardArrow}>&gt;</Text>
    </Pressable>
  );
}

function getDashboardErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Analyses konden niet geladen worden.';
  }

  if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
    return 'Backend offline. Probeer later opnieuw.';
  }

  if (error.message.includes('Sessie verlopen') || error.message.includes('Authenticatie vereist')) {
    return 'Sessie verlopen. Log opnieuw in.';
  }

  return error.message || 'Analyses konden niet geladen worden.';
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 22,
  },
  headerCopy: {
    flex: 1,
  },
  greeting: {
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  subtitle: {
    color: 'rgba(0,0,0,0.72)',
    fontSize: 15,
    lineHeight: 20,
  },
  logoutButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#0F2A44',
    borderRadius: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  scanCard: {
    width: '100%',
    minHeight: 132,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    padding: 14,
    backgroundColor: '#FEF0F1',
    borderRadius: 19,
  },
  scanIcon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  scanCopy: {
    flex: 1,
  },
  scanTitle: {
    color: '#000000',
    fontSize: 20,
    lineHeight: 26,
  },
  scanDescription: {
    marginTop: 4,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  redArrowCircle: {
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
  sectionTitle: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  latestCard: {
    width: '100%',
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 24,
    padding: 18,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  statusText: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  analysisCard: {
    width: '100%',
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    padding: 14,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  latestAnalysisCard: {
    minHeight: 116,
    marginBottom: 24,
  },
  analysisThumb: {
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  latestThumb: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  analysisCopy: {
    flex: 1,
    minWidth: 0,
  },
  analysisTitle: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  analysisDate: {
    marginTop: 2,
    color: '#475569',
    fontSize: 12,
    lineHeight: 16,
  },
  analysisSeverity: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: '#ffffff',
    backgroundColor: '#F62222',
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 16,
    overflow: 'hidden',
  },
  analysisConfidence: {
    marginTop: 4,
    color: '#475569',
    fontSize: 11,
    lineHeight: 14,
  },
  cardArrow: {
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  viewAll: {
    color: '#F62222',
    fontSize: 15,
    lineHeight: 20,
  },
  emptyEarlierText: {
    marginTop: 12,
    color: '#475569',
    fontSize: 14,
    lineHeight: 18,
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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
