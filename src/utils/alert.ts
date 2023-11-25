import {Alert, Platform} from 'react-native';

import {t} from '../STRINGS';

export const showAlert = (message: string, onPress?: () => void): void => {
  const parsedMessage = !message ? t('ERR_OCCURRED') : message;

  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    alert(parsedMessage);

    return;
  }

  Alert.alert('', parsedMessage, [
    {
      text: t('OK'),
      onPress,
    },
  ]);
};

export const showConfirm = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const message = '[ ' + title + ' ]' + '\n\n' + description;
    // eslint-disable-next-line no-alert
    const result = window.confirm(message);

    return result;
  }

  return await new Promise<boolean>((resolve) => {
    Alert.alert(title, description, [
      {
        text: t('NO'),
        onPress: () => {
          resolve(false);
        },
      },
      {
        text: t('YES'),
        onPress: () => {
          resolve(true);
        },
      },
    ]);
  });
};
