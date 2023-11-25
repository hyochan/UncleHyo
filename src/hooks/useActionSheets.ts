import {useActionSheet} from '@expo/react-native-action-sheet';
import type {
  ImagePickerAsset,
  ImagePickerOptions,
  ImagePickerResult,
} from 'expo-image-picker';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
} from 'expo-image-picker';

import {t} from '../STRINGS';
import {showAlert} from '../utils/alert';

type ImagePickerReturnType = {
  openImagePicker: (props: {
    onPickImage: (assets: ImagePickerAsset[]) => void;
    options?: ImagePickerOptions;
  }) => void;
};

export function useImagePickerActionSheet(): ImagePickerReturnType {
  const {showActionSheetWithOptions} = useActionSheet();

  const openImagePicker = ({
    options,
    onPickImage,
  }: Parameters<ImagePickerReturnType['openImagePicker']>[0]): void => {
    const menu = [t('TAKE_A_PICTURE'), t('SELECT_FROM_ALBUM'), t('CANCEL')];

    showActionSheetWithOptions(
      {
        options: menu,
        cancelButtonIndex: 2,
      },
      async (buttonIndex?: number) => {
        const handleImageUpload = (image: ImagePickerResult | null): void => {
          if (!image || image.canceled) {
            return;
          }

          return onPickImage?.(image.assets);
        };

        if (buttonIndex === 0) {
          const result = await requestCameraPermissionsAsync();

          if (result.granted) {
            const image = await launchCameraAsync({
              mediaTypes: MediaTypeOptions.Images,
              ...options,
            });

            handleImageUpload(image);

            return;
          }

          showAlert(t('PERMISSION_GRANT_CAMERA'));

          return;
        }

        if (buttonIndex === 1) {
          const image = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            ...options,
          });

          handleImageUpload(image);
        }
      },
    );
  };

  return {openImagePicker};
}
