import { CSSProperties } from 'react';
import gql from 'graphql-tag';
import { BankDescriptionFieldsFragment } from '../../../__generated__/types';

gql`
  fragment bankDescriptionFields on Charge {
    transactions {
      description
    }
  }
`;

type Props = {
  description: BankDescriptionFieldsFragment['transactions'][0]['description'];
  style?: CSSProperties;
};

export const BankDescription = ({ description = '', style }: Props) => {
  return <td style={{ ...style }}>{description}</td>;
};