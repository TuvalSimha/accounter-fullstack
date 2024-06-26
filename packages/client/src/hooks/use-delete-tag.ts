import { useMutation } from 'urql';
import { showNotification } from '@mantine/notifications';
import { DeleteTagDocument, DeleteTagMutationVariables } from '../gql/graphql.js';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- used by codegen
/* GraphQL */ `
  mutation DeleteTag($tagId: UUID!) {
    deleteTag(id: $tagId)
  }
`;

type UseDeleteTag = {
  fetching: boolean;
  deleteTag: (variables: DeleteTagMutationVariables & { name: string }) => Promise<void>;
};

export const useDeleteTag = (): UseDeleteTag => {
  // TODO: add authentication
  // TODO: add local data update method after chang e

  const [{ fetching }, mutate] = useMutation(DeleteTagDocument);

  return {
    fetching,
    deleteTag: (variables: DeleteTagMutationVariables & { name: string }): Promise<void> =>
      new Promise<void>((resolve, reject) =>
        mutate(variables).then(res => {
          if (res.error) {
            console.error(`Error deleting new tag [${variables.name}]: ${res.error}`);
            showNotification({
              title: 'Error!',
              message: 'Oh no!, we have an error! 🤥',
            });
            return reject(res.error.message);
          }
          if (!res.data?.deleteTag) {
            console.error(`Error deleting new tag [${variables.name}]`);
            showNotification({
              title: 'Error!',
              message: 'Oh no!, we have an error! 🤥',
            });
            return reject('No data returned');
          }
          showNotification({
            title: 'Tag Deleted!',
            message: `"${variables.name}" tag was successfully removed`,
          });
          return resolve();
        }),
      ),
  };
};
