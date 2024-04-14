import {useEffect, useState} from 'react';
import type {ColorSchemeName} from 'react-native';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {dark, light} from '@dooboo-ui/theme';
import styled, {css} from '@emotion/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDooboo} from 'dooboo-ui';
import StatusBarBrightness from 'dooboo-ui/uis/StatusbarBrightness';
import {Drawer} from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import RootProvider from '../src/providers';
import {t} from '../src/STRINGS';
import {AsyncStorageKey, COMPONENT_WIDTH} from '../src/utils/constants';

SplashScreen.preventAutoHideAsync();

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.bg.paper};
`;

const Content = styled.View`
  align-self: center;
  width: 100%;
  flex: 1;
  max-width: ${COMPONENT_WIDTH + 'px'};
  background-color: ${({theme}) => theme.bg.basic};
`;

function Layout(): JSX.Element | null {
  const {assetLoaded, theme} = useDooboo();

  useEffect(() => {
    if (assetLoaded) {
      SplashScreen.hideAsync();
    }
  }, [assetLoaded]);

  if (!assetLoaded) {
    return null;
  }

  return (
    <Container>
      <Content>
        <Drawer
          screenOptions={{
            headerStyle: {backgroundColor: theme.bg.basic},
            headerTintColor: theme.text.label,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: theme.text.basic,
            },
            drawerStyle: {
              backgroundColor: theme.bg.paper,
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: t('HOME'),
            }}
          />
          <Drawer.Screen
            name="picture"
            options={{
              drawerItemStyle: {display: 'none'},
            }}
          />
        </Drawer>
      </Content>
    </Container>
  );
}

export default function RootLayout(): JSX.Element | null {
  const colorScheme = useColorScheme();
  const [localThemeType, setLocalThemeType] = useState<string | undefined>(
    undefined,
  );

  // 테마 불러오기
  useEffect(() => {
    const initializeThemeType = async (): Promise<void> => {
      const darkMode = await AsyncStorage.getItem(AsyncStorageKey.DarkMode);

      const isDarkMode = !darkMode
        ? colorScheme === 'dark'
        : darkMode === 'true';

      SystemUI.setBackgroundColorAsync(
        isDarkMode ? dark.bg.basic : light.bg.basic,
      );

      setLocalThemeType(isDarkMode ? 'dark' : 'light');
    };

    initializeThemeType();
  }, [colorScheme]);

  if (!localThemeType) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={css`
        flex: 1;
      `}
    >
      <RootProvider initialThemeType={localThemeType as ColorSchemeName}>
        <KeyboardProvider>
          <StatusBarBrightness />
          <Layout />
        </KeyboardProvider>
      </RootProvider>
    </GestureHandlerRootView>
  );
}
