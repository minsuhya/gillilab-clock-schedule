export const createTheme = (colorScheme: 'light' | 'dark') => ({
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  colors: {
    primary: colorScheme === 'light' ? '#6366F1' : '#818CF8',
    secondary: colorScheme === 'light' ? '#8B5CF6' : '#A78BFA',
    
    background: {
      primary: colorScheme === 'light' ? '#F9FAFB' : '#111827',
      secondary: colorScheme === 'light' ? '#FFFFFF' : '#1F2937',
      tertiary: colorScheme === 'light' ? '#F3F4F6' : '#374151',
    },
    
    text: {
      primary: colorScheme === 'light' ? '#111827' : '#F9FAFB',
      secondary: colorScheme === 'light' ? '#6B7280' : '#D1D5DB',
      tertiary: colorScheme === 'light' ? '#9CA3AF' : '#9CA3AF',
      inverse: colorScheme === 'light' ? '#FFFFFF' : '#111827',
    },
    
    border: {
      light: colorScheme === 'light' ? '#F3F4F6' : '#374151',
      medium: colorScheme === 'light' ? '#E5E7EB' : '#4B5563',
      dark: colorScheme === 'light' ? '#D1D5DB' : '#6B7280',
    },
    
    accent: {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      pink: '#EC4899',
      indigo: '#6366F1',
    },
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      display: 32,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colorScheme === 'light' ? 0.05 : 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === 'light' ? 0.1 : 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorScheme === 'light' ? 0.12 : 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
  },
});

export type Theme = ReturnType<typeof createTheme>;
