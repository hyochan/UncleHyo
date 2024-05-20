import 'dotenv/config';

import type {ConfigContext, ExpoConfig} from '@expo/config';
import withAndroidLocalizedName from '@mmomtchev/expo-android-localized-app-name';
import dotenv from 'dotenv';
import {expand} from 'dotenv-expand';
import path from 'path';

import {version} from './package.json';

// https://github.com/expo/expo/issues/23727#issuecomment-1651609858
if (process.env.STAGE) {
  expand(
    dotenv.config({
      path: path.join(
        __dirname,
        ['./.env', process.env.STAGE].filter(Boolean).join('.'),
      ),
      override: true,
    }),
  );
}

const DEEP_LINK_URL = '[firebaseAppId].web.app';

const buildNumber = 1;

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'UncleHyo',
  scheme: 'uncle-hyo',
  slug: 'uncle-hyo',
  privacy: 'public',
  platforms: ['ios', 'android', 'web'],
  version,
  orientation: 'default',
  icon: './assets/icon.png',
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {newArchEnabled: true},
        android: {newArchEnabled: true},
      },
    ],
    // @ts-ignore
    withAndroidLocalizedName,
    'expo-router',
    'expo-tracking-transparency',
    'expo-localization',
    [
      'expo-font',
      {
        fonts: [
          'node_modules/dooboo-ui/uis/Icon/doobooui.ttf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Bold.otf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Regular.otf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Thin.otf',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1B1B1B',
  },
  extra: {
    ROOT_URL: process.env.ROOT_URL,
    eas: {projectId: '357fc48a-1baa-4bee-a350-87979af55434'},
  },
  owner: 'dooboolab',
  updates: {
    fallbackToCacheTimeout: 0,
    // requestHeaders: {'expo-channel-name': 'production'},
    // url: '',
  },
  assetBundlePatterns: ['**/*'],
  userInterfaceStyle: 'automatic',
  ios: {
    buildNumber: buildNumber.toString(),
    bundleIdentifier: 'dev.hyochan',
    associatedDomains: [`applinks:${DEEP_LINK_URL}`],
    supportsTablet: true,
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
    },
  },
  android: {
    userInterfaceStyle: 'automatic',
    permissions: [
      'RECEIVE_BOOT_COMPLETED',
      'CAMERA',
      'CAMERA_ROLL',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'NOTIFICATIONS',
      'USER_FACING_NOTIFICATIONS',
    ],
    adaptiveIcon: {
      backgroundColor: '#2F2F2F',
    },
    package: 'dev.hyochan',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: {
          scheme: 'https',
          host: DEEP_LINK_URL,
          pathPrefix: '/',
        },
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  description: 'Uncle Hyo GPT',
  web: {bundler: 'metro', favicon: './assets/favicon.png'},
});
