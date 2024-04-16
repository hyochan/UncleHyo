import {startTransition, useCallback, useEffect, useRef, useState} from 'react';
import {Platform, Pressable, View} from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardEvents,
} from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled, {css} from '@emotion/native';
import {FlashList} from '@shopify/flash-list';
import {Icon, Typography, useDooboo} from 'dooboo-ui';
import {Image} from 'expo-image';
import type {ImagePickerAsset} from 'expo-image-picker';
import {Stack} from 'expo-router';

import {useChatApi} from '../src/hooks/useApis';
import {IC_ICON} from '../src/icons';
import {t} from '../src/STRINGS';
import ChatInput from '../src/uis/ChatInput';
import ChatMessageListItem from '../src/uis/ChatMessageListItem';
import {openURL} from '../src/utils/common';
import type {ChatMessage} from '../src/utils/types';

const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${({theme}) => theme.bg.basic};
`;

const EmptyContainer = styled.SafeAreaView`
  padding: 20px;

  justify-content: center;
  align-items: center;
`;

const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
`;

const EMPTY_CONTENT_MARGIN_TOP = 220;
const KEYBOARD_ANIMATION_DURATION = 300;

export default function Index(): JSX.Element {
  const {bottom} = useSafeAreaInsets();
  const {theme} = useDooboo();
  const [message, setMessage] = useState('');
  const [assets, setAssets] = useState<ImagePickerAsset[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<FlashList<ChatMessage>>(null);
  const marginTopValue = useSharedValue(EMPTY_CONTENT_MARGIN_TOP);
  const {triggerSendMessage, isMutatingSendMessage} = useChatApi();

  useEffect(() => {
    const hide = KeyboardEvents.addListener('keyboardWillHide', () => {
      marginTopValue.value = withTiming(EMPTY_CONTENT_MARGIN_TOP, {
        duration: KEYBOARD_ANIMATION_DURATION,
      });
    });

    const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      marginTopValue.value = withTiming(e.height - EMPTY_CONTENT_MARGIN_TOP, {
        duration: KEYBOARD_ANIMATION_DURATION,
      });

      const clear = setTimeout(() => {
        if (listRef.current && chatMessages.length > 0) {
          listRef.current.scrollToOffset({offset: 0, animated: true});
        }

        clearTimeout(clear);
      }, e.duration + 50);
    });

    return () => {
      hide.remove();
      show.remove();
    };
  }, [chatMessages.length, marginTopValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {marginTop: marginTopValue.value};
  });

  const sendChatMessage = useCallback(async (): Promise<void> => {
    const result = await triggerSendMessage({
      histories: chatMessages,
      message,
      sysMessage: '',
    });

    startTransition(() => {
      setChatMessages((prevMessages) => [
        {
          message,
          answer: result.message,
        },
        ...prevMessages,
      ]);
      setMessage('');
    });
  }, [chatMessages, message, triggerSendMessage]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: t('APP_NAME'),
          headerRight: () => (
            <Pressable
              onPress={() => {
                openURL('https://github.com/hyochan/UncleHyo');
              }}
              style={css`
                padding: 12px;
              `}
            >
              <View
                style={css`
                  border-radius: 24px;
                  border-width: 1px;
                  border-color: ${theme.text.basic};
                  padding: 4px;
                `}
              >
                <Icon color={theme.text.basic} name="GithubLogo" size={20} />
              </View>
            </Pressable>
          ),
        }}
      />

      <KeyboardContainer
        behavior="padding"
        contentContainerStyle={css`
          flex: 1;
        `}
        keyboardVerticalOffset={Platform.select({
          ios: bottom + 32,
          android: bottom + 80,
        })}
      >
        <FlashList
          ListEmptyComponent={
            <EmptyContainer>
              <Animated.View
                style={[
                  css`
                    justify-content: center;
                    align-items: center;
                  `,
                  animatedStyle,
                ]}
              >
                <LogoImage
                  source={IC_ICON}
                  style={css`
                    margin-bottom: 12px;
                  `}
                />
                <Typography.Heading4>{t('INTRO')}</Typography.Heading4>
              </Animated.View>
            </EmptyContainer>
          }
          data={chatMessages}
          estimatedItemSize={160}
          //? Issue on inverted flashlist
          // https://github.com/facebook/react-native/issues/21196
          inverted={chatMessages.length !== 0}
          onEndReached={() => {
            // loadNext(LIST_CNT);
          }}
          onEndReachedThreshold={0.1}
          ref={listRef}
          renderItem={({item}) => <ChatMessageListItem item={item} />}
        />
        <ChatInput
          assets={assets}
          canUploadImage={false}
          createChatMessage={sendChatMessage}
          loading={isMutatingSendMessage}
          message={message}
          setAssets={setAssets}
          setMessage={(txt) => {
            setMessage(txt);
          }}
          style={css`
            padding-bottom: ${bottom + 'px'};
          `}
          styles={{
            container: css`
              border-radius: 0;
              border-width: 0px;
              border-top-width: 0.3px;
              padding-bottom: 2px;
            `,
          }}
        />
      </KeyboardContainer>
    </>
  );
}
