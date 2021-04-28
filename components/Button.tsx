import React from 'react';
import styled, {css} from 'styled-components/native';
import {palette, switchProp, ifProp} from 'styled-tools';

import {ButtonType} from '../types';

// We need a bright background behind the buttons so they will light up
// when pressed, instead of fading into the dark background of the calculator,
const BackgroundView = styled.View`
  background-color: rgba(255, 255, 255, 0.7);
  margin: 10px 0;
  border-radius: 50px;
  overflow: hidden;
`;

const StyledButton = styled.TouchableOpacity<{wide: boolean; color: string}>`
  padding-left: ${ifProp('wide', '30px', '0')};
  height: 80px;
  width: ${ifProp('wide', '172px', '80px')};
  display: flex;
  justify-content: center;
  align-items: ${ifProp('wide', 'flex-start', 'center')};

  ${switchProp('color', {
    primary: css`
      background-color: ${palette('primary')};
    `,
    secondary: css`
      background-color: ${palette('secondary')};
    `,
    third: css`
      background-color: ${palette('third')};
    `,
    down: css`
      background-color: ${palette('white')};
    `,
  })};
`;

const StyledText = styled.Text<{color: string}>`
  font-family: 'Helvetica';
  font-size: 30px;

  ${switchProp('color', {
    primary: css`
      color: ${palette('white')};
    `,
    secondary: css`
      color: ${palette('white')};
    `,
    third: css`
      color: ${palette('background')};
    `,
    down: css`
      color: ${palette('primary')};
    `,
  })};
`;

type Props = Omit<ButtonType, 'handlePress' | 'type'>;

export const CalcButton = ({label, wide, color, active, symbol}: Props) => {
  return (
    <BackgroundView>
      <StyledButton wide={wide || false} color={active ? 'down' : color}>
        <StyledText color={active ? 'down' : color}>
          {symbol ? symbol : label}
        </StyledText>
      </StyledButton>
    </BackgroundView>
  );
};
