export interface ButtonType {
  label: string;
  color: string;
  handlePress: string;
  type: string;
  wide?: boolean;
  active?: boolean;
  symbol?: string;
}

export interface CalcState {
  sum: number;
  onScreen: string;
  previousValue: number;
  buttonLabel: string;
  currOperator: string;
  dot: boolean;
  extraOp: string;
}
