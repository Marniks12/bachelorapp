import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type PhoneCardProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function PhoneCard({ children, contentStyle }: PhoneCardProps) {
  return (
    <View style={styles.screen}>
      <View style={[styles.card, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 393,
    minHeight: 740,
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
