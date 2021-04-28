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

/**
 * Takes a string that contains numbers. Reduces the amount of numbers from the right
 * until the string contains 9 numbers at most. Then returns it.
 * @param number - the number that needs to be reduced 9 numbers at most
 * @returns - the number
 */
const limitNumberCount9 = (number: string) => {
  let newNumber = number;
  while ((newNumber.match(/\d/g) || []).length > 9) {
    newNumber = newNumber.substring(0, newNumber.length - 1);
  }
  return newNumber;
};

export const Output = ({onScreen, sum, onSwipe}: Props) => {
  // The screen is supposed to limit the upper bound of number count at 9
  onScreen = limitNumberCount9(onScreen);

  // Counts the number of fraction digits.
  const fractionDigits = onScreen.includes('.')
    ? onScreen.split('.')[1].length
    : 0;

  // If the onscreen is empty, then show the sum instead.
  const show = onScreen !== '' ? +onScreen : sum;

  // Depends on locale, but I choose de-DE because it seems to have the . and , seperators which we want.
  // The minimumFractionDigits make sure that if we have trailing zeroes, they are still shown on screen.
  let formatted = show.toLocaleString('de-DE', {
    minimumFractionDigits: fractionDigits,
  });

  // toLocaleString is not supported on android. This formats the output number correctly on android
  if (Platform.OS === 'android' || true) {
    formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // If the most recent button was ',', then it is discarded when the string is parsed to number.
  // Therefore we add it back on.
  if (onScreen && onScreen[onScreen.length - 1] === '.') {
    formatted = `${formatted},`;
  }

  // We need to do this again
  formatted = limitNumberCount9(formatted);

  // Counts the amount of numbers on screen for appropriate font size
  const numCount = (formatted.match(/\d/g) || []).length;

  return (
    <GestureRecognizer onSwipeLeft={onSwipe} onSwipeRight={onSwipe}>
      <StyledView>
        <StyledOutput count={numCount}>{formatted || '0'}</StyledOutput>
      </StyledView>
    </GestureRecognizer>
  );
};
