import type { CruddableTypes, ExtendedAmenity } from "@shared/src";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ImageUploader, InputField } from "@/components/admin/common/Form";
import { BaseFormModal } from "@/components/admin/common/Modal/BaseFormModal";
import { useModel } from "@/hooks/admin/queries/useModel";
import { useToast } from "@/hooks/common/useToast";

type FormData = CruddableTypes<"AMENITY">["create"] & {
  image_type: "file" | "url";
  files: File[];
  url: string;
};

interface AmenityModalProps {
  onClose: () => void;
  refetch: () => void;
  initial_data?: ExtendedAmenity;
}

export const AmenityModal = ({
  onClose,
  refetch,
  initial_data,
}: AmenityModalProps) => {
  const toast = useToast();
  const update_mutation = useModel("AMENITY").update(initial_data?.id ?? "");
  const create_mutation = useModel("AMENITY").create();

  const form = useForm<FormData>({
    defaultValues: {
      name: initial_data?.name ?? "",
      image: initial_data?.image ?? "",
      description: initial_data?.description ?? "",
      image_type: initial_data?.image ? "url" : "file",
      files: [],
      url: initial_data?.image ?? "",
    },
  });

  const handleCreate = async (data: FormData) => {
    try {
      await (initial_data ? update_mutation : create_mutation).mutateAsync({
        name: data.name,
        image: data.image_type === "url" ? data.url : undefined,
        file: data.image_type === "file" ? data.files[0] : undefined,
        description: data.description,
      });
      toast.success(
        `Amenity ${!initial_data ? "created" : "updated"} successfully`,
      );
      onClose();
    } catch (error) {
      isAxiosError(error) &&
        toast.error(
          `Error during ${!initial_data ? "creating" : "updating"}: ${error.message}`,
        );
      console.error(error);
    } finally {
      refetch();
    }
  };

  return (
    <BaseFormModal
      is_open
      onClose={onClose}
      title="Add Amenity"
      form={form}
      onSubmit={handleCreate}
      model="AMENITY"
      is_loading={
        initial_data ? update_mutation.isPending : create_mutation.isPending
      }
      id={initial_data?.id}
    >
      <ImageUploader
        is_loading={
          initial_data ? update_mutation.isPending : create_mutation.isPending
        }
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
        label="Image"
        placeholder="https://example.com/image.jpg"
        image_file_field_name="files"
        image_url_field_name="url"
        image_type_field_name="image_type"
      />
      <InputField
        label="Name"
        name="name"
        placeholder="Name"
        required
        register={form.register}
        errors={form.formState.errors}
      />
      <InputField
        label="Description"
        name="description"
        placeholder="Description"
        register={form.register}
        errors={form.formState.errors}
      />
    </BaseFormModal>
  );
};
