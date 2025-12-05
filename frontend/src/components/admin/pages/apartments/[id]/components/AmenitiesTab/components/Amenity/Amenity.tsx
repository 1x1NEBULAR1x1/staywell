import type { ExtendedApartmentAmenity } from "@shared/src";
import { X } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { ToolTip } from "@/components/styles";
import { useModel } from "@/hooks/admin/queries/useModel";
import classes from "./Amenity.module.scss";

export const Amenity = ({
  amenity,
  refetch,
}: {
  amenity: ExtendedApartmentAmenity;
  refetch: () => void;
}) => {
  const delete_mutation = useModel("APARTMENT_AMENITY").remove(amenity.id);

  const handleDeleteAmenity = async () => {
    await delete_mutation.mutateAsync();
    refetch();
  };

  return (
    <div key={amenity.id} className={classes.amenity}>
      <div className={classes.amenity_container}>
        <ToolTip label={amenity.amenity.name} variant="main" position="bottom">
          <Image
            src={amenity.amenity.image || no_image.src}
            alt={amenity.amenity.name}
            quality={100}
            width={32}
            height={32}
            className={classes.amenity_icon}
          />
        </ToolTip>
        <button
          className={classes.delete_button}
          onClick={handleDeleteAmenity}
          type="button"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
