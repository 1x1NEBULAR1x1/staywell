"use client";

import { type BedType, example_bed_type } from "@shared/src";
import { useState } from "react";
import { CreateButton, ListPage } from "@/components/admin/common/AdminPage";
import { BedTypeModal } from "@/components/admin/common/Modal/models/BedTypeModal";
import { BedTypeCard, BedTypeCardShimmer } from "./components";

export const BedTypes = () => {
  const [modal_data, setModalData] = useState<{
    is_modal_open: boolean;
    bed_type: BedType | undefined;
  }>({ is_modal_open: false, bed_type: undefined });
  return (
    <>
      <ListPage
        create_button={
          <CreateButton
            label="Add Bed Type"
            onClick={() =>
              setModalData({ is_modal_open: true, bed_type: undefined })
            }
          />
        }
        model="BED_TYPE"
        render_item={(bed_type) => (
          <BedTypeCard
            key={bed_type.id}
            bed_type={bed_type}
            setEditBedTypeData={(bed_type) =>
              setModalData({ is_modal_open: true, bed_type })
            }
          />
        )}
        shimmer_item={(key) => <BedTypeCardShimmer key={key} />}
        columns={[
          { label: "Name", field: "name" },
          { label: "Created", field: "created" },
        ]}
        sort_by_list={Object.keys(example_bed_type)
          .filter(
            (key) => !["image", "is_excluded", "apartment_beds"].includes(key),
          )
          .sort()}
      />
      {modal_data.is_modal_open && (
        <BedTypeModal
          initial_data={modal_data.bed_type}
          onClose={() =>
            setModalData({ is_modal_open: false, bed_type: undefined })
          }
        />
      )}
    </>
  );
};
