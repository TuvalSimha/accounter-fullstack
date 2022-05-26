import { Button } from '@mantine/core';
import { CSSProperties, PropsWithChildren, MouseEventHandler, FC } from 'react';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  width?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: number;
  type?: 'submit' | 'button';
  style?: CSSProperties;
  target?: string;
  herf?: string;
  rel?: string;
  title?: string;
}

export const AccounterButton: FC<PropsWithChildren<ButtonProps>> = ({
  title,
  target,
  herf,
  rel,
  type = 'button',
  onClick = () => {
    void 0;
  },
  loading = false,
  disabled = false,
}) => {
  const buttonDisabled = disabled || loading;

  return (
    <Button type={type} disabled={buttonDisabled} onClick={onClick} style={{ cursor: 'pointer' }}>
      <a style={{ color: 'white' }} rel={rel} href={herf} target={target}>
        {title}
      </a>
    </Button>
  );
};
