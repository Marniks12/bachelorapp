import { Platform, ViewStyle } from 'react-native';

export const webViewportStyle =
  Platform.OS === 'web' ? ({ minHeight: '100dvh' } as unknown as ViewStyle) : undefined;
