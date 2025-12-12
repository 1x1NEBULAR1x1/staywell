"use client";

import { type BedType, example_bed_type } from "@shared/src";
import { useState } from "react";
import { ListPage } from "@/components/admin/common/AdminPage";
import { BedTypeModal } from "@/components/admin/common/Modal/models/BedTypeModal";
import { BedTypeCard, BedTypeCardShimmer } from "./components";

export const BedTypes = () => {
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [bed_type, setBedType] = useState<BedType | undefined>(undefined);
  return (
    <>
      <ListPage
        create_modal={
          <BedTypeModal
            onClose={() => setIsModalOpen(false)}
            initial_data={bed_type}
          />
        }
        model="BED_TYPE"
        render_item={(bed_type) => (
          <BedTypeCard
            key={bed_type.id}
            bed_type={bed_type}
            setEditBedTypeData={(bed_type) => setBedType(bed_type)}
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
      {is_modal_open && (
        <BedTypeModal
          initial_data={bed_type}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
