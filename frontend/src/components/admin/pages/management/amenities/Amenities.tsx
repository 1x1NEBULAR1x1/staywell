"use client";

import { type Amenity, example_amenity } from "@shared/src";
import { useState } from "react";
import { ListPage } from "@/components/admin/common/AdminPage";
import { AmenityModal } from "@/components/admin/common/Modal/models/AmenityModal";
import { AmenityCard, AmenityCardShimmer } from "./components";

export const Amenities = () => {
  const [is_modal_open, setIsModalOpen] = useState(false);
  const [amenity, setAmenity] = useState<Amenity | undefined>(undefined);
  return (
    <>
      <ListPage
        create_modal={
          <AmenityModal
            onClose={() => setIsModalOpen(false)}
            initial_data={amenity}
          />
        }
        model="AMENITY"
        render_item={(amenity) => (
          <AmenityCard
            key={amenity.id}
            amenity={amenity}
            setEditAmenityData={(amenity) => setAmenity(amenity)}
          />
        )}
        shimmer_item={(key) => <AmenityCardShimmer key={key} />}
        columns={[
          { label: "Name", field: "name" },
          { label: "Created", field: "created" },
        ]}
        sort_by_list={Object.keys(example_amenity)
          .filter(
            (key) =>
              ![
                "image",
                "description",
                "is_excluded",
                "apartment_amenities",
              ].includes(key),
          )
          .sort()}
      />
      {is_modal_open && (
        <AmenityModal
          initial_data={amenity}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
