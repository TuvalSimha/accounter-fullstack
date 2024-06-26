import { ReactElement, useCallback, useContext, useState } from 'react';
import { PlaylistAdd, TrashX } from 'tabler-icons-react';
import { useQuery } from 'urql';
import { ActionIcon, TextInput } from '@mantine/core';
import { AllTagsScreenDocument } from '../../gql/graphql.js';
import { sortTags } from '../../helpers/index.js';
import { useAddTag } from '../../hooks/use-add-tag';
import { useDeleteTag } from '../../hooks/use-delete-tag';
import { FiltersContext } from '../../providers/filters-context';
import { AccounterLoader, EditTagModal } from '../common';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- used by codegen
/* GraphQL */ `
  query AllTagsScreen {
    allTags {
      id
      name
      namePath
      ...EditTagFields
    }
  }
`;

export const TagsManager = (): ReactElement => {
  const { setFiltersContext } = useContext(FiltersContext);
  const [newTag, setNewTag] = useState('');
  const [{ data, fetching }, refetch] = useQuery({
    query: AllTagsScreenDocument,
  });
  const { addTag } = useAddTag();
  const { deleteTag } = useDeleteTag();

  setFiltersContext(null);

  const allTags = sortTags(data?.allTags ?? []);

  const onAddTag = useCallback(
    (tagName: string) => {
      if (tagName.length > 2) {
        addTag({ tagName }).then(() => {
          refetch();
        });
      }
    },
    [addTag, refetch],
  );
  const onDeleteTag = useCallback(
    (tagId: string, tagName: string) => {
      deleteTag({ tagId, name: tagName }).then(() => {
        refetch();
      });
    },
    [deleteTag, refetch],
  );

  return (
    <div className="text-gray-600 body-font">
      <div className="container md:px-5 px-2 md:py-12 py-2 mx-auto">
        {fetching ? (
          <AccounterLoader />
        ) : (
          <div className="h-full flex flex-col overflow-hidden">
            {allTags?.map(tag => (
              <div key={tag.id} className="flex items-center gap-2 text-gray-600 mb-2">
                <div className="w-full mt-1 relative rounded-md shadow-sm">
                  {tag.namePath?.map((_, i) => <span key={i} className="ms-2" />)}
                  {tag.name}
                </div>
                <EditTagModal data={tag} />
                <ActionIcon onClick={(): void => onDeleteTag(tag.id, tag.name)}>
                  <TrashX size={20} />
                </ActionIcon>
              </div>
            ))}
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <div className="w-full mt-1 relative rounded-md shadow-sm">
                <TextInput
                  value={newTag}
                  onChange={(event): void => setNewTag(event.currentTarget.value)}
                  placeholder="Add new tag"
                  withAsterisk
                />
              </div>
              <ActionIcon disabled={newTag.length < 2} onClick={(): void => onAddTag(newTag)}>
                <PlaylistAdd size={20} />
              </ActionIcon>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
