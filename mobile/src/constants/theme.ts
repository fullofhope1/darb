import { Platform } from 'react-native';

export const Colors = {
  primary: '#1b6b3e',
  primaryLight: '#8ad7a0',
  primaryDark: '#00522a',
  secondary: '#c6963d',
  secondaryLight: '#ffc96a',
  surface: '#fbf9f9',
  surfaceDim: '#dbdad9',
  surfaceBright: '#fbf9f9',
  surfaceContainer: '#efeded',
  surfaceContainerHigh: '#e9e8e7',
  surfaceContainerHighest: '#e3e2e2',
  surfaceContainerLow: '#f5f3f3',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#404941',
  outline: '#707a70',
  outlineVariant: '#bfc9be',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',
  background: '#fbf9f9',
  onBackground: '#1b1c1c',
  white: '#ffffff',
  black: '#000000',
  gold: '#c6963d',
  green: '#1b6b3e',
  star: '#f5a623',
  success: '#2e7d32',
  warning: '#f57c00',
  info: '#0288d1',
};

const arabicFont = Platform.select({ ios: 'Tajawal', android: 'Tajawal', default: 'Tajawal' });
const fallback = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });

export const FontFamily = {
  regular: arabicFont,
  medium: arabicFont,
  bold: arabicFont,
};

export const Typography = {
  displayLg: { fontFamily: FontFamily.bold, fontSize: 30, lineHeight: 38, fontWeight: '700' as const },
  headlineMd: { fontFamily: FontFamily.bold, fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  headlineSm: { fontFamily: FontFamily.medium, fontSize: 20, lineHeight: 28, fontWeight: '500' as const },
  bodyLg: { fontFamily: FontFamily.regular, fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  bodyMd: { fontFamily: FontFamily.regular, fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  labelLg: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  labelSm: { fontFamily: FontFamily.regular, fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, gutter: 16, marginMobile: 20 };
export const Roundness = { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
export const Shadow = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  elevated: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
};
