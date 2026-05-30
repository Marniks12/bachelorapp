import { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Analysis, getAnalyses } from '../api/analysisApi';
import { useAuth } from '../context/AuthContext';
import { webViewportStyle } from '../styles/responsive';
import { fontFamilies } from '../styles/typography';
import { RootStackParamList } from '../types/navigation';

type DashboardNewUserScreenProps = NativeStackScreenProps<RootStackParamList, 'DashboardNewUser'>;

function getAnalysisCardTitle(patientLabel: string | undefined): string {
  const label = patientLabel?.trim();

  return label || 'Mijn analyse';
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
    <SafeAreaView style={[styles.container, webViewportStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.greeting} numberOfLines={1}>Hallo {user?.name ?? 'Sonaris'}</Text>
          <Text style={styles.subtitle}>Welkom Sonaris dashboard</Text>

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

          <Text style={styles.firstAnalysisTitle}>Jouw laatste analyse</Text>

          {latestAnalysis ? (
            <Pressable
              style={({ pressed }) => [styles.firstAnalysisCard, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AnalysisDetails', { analysis: latestAnalysis })}
            >
              <Image source={{ uri: latestAnalysis.imageUrl }} style={styles.firstAnalysisThumb} />
              <View style={styles.analysisCopy}>
                <Text style={styles.firstAnalysisDate} numberOfLines={1}>
                  {getAnalysisCardTitle(latestAnalysis.patientLabel)}
                </Text>
                <Text style={styles.firstAnalysisSeverity} numberOfLines={1}>{latestAnalysis.severity}</Text>
              </View>
              <Text style={styles.cardArrow}>&gt;</Text>
            </Pressable>
          ) : (
            <View style={styles.firstAnalysisCard}>
              <Text style={styles.emptyText}>{statusMessage}</Text>
            </View>
          )}

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
    justifyContent: 'center',
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
  greeting: {
    color: '#000000',
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  subtitle: {
    marginBottom: 22,
    color: 'rgba(0,0,0,0.72)',
    fontFamily: fontFamilies.body,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
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
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 20,
    lineHeight: 26,
  },
  scanDescription: {
    marginTop: 4,
    color: '#000000',
    fontFamily: fontFamilies.body,
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
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  firstAnalysisTitle: {
    color: '#000000',
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    lineHeight: 20,
  },
  firstAnalysisCard: {
    width: '100%',
    minHeight: 111,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    padding: 14,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  firstAnalysisThumb: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  analysisCopy: {
    flex: 1,
    minWidth: 0,
  },
  firstAnalysisDate: {
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 20,
  },
  firstAnalysisSeverity: {
    marginTop: 10,
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 20,
  },
  emptyText: {
    flex: 1,
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  cardArrow: {
    color: '#000000',
    fontFamily: fontFamilies.body,
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
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
