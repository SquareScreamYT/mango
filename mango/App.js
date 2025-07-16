import * as React from 'react';
import { NavigationContainer, DefaultTheme as NavDefault, DarkTheme as NavDark } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator'; 
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefault,
  DarkTheme as PaperDark,
} from 'react-native-paper';

const CombinedDefaultTheme = {
  ...PaperDefault,
  ...NavDefault,
  colors: {
    ...PaperDefault.colors,
    ...NavDefault.colors,
  },
};

const CombinedDarkTheme = {
  ...PaperDark,
  ...NavDark,
  colors: {
    ...PaperDark.colors,
    ...NavDark.colors,
  },
};

import { ThemeContext } from './ThemeContext';

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
