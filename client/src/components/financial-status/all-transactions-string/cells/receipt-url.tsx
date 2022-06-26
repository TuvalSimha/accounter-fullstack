import { CSSProperties } from 'react';

import { isBusiness } from '../../../../helpers';
import type { TransactionType } from '../../../../models/types';
import { UpdateButton } from '../../../common';

type Props = {
  transaction: TransactionType;
  style?: CSSProperties;
};

export const ReceiptUrl = ({ transaction, style }: Props) => {
  const indicator = isBusiness(transaction) && !transaction.receipt_url && !transaction.tax_invoice_file;

  return (
    <td
      style={{
        ...(indicator ? { backgroundColor: 'rgb(236, 207, 57)' } : {}),
        ...style,
      }}
    >
      {transaction.receipt_url && (
        <a href={transaction.receipt_url} target="_blank" rel="noreferrer">
          yes
        </a>
      )}
      <UpdateButton transaction={transaction} propertyName="receipt_url" promptText="New Receipt url:" />
    </td>
  );
};