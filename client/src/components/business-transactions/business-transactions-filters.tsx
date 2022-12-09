import { useEffect, useState } from 'react';
import { ActionIcon, MultiSelect } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import equal from 'deep-equal';
import gql from 'graphql-tag';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Filter } from 'tabler-icons-react';
import {
  BusinessTransactionsFilter,
  useAllBusinessesNamesQuery,
  useAllFinancialEntitiesQuery,
} from '../../__generated__/types';
import { TIMELESS_DATE_REGEX } from '../../helpers/consts';
import { PopUpModal } from '../common';
import { TextInput } from '../common/inputs';

gql`
  query AllBusinessesNames {
    businessNamesFromLedgerRecords
  }
`;

interface BusinessTransactionsFilterFormProps {
  filter: BusinessTransactionsFilter;
  setFilter: (filter: BusinessTransactionsFilter) => void;
  closeModal: () => void;
}

function BusinessTransactionsFilterForm({
  filter,
  setFilter,
  closeModal,
}: BusinessTransactionsFilterFormProps) {
  const { control, handleSubmit } = useForm<BusinessTransactionsFilter>({
    defaultValues: { ...filter },
  });
  const { data: feData, isLoading: feLoading, isError: feError } = useAllFinancialEntitiesQuery();
  const { data: bnData, isLoading: bnLoading, isError: bnError } = useAllBusinessesNamesQuery();

  useEffect(() => {
    if (feError) {
      showNotification({
        title: 'Error!',
        message: 'Oh no!, we have an error fetching financial entities! 🤥',
      });
    }
    if (bnError) {
      showNotification({
        title: 'Error!',
        message: 'Oh no!, we have an error fetching business names! 🤥',
      });
    }
  }, [feError, bnError]);

  const onSubmit: SubmitHandler<BusinessTransactionsFilter> = data => {
    console.log('filter: ', data);
    setFilter(data);
    closeModal();
  };

  function clearFilter() {
    setFilter({});
    closeModal();
  }

  return (
    <>
      {feLoading || bnLoading ? <div>Loading...</div> : <div />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="financialEntityIds"
          control={control}
          defaultValue={undefined}
          render={({ field, fieldState }) => (
            <MultiSelect
              {...field}
              data={
                feData?.allFinancialEntities.map(entity => ({
                  value: entity.id,
                  label: entity.name,
                })) ?? []
              }
              value={field.value ?? ['6a20aa69-57ff-446e-8d6a-1e96d095e988']}
              disabled={feLoading}
              label="Financial Entities"
              placeholder="Scroll to see all options"
              maxDropdownHeight={160}
              searchable
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="businessNames"
          control={control}
          defaultValue={undefined}
          render={({ field, fieldState }) => (
            <MultiSelect
              {...field}
              data={
                bnData?.businessNamesFromLedgerRecords.map(entity => ({
                  value: entity,
                  label: entity,
                })) ?? []
              }
              value={field.value ?? ['6a20aa69-57ff-446e-8d6a-1e96d095e988']}
              disabled={bnLoading}
              label="Business Names"
              placeholder="Scroll to see all options"
              maxDropdownHeight={160}
              searchable
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="fromDate"
          control={control}
          defaultValue={filter.fromDate}
          rules={{
            pattern: {
              value: TIMELESS_DATE_REGEX,
              message: 'Date must be im format yyyy-mm-dd',
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              value={!field.value || field.value === 'Missing' ? '' : field.value}
              error={fieldState.error?.message}
              label="From Date"
            />
          )}
        />
        <Controller
          name="toDate"
          control={control}
          defaultValue={filter.toDate}
          rules={{
            pattern: {
              value: TIMELESS_DATE_REGEX,
              message: 'Date must be im format yyyy-mm-dd',
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              value={!field.value || field.value === 'Missing' ? '' : field.value}
              error={fieldState.error?.message}
              label="To Date"
            />
          )}
        />
        <div className="flex justify-center mt-5 gap-3">
          <button
            type="submit"
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            Filter
          </button>
          <button
            type="button"
            className="text-white bg-orange-500 border-0 py-2 px-8 focus:outline-none hover:bg-orange-600 rounded text-lg"
            onClick={clearFilter}
          >
            Clear
          </button>
          <button
            type="button"
            className="text-white bg-rose-500 border-0 py-2 px-8 focus:outline-none hover:bg-rose-600 rounded text-lg"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

interface BusinessTransactionsFilterProps {
  filter: BusinessTransactionsFilter;
  setFilter: (filter: BusinessTransactionsFilter) => void;
}

export function BusinessTransactionsFilters({
  filter,
  setFilter,
}: BusinessTransactionsFilterProps) {
  const [opened, setOpened] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  function isFilterApplied(filter: BusinessTransactionsFilter) {
    const changed = Object.entries(filter ?? {}).filter(
      ([_key, value]) => value !== undefined && Array.isArray(value) && value.length > 0,
    );
    return changed.length > 0;
  }

  function onSetFilter(newFilter: BusinessTransactionsFilter) {
    // looks for actual changes before triggering update
    if (!equal(newFilter, filter)) {
      setFilter(newFilter);
      setIsFiltered(isFilterApplied(newFilter));
    }
  }

  return (
    <>
      <PopUpModal
        opened={opened}
        onClose={() => setOpened(false)}
        content={
          <BusinessTransactionsFilterForm
            filter={filter}
            setFilter={onSetFilter}
            closeModal={() => setOpened(false)}
          />
        }
      />
      <ActionIcon
        variant="outline"
        color={isFiltered ? 'red' : 'gray'}
        onClick={() => setOpened(true)}
      >
        <Filter size={20} />
      </ActionIcon>
    </>
  );
}