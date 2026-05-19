import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../types/navigation';

type OldAnalysisScreenProps = NativeStackScreenProps<RootStackParamList, 'OldAnalysis'>;

export function OldAnalysisScreen({ navigation }: OldAnalysisScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Resultaat analyse</Text>
        <Text style={styles.date}>24 februari 2026</Text>

        <Pressable style={styles.scanSection} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/Rectangle.png')} style={styles.scanIcon} />
          <Text style={styles.scanTitle}>Nieuwe audiogram scannen</Text>
          <Text style={styles.scanDescription}>
            Maak een foto van je audiogram en ontvang je direct analyse voor je patient
          </Text>
          <View style={styles.redCircle}>
            <Text style={styles.circleArrow}>&gt;</Text>
          </View>
        </Pressable>

        <Image source={require('../../assets/image 17.png')} style={styles.audiogramImage} />

        <Pressable
          style={styles.downloadButton}
          onPress={() => Alert.alert('Demo: rapport downloaden is nog niet geimplementeerd.')}
        >
          <Text style={styles.downloadText}>Download rapport</Text>
        </Pressable>

        <Text style={styles.analysisTitle}>Analyse</Text>
        <View style={styles.analysisCard} />
        <Text style={styles.analysisText}>
          Ernstige hoorverlies{'\n'}
          Dit audiogram toont een duidelijk en uitgesproken gehoorverlies over meerdere
          frequentiebereiken. De drempelwaarden liggen significant verhoogd, wat kan wijzen op een
          ernstige beperking in het waarnemen van geluid en spraak. Wij raden aan om verdere
          evaluatie te laten uitvoeren door een audioloog of KNO-arts.
        </Text>

        <Text style={styles.earlierTitle}>Eerder analyses</Text>
        <Pressable
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('AnalysisOverview')}
        >
          <Text style={styles.viewAll}>Bekijk alle</Text>
        </Pressable>

        <View style={styles.earlierCardOne}>
          <Image source={require('../../assets/image 17.png')} style={styles.earlierThumbOne} />
          <Text style={styles.earlierDateOne}>24 februari 2026</Text>
          <View style={styles.pillOne} />
          <Text style={styles.pillTextOne}>Matige gehoorverlies</Text>
          <Text style={styles.earlierArrowOne}>&gt;</Text>
        </View>

        <View style={styles.earlierCardTwo}>
          <Image source={require('../../assets/image 17.png')} style={styles.earlierThumbTwo} />
          <Text style={styles.earlierDateTwo}>24 februari 2026</Text>
          <View style={styles.pillTwo} />
          <Text style={styles.pillTextTwo}>Lichte gehoorverlies</Text>
          <Text style={styles.earlierArrowTwo}>&gt;</Text>
        </View>
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
    height: 1453,
    backgroundColor: '#ffffff',
  },
  title: {
    position: 'absolute',
    left: 42,
    top: 61,
    width: 232,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  date: {
    position: 'absolute',
    left: 49,
    top: 127,
    width: 225,
    color: 'rgba(0,0,0,0.72)',
    fontSize: 15,
    lineHeight: 20,
  },
  scanSection: {
    position: 'absolute',
    left: 0,
    top: 174,
    width: 393,
    height: 70,
  },
  redCircle: {
    position: 'absolute',
    left: 338,
    top: 26,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E60F30',
    borderRadius: 9999,
  },
  circleArrow: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  scanIcon: {
    position: 'absolute',
    left: 28,
    top: 0,
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  scanTitle: {
    position: 'absolute',
    left: 78,
    top: 6,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 20,
    lineHeight: 26,
  },
  scanDescription: {
    position: 'absolute',
    left: 80,
    top: 37,
    width: 225,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  audiogramImage: {
    position: 'absolute',
    left: 12,
    top: 300,
    width: 370,
    height: 208,
    backgroundColor: '#D9D9D9',
    resizeMode: 'contain',
  },
  downloadButton: {
    position: 'absolute',
    left: 74,
    top: 526,
    width: 255,
    height: 74.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F62222',
    borderRadius: 999,
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
  analysisTitle: {
    position: 'absolute',
    left: 49,
    top: 732,
    color: '#000000',
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  analysisCard: {
    position: 'absolute',
    left: 49,
    top: 782,
    width: 306,
    height: 403,
    backgroundColor: '#E6DFE6',
    borderRadius: 36,
  },
  analysisText: {
    position: 'absolute',
    left: 68,
    top: 813,
    width: 276,
    color: '#000000',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  earlierTitle: {
    position: 'absolute',
    left: 75,
    top: 1127,
    color: '#000000',
    fontFamily: 'Anek Tamil',
    fontSize: 15,
    lineHeight: 20,
  },
  viewAllButton: {
    position: 'absolute',
    left: 282,
    top: 1127,
  },
  viewAll: {
    color: '#E60F30',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierCardOne: {
    position: 'absolute',
    left: 32,
    top: 1154,
    width: 329,
    height: 79,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  earlierCardTwo: {
    position: 'absolute',
    left: 32,
    top: 1263,
    width: 329,
    height: 79,
    backgroundColor: '#D9D9D9',
    borderRadius: 23,
    ...cardShadow,
  },
  earlierThumbOne: {
    position: 'absolute',
    left: 18,
    top: 14,
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  earlierThumbTwo: {
    position: 'absolute',
    left: 18,
    top: 14,
    width: 56,
    height: 57,
    resizeMode: 'contain',
  },
  earlierDateOne: {
    position: 'absolute',
    left: 129,
    top: 14,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  earlierDateTwo: {
    position: 'absolute',
    left: 129,
    top: 14,
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  pillOne: {
    position: 'absolute',
    left: 125,
    top: 40,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTwo: {
    position: 'absolute',
    left: 129,
    top: 41,
    width: 138,
    height: 15,
    backgroundColor: '#F62222',
    borderRadius: 6,
  },
  pillTextOne: {
    position: 'absolute',
    left: 144,
    top: 39,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  pillTextTwo: {
    position: 'absolute',
    left: 148,
    top: 40,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
  earlierArrowOne: {
    position: 'absolute',
    left: 294,
    top: 24,
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
  earlierArrowTwo: {
    position: 'absolute',
    left: 294,
    top: 24,
    color: '#000000',
    fontSize: 24,
    lineHeight: 30,
  },
});
