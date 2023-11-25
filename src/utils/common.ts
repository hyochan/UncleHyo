import {Linking, Platform} from 'react-native';
import {getDeviceTypeSync} from 'react-native-device-info';

export const openURL = async (url: string): Promise<void> => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  }

  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  }
};

export const isDesktopDevice = (): boolean =>
  getDeviceTypeSync() === 'Desktop' ||
  Platform.OS === 'web' ||
  Platform.OS === 'macos' ||
  Platform.OS === 'windows';

export function removeLeadingAt(str: string): string {
  if (str.startsWith('@')) {
    return str.substring(1);
  }

  return str;
}
