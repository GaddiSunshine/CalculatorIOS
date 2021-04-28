import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ThemeProvider} from 'styled-components';
import theme from './themes/theme';
import {palette} from 'styled-tools';
import {CalcButton} from './components/Button';
import {View} from 'react-native';

import {buttons, defaultState} from './constants';
import {ButtonType, CalcState} from './types';
import {Output} from './components/Output';

const StyledView = styled.View`
  padding: 10px;
  font-family: Helvetica;
  font-size: 18px;
  height: 100%;
  background-color: ${palette('background')};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Wrapper = styled.View`
  height: 60%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 35px;
`;

const App = () => {
  const [calcState, setCalcState] = useState<CalcState>(defaultState);
  const [clearButton, setClearButton] = useState<ButtonType>({
    handlePress: 'clearAll',
    label: 'AC',
    color: 'third',
    type: 'none',
  });

  const setAc = (isSet: boolean) => {
    const handlePress = isSet ? 'clear' : 'clearAll';
    const label = isSet ? 'C' : 'AC';
    setClearButton({...clearButton, handlePress, label});
  };

  // the % operator works inconsistently in the ios calculator. If the selected
  // operator is either x or /, then it divides the 'onscreen' number by 100.
  // however, if the selected operator is either + or -, then it calculates onscreen percent
  // of the sum and sets as onscreen number.
  const percentage = () => {
    const {currOperator, sum, onScreen} = calcState;

    if (currOperator === '+' || currOperator === '-') {
      setCalcState({
        ...calcState,
        onScreen: `${sum * +onScreen * 0.01}`,
      });
      setAc(false);
    } else {
      if (onScreen === '') {
        setCalcState({...calcState, sum: sum / 100});
      } else {
        setCalcState({...calcState, onScreen: `${+onScreen / 100}`});
      }
    }
  };

  const mathOperation = (operator: string = '', sum: number, value: number) => {
    switch (operator) {
      case '＋':
        return sum + value;
      case '－':
        return sum - value;
      case '✕':
        return sum * value;
      case '÷':
        return sum / value;
    }
    return value;
  };

  const calcOutput = (label: string = '') => {
    const {currOperator, onScreen, sum, previousValue, extraOp} = calcState;

    if (onScreen) {
      setCalcState({
        ...calcState,
        sum: mathOperation(currOperator || extraOp, sum, +onScreen),
        previousValue: +onScreen,
        currOperator: label,
        extraOp: currOperator,
        onScreen: '',
        buttonLabel: label ? label : '=',
      });
    } else {
      setCalcState({
        ...calcState,
        sum: mathOperation(currOperator || extraOp, sum, previousValue),
        currOperator: '',
        buttonLabel: label ? label : '=',
        extraOp: currOperator || extraOp,
      });
    }

    setAc(label === '' ? false : true);
  };

  const handleClick = (button: ButtonType) => {
    const {label, handlePress} = button;
    const {
      onScreen,
      sum,
      currOperator,
      dot,
      buttonLabel,
      previousValue,
      extraOp,
    } = calcState;

    switch (handlePress) {
      case 'conCat':
        if (label === '.' && dot) {
          break;
        }

        // if the previous calculation has ended (with the equals button) then
        // need to reset the state for a new calculation.
        const wasEqual = buttonLabel === '=' ? 'clear' : '';

        let newValue;

        // if the comma is the first button to be pressed, then it will add a 0 in front.
        // Otherwise just concatenate the pressed number onto what we have on the screen.
        newValue =
          onScreen === '' && label === '.'
            ? `0${label}`
            : `${onScreen}${label}`;

        // This is to overwrite the default 0 when a new number is selected.
        if (onScreen === '0' && label !== '.') {
          newValue = label;
        }

        // We create the new state of the calculator. If this is the start of
        // a new calculation, then reset what needs to be reset.
        setCalcState({
          onScreen: newValue,
          dot: label === '.' ? true : dot,
          previousValue: wasEqual ? 0 : previousValue,
          currOperator: wasEqual ? '' : currOperator,
          extraOp: wasEqual ? '' : extraOp,
          sum: wasEqual ? 0 : sum,
          buttonLabel: label,
        });
        setAc(true);
        break;
      case 'setOp':
        if (sum || onScreen) {
          if (currOperator) {
            setCalcState({
              ...calcState,
              currOperator: label,
              buttonLabel: label,
            });
          } else {
            setCalcState({
              ...calcState,
              currOperator: label,
              sum: +onScreen || sum,
              previousValue: +onScreen,
              dot: false,
              onScreen: '',
              buttonLabel: label,
            });
          }
          if (onScreen) {
            calcOutput(label);
          }
          setAc(true);
        }
        break;
      case 'percentage':
        percentage();
        break;
      case 'clear':
        setCalcState({
          ...calcState,
          onScreen: '0',
          dot: false,
          buttonLabel: label,
        });
        setAc(false);
        break;
      case 'clearAll':
        setCalcState(defaultState);
        break;
      case 'flipPositivity':
        setCalcState({
          ...calcState,
          sum: onScreen === '' ? sum * -1 : sum,
          onScreen: onScreen === '' ? '' : `${+onScreen * -1}`,
          buttonLabel: label,
        });
        break;
      case 'calcOutput':
        calcOutput();
    }
  };

  const swipeHandler = () => {
    const newOnScreen = calcState.onScreen.substring(
      0,
      calcState.onScreen.length - 1,
    );
    setCalcState({...calcState, onScreen: newOnScreen || '0'});
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledView>
        {/* Usually I want to keep this in a separate layout component.
        Since this project is small and only has one view, I decided to have it here in App.tsx */}
        <Output
          onSwipe={swipeHandler}
          sum={calcState.sum}
          onScreen={calcState.onScreen}
        />
        <Wrapper>
          <View onTouchStart={() => handleClick(clearButton)}>
            <CalcButton label={clearButton.label} color={clearButton.color} />
          </View>
          {buttons.map((b, index) => (
            <View onTouchStart={() => handleClick(b)} key={index}>
              <CalcButton
                label={b.label}
                color={b.color}
                wide={b.wide || false}
                active={calcState.currOperator === b.label}
                symbol={b.symbol}
              />
            </View>
          ))}
        </Wrapper>
      </StyledView>
    </ThemeProvider>
  );
};

export default App;
