import React from 'react';
import {Platform} from 'react-native';
import styled, {css} from 'styled-components/native';
import {palette, switchProp} from 'styled-tools';
import GestureRecognizer from 'react-native-swipe-gestures';

const StyledView = styled.View`
  padding-right: 19px;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledOutput = styled.Text<{count: number}>`
  color: ${palette('white')};
  font-family: 'Helvetica-light';
  font-size: 88px;

  ${switchProp('count', {
    9: css`
      font-size: 54px;
    `,
    8: css`
      font-size: 66px;
    `,
    7: css`
      font-size: 72px;
    `,
  })};
`;

interface Props {
  sum: number;
  onScreen: string;
  onSwipe: () => void;
}

export const Output = ({onScreen, sum, onSwipe}: Props) => {
  while ((onScreen.match(/\d/g) || []).length > 9) {
    onScreen = onScreen.substring(0, onScreen.length - 1);
  }

  const fractionDigits = onScreen.includes('.')
    ? onScreen.split('.')[1].length
    : 0;

  const show = onScreen !== '' ? +onScreen : sum;

  // Depends on locale, but I choose de-DE because it seems to have the . and , seperators which we want
  let formatted = show.toLocaleString('de-DE', {
    minimumFractionDigits: fractionDigits,
  });

  // toLocaleString is not supported on android. This formats the output number on android
  if (Platform.OS === 'android') {
    formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  if (onScreen && onScreen[onScreen.length - 1] === '.') {
    formatted = `${formatted},`;
  }

  while ((formatted.match(/\d/g) || []).length > 9) {
    formatted = formatted.substring(0, formatted.length - 1);
  }

  const numCount = (formatted.match(/\d/g) || []).length;

  return (
    <GestureRecognizer onSwipeLeft={onSwipe} onSwipeRight={onSwipe}>
      <StyledView>
        <StyledOutput count={numCount}>{formatted || '0'}</StyledOutput>
      </StyledView>
    </GestureRecognizer>
  );
};
