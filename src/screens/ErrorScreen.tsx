import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { webViewportStyle } from '../styles/responsive';
import { fontFamilies } from '../styles/typography';
import { RootStackParamList } from '../types/navigation';

type ErrorScreenProps = NativeStackScreenProps<RootStackParamList, 'Error'>;

const instructions = [
  'Zorg voor een goede belichting',
  'Maak een scherpe foto',
  'Upload een duidelijk zichtbare audiogram',
];

export function ErrorScreen({ navigation }: ErrorScreenProps) {
  return (
    <SafeAreaView style={[styles.screen, webViewportStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningIcon}>
          <View style={styles.warningTriangleOuter} />
          <View style={styles.warningTriangleInner} />
          <Text style={styles.warningMark}>!</Text>
        </View>

        <Text style={styles.title}>Er is iets fout gelopen, probeer het nog eens opnieuw!</Text>

        <View style={styles.instructionCard}>
          {instructions.map((instruction) => (
            <View key={instruction} style={styles.instructionRow}>
              <View style={styles.instructionIcon}>
                <View style={styles.iconDot} />
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>Probeer opnieuw</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 58,
    paddingBottom: Platform.OS === 'web' ? 48 : 32,
  },
  warningIcon: {
    width: 132,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 42,
  },
  warningTriangleOuter: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 58,
    borderRightWidth: 58,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E60F30',
  },
  warningTriangleInner: {
    position: 'absolute',
    top: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 43,
    borderRightWidth: 43,
    borderBottomWidth: 74,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
  },
  warningMark: {
    marginTop: 22,
    color: '#E60F30',
    fontFamily: fontFamilies.headingBold,
    fontSize: 58,
    fontWeight: '700',
    lineHeight: 66,
  },
  title: {
    width: '100%',
    maxWidth: 330,
    marginBottom: 36,
    color: '#000000',
    fontFamily: fontFamilies.heading,
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 38,
    textAlign: 'center',
  },
  instructionCard: {
    width: '100%',
    maxWidth: 336,
    gap: 18,
    marginBottom: 42,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: '#FEF0F1',
    borderRadius: 22,
  },
  instructionRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  instructionIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F62222',
    borderRadius: 17,
  },
  iconDot: {
    width: 11,
    height: 11,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  instructionText: {
    flex: 1,
    color: '#000000',
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 27,
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    backgroundColor: '#F62222',
    borderRadius: 999,
    shadowColor: '#F62222',
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
  buttonText: {
    color: '#ffffff',
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
