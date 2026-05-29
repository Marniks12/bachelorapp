import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Analysis } from '../api/analysisApi';
import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

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

function formatReportDate(createdAt: string): string {
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

async function downloadAnalysisReport(analysis: Analysis): Promise<void> {
  if (Platform.OS !== 'web') {
    throw new Error('PDF-download is alleen beschikbaar op web.');
  }

  const { jsPDF } = await import('jspdf');
  const report = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  const contentWidth = 174;
  let cursorY = 22;

  report.setFont('helvetica', 'bold');
  report.setFontSize(24);
  report.text('Sonaris', margin, cursorY);
  cursorY += 8;

  report.setFont('helvetica', 'normal');
  report.setFontSize(11);
  report.setTextColor(80, 80, 80);
  report.text('Audiogram analyse rapport', margin, cursorY);
  cursorY += 14;

  report.setTextColor(0, 0, 0);
  cursorY = addReportLine(report, 'Patientlabel', analysis.patientLabel, cursorY, margin, contentWidth);
  cursorY = addReportLine(report, 'Ernst', analysis.severity, cursorY, margin, contentWidth);
  cursorY = addReportLine(report, 'PTA', `${analysis.pta} dB`, cursorY, margin, contentWidth);
  cursorY = addReportLine(report, 'Betrouwbaarheid', analysis.confidence, cursorY, margin, contentWidth);
  cursorY = addReportLine(report, 'Analyse datum', formatReportDate(analysis.createdAt), cursorY, margin, contentWidth);
  cursorY += 4;

  cursorY = addReportSection(report, 'Samenvatting', analysis.summary, cursorY, margin, contentWidth);
  cursorY = addReportSection(report, 'Aanbeveling', analysis.recommendation, cursorY, margin, contentWidth);
  cursorY = addReportSection(report, 'Disclaimer', analysis.disclaimer, cursorY, margin, contentWidth);

  if (analysis.imageUrl) {
    const imageDataUrl = await getImageDataUrl(analysis.imageUrl);

    cursorY = ensurePageSpace(report, cursorY, 76, margin);
    report.setFont('helvetica', 'bold');
    report.setFontSize(13);
    report.text('Audiogram', margin, cursorY);
    cursorY += 6;
    report.addImage(imageDataUrl, getImageFormat(imageDataUrl), margin, cursorY, 120, 68, undefined, 'FAST');
  }

  report.save(`sonaris-rapport-${analysis._id}.pdf`);
}

function addReportLine(
  report: import('jspdf').jsPDF,
  label: string,
  value: string,
  cursorY: number,
  margin: number,
  contentWidth: number,
): number {
  const nextY = ensurePageSpace(report, cursorY, 12, margin);

  report.setFont('helvetica', 'bold');
  report.setFontSize(11);
  report.text(`${label}:`, margin, nextY);
  report.setFont('helvetica', 'normal');
  report.text(report.splitTextToSize(value || 'Onbekend', contentWidth - 42), margin + 42, nextY);

  return nextY + 8;
}

function addReportSection(
  report: import('jspdf').jsPDF,
  title: string,
  value: string,
  cursorY: number,
  margin: number,
  contentWidth: number,
): number {
  const lines = report.splitTextToSize(value || 'Niet beschikbaar', contentWidth);
  const nextY = ensurePageSpace(report, cursorY, 10 + lines.length * 5, margin);

  report.setFont('helvetica', 'bold');
  report.setFontSize(13);
  report.text(title, margin, nextY);
  report.setFont('helvetica', 'normal');
  report.setFontSize(11);
  report.text(lines, margin, nextY + 7);

  return nextY + 12 + lines.length * 5;
}

function ensurePageSpace(report: import('jspdf').jsPDF, cursorY: number, neededHeight: number, margin: number): number {
  if (cursorY + neededHeight <= 285) {
    return cursorY;
  }

  report.addPage();
  return margin;
}

async function getImageDataUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error('Audiogram afbeelding ophalen mislukt.');
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Ongeldige afbeelding.'));
    };
    reader.onerror = () => reject(new Error('Audiogram afbeelding lezen mislukt.'));
    reader.readAsDataURL(blob);
  });
}

function getImageFormat(dataUrl: string): 'JPEG' | 'PNG' {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
}

export function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { analysis } = route.params;
  const severityColor = getSeverityColor(analysis.severity, analysis.success);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  async function handleDownloadReport() {
    if (isDownloadingReport) {
      return;
    }

    try {
      setIsDownloadingReport(true);
      setReportError(null);
      await downloadAnalysisReport(analysis);
      navigation.navigate('DashboardNewUser');
    } catch {
      setReportError('Rapport downloaden mislukt.');
    } finally {
      setIsDownloadingReport(false);
    }
  }

  return (
    <PhoneCard contentStyle={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Image source={require('../../assets/back_icon.png')} style={styles.backIcon} />
        </Pressable>
      </View>

      <Text style={styles.title}>Resultaat analyse</Text>

      <Image source={{ uri: analysis.imageUrl }} style={styles.chart} />

      <View style={styles.resultCopy}>
        <View style={[styles.badge, { backgroundColor: severityColor }]}>
          <Text style={styles.badgeText}>{analysis.severity}</Text>
        </View>
        <Text style={styles.ptaText}>PTA: {analysis.pta} dB</Text>
        <Text style={styles.confidenceText}>Betrouwbaarheid: {analysis.confidence}</Text>
        <Text style={styles.description}>{analysis.summary}</Text>
        <Text style={styles.disclaimer}>{analysis.disclaimer}</Text>

        <Pressable
          style={({ pressed }) => [styles.readMoreButton, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AnalysisDetails', { analysis })}
        >
          <Text style={styles.readMoreText}>Lees meer</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.downloadButton,
          isDownloadingReport && styles.downloadButtonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleDownloadReport}
        disabled={isDownloadingReport}
      >
        <Text style={styles.downloadText}>
          {isDownloadingReport ? 'Rapport wordt gegenereerd...' : 'Download rapport'}
        </Text>
      </Pressable>
      {reportError ? <Text style={styles.reportError}>{reportError}</Text> : null}
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'flex-start',
  },
  header: {
    height: 48,
    justifyContent: 'center',
    marginBottom: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F7',
    borderColor: '#C2D1D9',
    borderWidth: 1,
    borderRadius: 22,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  pressed: {
    opacity: 0.72,
  },
  title: {
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
    textAlign: 'left',
  },
  chart: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 319,
    aspectRatio: 319 / 256,
    marginTop: 28,
    marginBottom: 24,
    resizeMode: 'contain',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
  },
  resultCopy: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  badge: {
    minHeight: 34,
    justifyContent: 'center',
    marginBottom: 12,
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
  confidenceText: {
    marginBottom: 10,
    color: '#475569',
    fontFamily: 'Barlow Condensed',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'left',
  },
  description: {
    width: '100%',
    marginBottom: 12,
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 26,
    textAlign: 'left',
  },
  ptaText: {
    marginBottom: 10,
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'left',
  },
  disclaimer: {
    width: '100%',
    marginBottom: 18,
    color: 'rgba(0,0,0,0.68)',
    fontFamily: 'Barlow Condensed',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22,
    textAlign: 'left',
  },
  readMoreButton: {
    width: 142,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#161A1D',
    borderRadius: 999,
    borderWidth: 1,
  },
  readMoreText: {
    color: '#161A1D',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'center',
  },
  downloadButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
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
  downloadButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  downloadText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  reportError: {
    alignSelf: 'center',
    marginTop: 10,
    color: '#E60F30',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
});
