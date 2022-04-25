import * as React from 'react';
import { useSql } from '../../hooks/useSql';
import type { TransactionType } from '../../models/types';

type Props = {
  transaction: TransactionType;
  propertyName: keyof TransactionType;
  value?: string;
};

export const ConfirmButton: React.FC<Props> = ({
  transaction,
  propertyName,
  value,
}) => {
  const updateToNew = () => {
    const { editTransaction } = useSql();
    if (!value) {
      return;
    }

    const changeRequest = {
      newValue: value,
      propertyToChange: propertyName,
      id: transaction.id,
      // bank_reference: transaction.bank_reference,
      // account_number: transaction.account_number,
      // account_type: transaction.account_type,
      // currency_code: transaction.currency_code,
      // event_date: transaction.event_date
      //   .toISOString()
      //   .replace(/T/, ' ')
      //   .replace(/\..+/, ''),
      // event_amount: transaction.event_amount,
      // event_number: transaction.event_number,
    };
    console.log(changeRequest);

    editTransaction(changeRequest);
  };

  return (
    <div>
      {transaction.tax_category}
      <button type="button" onClick={updateToNew}>
        V
      </button>
    </div>
  );
};