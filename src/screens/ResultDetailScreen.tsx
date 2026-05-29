import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type ResultDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ResultDetail'>;
type AnalysisDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisDetails'>;

function getSeverityColor(severity: string, success: boolean) {
  if (!success) {
    return '#64748B';
  }

  const normalizedSeverity = severity.toLowerCase();

  if (normalizedSeverity.includes('ernstig')) {
    return '#DC2626';
  }

  if (normalizedSeverity.includes('matig')) {
    return '#F59E0B';
  }

  return '#16A34A';
}

export function ResultDetailScreen({
  navigation,
  route,
}: ResultDetailScreenProps | AnalysisDetailsScreenProps) {
  const { analysis } = route.params;
  const severityColor = getSeverityColor(analysis.severity, analysis.success);

  return (
    <PhoneCard contentStyle={styles.card}>
      <View style={styles.scrollContent}>
        <Text style={styles.title}>AI analyse</Text>

        <Image source={{ uri: analysis.imageUrl }} style={styles.chart} />

        <View style={styles.summaryCard}>
          <View style={[styles.badge, { backgroundColor: severityColor }]}>
            <Text style={styles.badgeText}>{analysis.severity}</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>PTA</Text>
              <Text style={styles.metricValue}>{analysis.pta} dB</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Confidence</Text>
              <Text style={styles.metricValue}>{analysis.confidence}</Text>
            </View>
          </View>
          {!analysis.success ? (
            <Text style={styles.warningText}>AI analyse mislukt. Fallback-resultaat opgeslagen.</Text>
          ) : null}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Samenvatting</Text>
          <Text style={styles.detailText}>{analysis.summary}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Aanbeveling</Text>
          <Text style={styles.detailText}>{analysis.recommendation}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>{analysis.disclaimer}</Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.downloadButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.downloadText}>Download PDF</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.chevronButton, pressed && styles.pressed]}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../../assets/chevron_up.png')} style={styles.chevronIcon} />
          </Pressable>
        </View>
      </View>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 18,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  title: {
    alignSelf: 'flex-start',
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  chart: {
    width: '100%',
    maxWidth: 319,
    aspectRatio: 319 / 256,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
  },
  summaryCard: {
    width: '100%',
    maxWidth: 316,
    marginBottom: 14,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    minHeight: 32,
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  metricValue: {
    marginTop: 4,
    color: '#0F172A',
    fontFamily: 'Barlow Condensed',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  warningText: {
    marginTop: 12,
    color: '#B45309',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  infoCard: {
    width: '100%',
    maxWidth: 316,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  detailText: {
    width: '100%',
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'left',
  },
  disclaimerText: {
    color: '#475569',
    fontFamily: 'Barlow Condensed',
    fontSize: 17,
    fontWeight: '300',
    lineHeight: 22,
    textAlign: 'left',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 26,
  },
  downloadButton: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
  chevronButton: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  chevronIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  pressed: {
    opacity: 0.72,
  },
});
