import type { ExtendedApartmentBed } from "@shared/src";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import no_image from "@/../public/common/no-image.jpeg";
import { ToolTip } from "@/components/styles";
import { useModel } from "@/hooks/admin/queries/useModel";
import { usePId } from "@/hooks/common/useId";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./ApartmentBed.module.scss";

export const ApartmentBed = ({ bed }: { bed: ExtendedApartmentBed }) => {
  const id = usePId();
  const { refetch: refetch_apartment } = useModel("APARTMENT").find(id);

  const [count, setCount] = useState(bed.count.toString());

  const update_mutation = useModel("APARTMENT_BED").update(bed.id);
  const delete_mutation = useModel("APARTMENT_BED").remove(bed.id);

  const handleUpdateCount = async (value: string) => {
    setCount(value);

    if (value === "") return;

    const parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue)) return;

    await update_mutation.mutateAsync({ count: parsedValue });
  };

  const handleDeleteBed = async () => {
    try {
      await delete_mutation.mutateAsync();
      refetch_apartment();
    } catch (error) {
      console.error("Failed to delete bed:", error);
    }
  };

  return (
    <div className={classes.bed}>
      <input
        className={classes.bed_count}
        value={count}
        onChange={(e) => handleUpdateCount(e.target.value)}
      />
      <X size={16} />
      <div className={classes.bed_container}>
        <ToolTip label={bed.bed_type.name} variant="main" position="bottom">
          <Image
            src={getImageUrl(bed.bed_type.image) || no_image.src}
            alt={bed.bed_type.name}
            quality={100}
            width={32}
            height={32}
            className={classes.bed_icon}
          />
        </ToolTip>
        <button
          className={classes.delete_button}
          onClick={handleDeleteBed}
          type="button"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
