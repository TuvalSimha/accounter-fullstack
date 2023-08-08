import { useMutation } from 'urql';
import { showNotification } from '@mantine/notifications';
import {
  FetchIncomeDocumentsDocument,
  FetchIncomeDocumentsMutation,
  FetchIncomeDocumentsMutationVariables,
} from '../gql/graphql.js';

/* GraphQL */ `
  mutation FetchIncomeDocuments($ownerId: ID!) {
    fetchIncomeDocuments(ownerId: $ownerId) {
      id
    }
  }
`;

export const useFetchIncomeDocuments = () => {
  // TODO: add authentication
  // TODO: add local data update method after change

  const [{ fetching }, mutate] = useMutation(FetchIncomeDocumentsDocument);

  return {
    fetching,
    fetchIncomeDocuments: (variables: FetchIncomeDocumentsMutationVariables) =>
      new Promise<FetchIncomeDocumentsMutation['fetchIncomeDocuments']>((resolve, reject) =>
        mutate(variables).then(res => {
          if (res.error) {
            console.error(`Error fetching documents owned by [${variables.ownerId}]: ${res.error}`);
            showNotification({
              title: 'Error!',
              message: 'Oh no!, we have an error! 🤥',
            });
            return reject(res.error.message);
          }
          if (!res.data) {
            console.error(
              `Error fetching documents owned by [${variables.ownerId}]: No data returned`,
            );
            showNotification({
              title: 'Error!',
              message: 'Oh no!, we have an error! 🤥',
            });
            return reject('No data returned');
          }
          showNotification({
            title: 'Update Success!',
            message:
              res.data.fetchIncomeDocuments.length > 0
                ? 'New documents fetched! 🎉'
                : 'No new documents found',
          });
          return resolve(res.data.fetchIncomeDocuments);
        }),
      ),
  };
};