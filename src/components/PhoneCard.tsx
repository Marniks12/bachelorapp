import { ReactNode } from 'react';
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { webViewportStyle } from '../styles/responsive';

type PhoneCardProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function PhoneCard({ children, contentStyle }: PhoneCardProps) {
  return (
    <SafeAreaView style={[styles.screen, webViewportStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, contentStyle]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
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
  card: {
    width: '100%',
    maxWidth: 420,
    minHeight: Platform.OS === 'web' ? undefined : 680,
    padding: 24,
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 10,
  },
});
