import styled, {css} from '@emotion/native';
import {Typography} from 'dooboo-ui';
import {Image} from 'expo-image';
import {Stack} from 'expo-router';

import {IC_HYO} from '../src/icons';
import {t} from '../src/STRINGS';

const Container = styled.View`
  background-color: ${({theme}) => theme.bg.basic};

  flex: 1;
  align-self: stretch;
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  padding: 16px 16px 80px;

  gap: 16px;
  justify-content: center;
  align-items: center;
`;

export default function Index(): JSX.Element {
  return (
    <Container>
      <Stack.Screen options={{title: 'hyochan.dev'}} />
      <Content>
        <Image
          source={IC_HYO}
          style={css`
            width: 128px;
            height: 128px;
          `}
        />
        <Typography.Heading2>{t('WELCOME')}!</Typography.Heading2>
      </Content>
    </Container>
  );
}
