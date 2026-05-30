import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComponentType, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';

import { PhoneCard } from '../components/PhoneCard';
import { fontFamilies } from '../styles/typography';
import { RootStackParamList } from '../types/navigation';

type InfoCarouselScreenProps = NativeStackScreenProps<RootStackParamList, 'InfoCarousel'>;

type Slide = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  imageStyle: {
    maxWidth: number;
    aspectRatio: number;
  };
};

type WebDragViewProps = ViewProps & {
  onPointerDown?: (event: { nativeEvent: { clientX: number } }) => void;
  onPointerUp?: (event: { nativeEvent: { clientX: number } }) => void;
};

const WebDragView = View as unknown as ComponentType<WebDragViewProps>;

const slides: Slide[] = [
  {
    title: 'Scan je audiogram',
    description:
      'Maak een foto van je audiogram en krijg meteen een duidelijke analyse van je gehoor.',
    image: require('../../assets/image 15.png'),
    imageStyle: {
      maxWidth: 246,
      aspectRatio: 246 / 213,
    },
  },
  {
    title: 'Snel en automatisch',
    description: 'Onze technologie herkent automatisch frequenties en waarden uit je audiogram.',
    image: require('../../assets/image 10.png'),
    imageStyle: {
      maxWidth: 212,
      aspectRatio: 212 / 222,
    },
  },
  {
    title: 'Duidelijke resultaten',
    description: 'Ontvang een begrijpelijke uitleg van je gehoorverlies en download een rapport.',
    image: require('../../assets/image 11.png'),
    imageStyle: {
      maxWidth: 202,
      aspectRatio: 202 / 229,
    },
  },
  {
    title: 'Veilig & privé',
    description: 'Je gegevens worden lokaal verwerkt en niet opgeslagen.',
    image: require('../../assets/image 12.png'),
    imageStyle: {
      maxWidth: 170,
      aspectRatio: 170 / 181,
    },
  },
];

export function InfoCarouselScreen({ navigation }: InfoCarouselScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mouseStartX = useRef<number | null>(null);

  const goToOffset = (offset: number) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + offset;
      return Math.min(Math.max(nextIndex, 0), slides.length - 1);
    });
  };

  const handleSwipe = (deltaX: number) => {
    if (Math.abs(deltaX) < 40) {
      return;
    }

    goToOffset(deltaX < 0 ? 1 : -1);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderRelease: (_, gestureState) => handleSwipe(gestureState.dx),
      }),
    []
  );

  const handleTouchStart = (event: GestureResponderEvent) => {
    mouseStartX.current = event.nativeEvent.locationX;
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (mouseStartX.current === null) {
      return;
    }

    handleSwipe(event.nativeEvent.locationX - mouseStartX.current);
    mouseStartX.current = null;
  };

  const activeSlide = slides[activeIndex];
  const dragProps =
    Platform.OS === 'web'
      ? {
          onPointerDown: (event: { nativeEvent: { clientX: number } }) => {
            mouseStartX.current = event.nativeEvent.clientX;
          },
          onPointerUp: (event: { nativeEvent: { clientX: number } }) => {
            if (mouseStartX.current === null) {
              return;
            }

            handleSwipe(event.nativeEvent.clientX - mouseStartX.current);
            mouseStartX.current = null;
          },
        }
      : {};

  return (
    <PhoneCard contentStyle={styles.card}>
      <WebDragView
        style={styles.carouselCard}
        {...panResponder.panHandlers}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...dragProps}
      >
        <View style={styles.imageFrame}>
          <Image
            source={activeSlide.image}
            style={[styles.slideImage, activeSlide.imageStyle]}
          />
        </View>

        <Text style={styles.title}>{activeSlide.title}</Text>
        <Text style={styles.description}>{activeSlide.description}</Text>
      </WebDragView>

      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <Pressable
            key={slide.title}
            accessibilityLabel={`Ga naar slide ${index + 1}`}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
            onPress={() => setActiveIndex(index)}
          />
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>Verdergaan</Text>
      </Pressable>
    </PhoneCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCard: {
    width: '100%',
    maxWidth: 310,
    minHeight: 528,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderColor: '#D9D9D9',
    borderRadius: 12,
    borderWidth: 5,
  },
  imageFrame: {
    width: '100%',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  slideImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  title: {
    marginBottom: 16,
    color: '#000000',
    fontFamily: fontFamilies.headingBold,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'center',
  },
  description: {
    maxWidth: 260,
    color: '#000000',
    fontFamily: fontFamilies.body,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 26,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 26,
    marginBottom: 30,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  activeDot: {
    backgroundColor: '#E60F30',
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
  button: {
    width: '100%',
    maxWidth: 255,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
