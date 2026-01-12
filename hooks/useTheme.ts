import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { createTheme } from '@/constants/Theme';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  
  const colorScheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme ?? 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);
  
  const theme = useMemo(() => createTheme(colorScheme), [colorScheme]);
  
  return { theme, colorScheme };
};
