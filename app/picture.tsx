import {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {css} from '@emotion/native';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {IconButton, LoadingIndicator} from 'dooboo-ui';
import {useLocalSearchParams, useRouter} from 'expo-router';

import ResponsiveWrapper from '../src/uis/ResponsiveWrapper';
import {isDesktopDevice} from '../src/utils/common';

export default function Picture(): JSX.Element {
  const {imageUrl} = useLocalSearchParams();
  const {top, right} = useSafeAreaInsets();
  const {back} = useRouter();
  const [loading, setLoading] = useState(true);

  if (!imageUrl || typeof imageUrl !== 'string') {
    return <LoadingIndicator />;
  }

  return (
    <ResponsiveWrapper>
      <View
        style={css`
          flex: 1;
        `}
      >
        <>
          {loading ? (
            <ActivityIndicator
              size="large"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
          ) : null}
          <ImageZoom
            onLoadEnd={() => {
              setLoading(false);
            }}
            style={css`
              opacity: ${loading ? 0 : 1};
            `}
            uri={decodeURIComponent(imageUrl)}
          />
        </>
        <IconButton
          color="light"
          icon="X"
          onPress={() => {
            back();
          }}
          style={css`
            position: absolute;
            right: ${right + 6 + 'px'};
            top: ${isDesktopDevice() ? '12px' : top + 'px'};
          `}
          type="text"
        />
      </View>
    </ResponsiveWrapper>
  );
}
