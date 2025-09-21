import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ButtonPower } from '../ButtonPower';

describe('ButtonPower', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when TV is off', () => {
    const { getByText } = render(
      <ButtonPower isOn={false} onPress={mockOnPress} />
    );

    expect(getByText('Allumer')).toBeTruthy();
  });

  it('should render correctly when TV is on', () => {
    const { getByText } = render(
      <ButtonPower isOn={true} onPress={mockOnPress} />
    );

    expect(getByText('Éteindre')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <ButtonPower isOn={false} onPress={mockOnPress} />
    );

    const button = getByText('Allumer');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <ButtonPower isOn={false} onPress={mockOnPress} disabled={true} />
    );

    const button = getByText('Allumer');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading state when loading prop is true', () => {
    const { getByTestId } = render(
      <ButtonPower isOn={false} onPress={mockOnPress} loading={true} />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
