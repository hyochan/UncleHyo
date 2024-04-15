import {ActivityIndicator, Platform, type ViewStyle} from 'react-native';
import {useKeyboardController} from 'react-native-keyboard-controller';
import styled, {css} from '@emotion/native';
import type {EditTextProps} from 'dooboo-ui';
import {EditText, Icon, useDooboo} from 'dooboo-ui';
import CustomPressable from 'dooboo-ui/uis/CustomPressable';
import {type ImagePickerAsset, MediaTypeOptions} from 'expo-image-picker';

import {useImagePickerActionSheet} from '../hooks/useActionSheets';
import {t} from '../STRINGS';
import {delayPressIn, MAX_IMAGES_UPLOAD_LENGTH} from '../utils/constants';

import MultiUploadImageInput from './MultiUploadInput';

const Container = styled.View`
  background-color: ${({theme}) => theme.bg.basic};
  gap: 10px;
`;

const ButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

type Props = {
  style?: ViewStyle;
  styles?: EditTextProps['styles'];
  loading?: boolean;
  message?: string;
  assets: ImagePickerAsset[];
  setAssets: (assets: ImagePickerAsset[]) => void;
  setMessage?: (msg: string) => void;
  createChatMessage: () => void;
  canUploadImage?: boolean;
};

export default function ChatInput({
  style,
  styles,
  loading,
  message,
  setMessage,
  createChatMessage,
  assets = [],
  setAssets,
  canUploadImage = true,
}: Props): JSX.Element {
  const {openImagePicker} = useImagePickerActionSheet();
  const {theme, snackbar} = useDooboo();
  const {setEnabled} = useKeyboardController();
  const disabled = loading || (!message && !assets.length);

  return (
    <Container style={style}>
      <EditText
        decoration="boxed"
        editable={!loading}
        endElement={
          <ButtonsWrapper
            style={css`
              margin-left: 8px;
            `}
          >
            {loading ? (
              <ActivityIndicator
                color={theme.text.basic}
                style={css`
                  padding: 8px 6px;
                  margin-right: 2px;
                `}
              />
            ) : (
              <>
                {canUploadImage ? (
                  <CustomPressable
                    disabled={loading}
                    onPress={() => {
                      setEnabled(false);
                      openImagePicker({
                        onPickImage: (pickedAssets) => {
                          if (
                            pickedAssets.length + assets.length >
                            MAX_IMAGES_UPLOAD_LENGTH
                          ) {
                            snackbar.open({
                              text: t('UPLOAD_LIMIT_NOTICE', {
                                count: MAX_IMAGES_UPLOAD_LENGTH,
                              }),
                              color: 'warning',
                            });
                          }

                          setAssets(
                            [...assets, ...pickedAssets].splice(
                              0,
                              MAX_IMAGES_UPLOAD_LENGTH,
                            ),
                          );

                          setEnabled(true);
                        },
                        options: {
                          mediaTypes: MediaTypeOptions.Images,
                          allowsMultipleSelection: true,
                          allowsEditing: false,
                        },
                      });
                    }}
                    style={css`
                      border-radius: 99px;
                      padding: 8px;
                      margin-right: -6px;
                    `}
                  >
                    <Icon name="Images" size={22} />
                  </CustomPressable>
                ) : null}
                <CustomPressable
                  delayHoverIn={delayPressIn}
                  disabled={disabled}
                  onPress={createChatMessage}
                  style={css`
                    padding: 6px;
                    border-radius: 99px;
                  `}
                >
                  <Icon
                    color={!disabled ? theme.text.basic : theme.text.disabled}
                    name="PaperPlaneRight"
                    size={22}
                  />
                </CustomPressable>
              </>
            )}
          </ButtonsWrapper>
        }
        multiline
        onChangeText={setMessage}
        placeholder={`${t('MESSAGE_UNCLE_HYO')}...`}
        styles={{
          container: [
            css`
              border-radius: 4px;
            `,
            styles?.container,
          ],
          input: [
            css`
              padding: ${Platform.OS === 'web'
                ? '14px 0 0'
                : Platform.OS === 'android'
                  ? '5.7px 0'
                  : '10px 0'};
            `,
            styles?.input,
          ],
        }}
        textInputProps={{
          onKeyPress: ({nativeEvent}) => {
            if (Platform.OS === 'web') {
              // @ts-ignore
              if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
                createChatMessage();

                return;
              }
            }
          },
        }}
        value={message}
      />
      {assets.length > 0 ? (
        <MultiUploadImageInput
          hideAdd
          hideLabel
          imageUris={assets.map((el) => el.uri)}
          loading={loading}
          onDelete={(index) => {
            if (!loading) {
              setAssets?.(assets.filter((_, i) => i !== index));
            }
          }}
          styles={{
            container: css`
              width: 88px;
              height: 88px;
              border-radius: 8px;
              opacity: ${loading ? '0.5' : '1'};
            `,
            // @ts-ignore
            image: css`
              width: 88px;
              height: 88px;
              border-radius: 8px;
            `,
          }}
        />
      ) : null}
    </Container>
  );
}
