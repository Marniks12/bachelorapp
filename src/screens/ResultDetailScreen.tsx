import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { RootStackParamList } from '../types/navigation';

type ResultDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ResultDetail'>;

export function ResultDetailScreen({ navigation }: ResultDetailScreenProps) {
  return (
    <PhoneCard contentStyle={styles.card}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Ernstige hoorverlies</Text>

        <Image source={require('../../assets/image 17.png')} style={styles.chart} />

        <Text style={styles.detailText}>
          Het audiogram toont een ernstig gehoorverlies, bilateraal aanwezig, met een duidelijke
          toename van het verlies in het midden- en hoge frequentiebereik.{'\n\n'}
          De drempelwaarden liggen over meerdere frequenties verhoogd, wat kan wijzen op een
          significante beperking in functioneel gehoor.{'\n\n'}
          De gemeten spraakverstaanbaarheid is beperkt in verhouding tot de gehoordrempels, wat
          binnen verschillende richtlijnen wordt meegenomen als aanvullende parameter bij verdere
          evaluatie.
        </Text>

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
      </ScrollView>
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
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  chart: {
    width: 319,
    height: 256,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  detailText: {
    width: '100%',
    maxWidth: 316,
    color: '#000000',
    fontFamily: 'Barlow Condensed',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'left',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 26,
  },
  downloadButton: {
    width: 255,
    height: 60,
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
