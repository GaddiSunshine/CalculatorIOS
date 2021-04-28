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
const limitNumberCount = (number: string, limit: number) => {
  let newNumber = number;
  while ((newNumber.match(/\d/g) || []).length > limit) {
    newNumber = newNumber.substring(0, newNumber.length - 1);
  }
  return newNumber;
};

/**
 * Formats the big number with xe^y syntax
 * @param number - a big number that doesnt fit the screen
 * @returns - the number in the preferred format
 */

const formatBigNumber = (number: string) => {
  const count = (number.split('.')[0].match(/\d/g) || []).length;
  const num = limitNumberCount(`${+number / 10 ** (count - 1)}`, 5);

  return `${num}e${count - 1}`;
};

/**
 * Counts the amount of zeroes in the beginning of a number
 * @param number - the number to be checked
 * @returns - the amount of starting zeroes
 */

const countStartingZeroes = (number: number) => {
  if (number > 1 || number === 0) {
    return 0;
  }
  let zeroCount = 0;
  let temp = number;
  while (temp < 1) {
    console.log(temp);
    temp *= 10;
    zeroCount += 1;
  }
  return zeroCount;
};

/**
 * Formats the small number with xe^-y syntax
 * @param number - a small number that doesnt fit the screen
 * @returns - the number in the preferred format
 */
const formatSmallNumber = (number: string) => {
  const zeroCount = countStartingZeroes(+number);
  const num = limitNumberCount(`${+number * 10 ** zeroCount}`, 5);

  return `${num}e-${zeroCount - 1}`;
};

export const Output = ({onScreen, sum, onSwipe}: Props) => {
  // If the onscreen is empty, then show the sum instead.
  const show = onScreen !== '' ? +onScreen : sum;

  // Checks if the numbers are too big or too small for the screen, then
  // displays the number differently with x.xexx format
  const tooBig = show > 999999999 ? formatBigNumber(`${show}`) : '';
  const tooSmall =
    countStartingZeroes(show) > 3 ? formatSmallNumber(`${show}`) : '';

  let formatted;

  // If the number fits the screen, then we need to format it the way we want it.
  if (!tooBig && !tooSmall) {
    // The screen is supposed to limit the upper bound of number count at 9
    onScreen = limitNumberCount(onScreen, 9);

    // Counts the number of fraction digits.
    const fractionDigits = onScreen.includes('.')
      ? onScreen.split('.')[1].length
      : 0;

    // Depends on locale, but I choose de-DE because it seems to have the . and , seperators which we want.
    // The minimumFractionDigits make sure that if we have trailing zeroes, they are still shown on screen.
    formatted = show.toLocaleString('de-DE', {
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
  } else {
    formatted = tooBig ? tooBig : tooSmall;
  }

  // Counts the amount of numbers on screen for appropriate font size
  const numCount =
    tooBig || tooSmall ? 9 : (formatted.match(/\d/g) || []).length;

  return (
    <GestureRecognizer onSwipeLeft={onSwipe} onSwipeRight={onSwipe}>
      <StyledView>
        <StyledOutput count={numCount}>{formatted || '0'}</StyledOutput>
      </StyledView>
    </GestureRecognizer>
  );
};
