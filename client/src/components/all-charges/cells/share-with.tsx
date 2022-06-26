// import gql from 'graphql-tag';
// import { CSSProperties, useCallback } from 'react';

// import { ShareWithFieldsFragment } from '../../../__generated__/types';
// import {
//   businessesNotToShare,
//   businessesWithoutTaxCategory,
//   entitiesWithoutInvoice,
//   privateBusinessExpenses,
//   SuggestedCharge,
// } from '../../../helpers';
// import { useUpdateCharge } from '../../../hooks/use-update-charge';
// import { ConfirmMiniButton, EditMiniButton } from '../../common';
// import { AccounterDivider } from '../../common/divider';

// gql`
//   fragment ShareWithFields on Charge {
//     id
//     beneficiaries {
//       counterparty {
//         name
//       }
//       percentage
//     }
//   }
// `;

// type Props = {
//   data: ShareWithFieldsFragment;
//   isBusiness: boolean;
//   financialEntityName?: string;
//   alternativeCharge?: SuggestedCharge;
//   style?: CSSProperties;
// };

// export const ShareWith = ({ data, isBusiness, financialEntityName = '', alternativeCharge, style }: Props) => {
//   const { beneficiaries, id: chargeId } = data;

//   const { mutate, isLoading } = useUpdateCharge();

//   const updateTag = useCallback(
//     (value?: string) => {
//       mutate({
//         chargeId,
//         fields: { beneficiaries: value },
//       });
//     },
//     [chargeId, mutate]
//   );

//   const hasBeneficiariesd = beneficiaries.length > 0;
//   const shareWithDotanFlag =
//     !hasBeneficiariesd &&
//     (!(isBusiness && !entitiesWithoutInvoice.includes(financialEntityName)) ||
//       [...privateBusinessExpenses, ...businessesNotToShare, ...businessesWithoutTaxCategory].includes(
//         financialEntityName
//       ));

//   return (
//     <td
//       style={{
//         ...(shareWithDotanFlag ? { backgroundColor: 'rgb(236, 207, 57)' } : {}),
//         ...style,
//       }}
//     >
//       {beneficiaries.map(beneficiary => `${beneficiary.counterparty.name}: ${beneficiary.percentage}`)}
//       {!hasBeneficiariesd && alternativeCharge?.financialAccountsToBalance}
//       {!hasBeneficiariesd && alternativeCharge?.financialAccountsToBalance && (
//         <ConfirmMiniButton
//           onClick={() => updateTag(alternativeCharge.financialAccountsToBalance)}
//           disabled={isLoading}
//         />
//       )}
//       <AccounterDivider my="sm" />
//       <EditMiniButton
//         onClick={() => updateTag(prompt('New Account to share (use old string method):') ?? undefined)}
//         disabled={isLoading}
//       />
//     </td>
//   );
// };

// NOTE: deprecated
export {};