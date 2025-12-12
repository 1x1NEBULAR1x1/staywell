"use client";

import { type AdditionalOption, example_additional_option } from "@shared/src";
import { useState } from "react";
import { ListPage } from "@/components/admin/common/AdminPage";
import { AdditionalOptionModal } from "@/components/admin/common/Modal/models/AdditionalOptionModal";
import {
  AdditionalOptionCard,
  AdditionalOptionCardShimmer,
} from "./components";

export const AdditionalOptions = () => {
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [additional_option, setAdditionalOption] = useState<
    AdditionalOption | undefined
  >(undefined);
  return (
    <>
      <ListPage
        create_modal={
          <AdditionalOptionModal
            onClose={() => setIsModalOpen(false)}
            initial_data={additional_option}
          />
        }
        model="ADDITIONAL_OPTION"
        render_item={(additional_option) => (
          <AdditionalOptionCard
            key={additional_option.id}
            additional_option={additional_option}
            setEditAdditionalOptionData={(additional_option) =>
              setAdditionalOption(additional_option)
            }
          />
        )}
        shimmer_item={(key) => <AdditionalOptionCardShimmer key={key} />}
        columns={[
          { label: "Name", field: "name" },
          { label: "Price", field: "price" },
          { label: "Created", field: "created" },
        ]}
        sort_by_list={Object.keys(example_additional_option)
          .filter(
            (key) =>
              !["image", "is_excluded", "booking_additional_options"].includes(
                key,
              ),
          )
          .sort()}
      />
      {is_modal_open && (
        <AdditionalOptionModal
          initial_data={additional_option}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
