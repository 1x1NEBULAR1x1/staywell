import { useCallback } from "react";
import { useModel } from "@/hooks/admin/queries";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

export const useBookingAdditionalOptions = () => {
  const { selected_additional_options, setSelectedAdditionalOptions } =
    useBookingStore();

  // Get all additional options
  const { data, isLoading, error } = useModel("ADDITIONAL_OPTION").get({
    take: 1000,
    skip: 0,
  });

  // Check if an additional option is selected
  const isAdditionalOptionSelected = useCallback(
    (additional_option_id: string) => {
      return selected_additional_options.some(
        (selected) => selected.additional_option_id === additional_option_id,
      );
    },
    [selected_additional_options],
  );

  // Get a selected additional option
  const getSelectedAdditionalOption = useCallback(
    (additional_option_id: string) => {
      return selected_additional_options.find(
        (selected) => selected.additional_option_id === additional_option_id,
      );
    },
    [selected_additional_options],
  );

  // Add an additional option to the selected options
  const addAdditionalOption = useCallback(
    (additional_option_id: string) => {
      if (isAdditionalOptionSelected(additional_option_id)) return;
      setSelectedAdditionalOptions([
        ...selected_additional_options,
        { additional_option_id, amount: 1 },
      ]);
    },
    [
      selected_additional_options,
      setSelectedAdditionalOptions,
      isAdditionalOptionSelected,
    ],
  );

  // Update amount for a selected additional option
  const updateAdditionalOptionAmount = useCallback(
    (additional_option_id: string, amount: number) => {
      const updatedOptions = selected_additional_options.map((selected) =>
        selected.additional_option_id === additional_option_id
          ? { ...selected, amount }
          : selected,
      );
      setSelectedAdditionalOptions(updatedOptions);
    },
    [selected_additional_options, setSelectedAdditionalOptions],
  );

  // Remove an additional option from selected options
  const removeAdditionalOption = useCallback(
    (additional_option_id: string) => {
      const updatedOptions = selected_additional_options.filter(
        (selected) => selected.additional_option_id !== additional_option_id,
      );
      setSelectedAdditionalOptions(updatedOptions);
    },
    [selected_additional_options, setSelectedAdditionalOptions],
  );

  // Clear all selected additional options
  const clearSelectedAdditionalOptions = useCallback(() => {
    setSelectedAdditionalOptions([]);
  }, [setSelectedAdditionalOptions]);

  return {
    additional_options: data?.items ?? [],
    isLoading,
    error,
    selected_additional_options,
    isAdditionalOptionSelected,
    getSelectedAdditionalOption,
    addAdditionalOption,
    updateAdditionalOptionAmount,
    removeAdditionalOption,
    clearSelectedAdditionalOptions,
  };
};
