"use client";

import type { UpdateUser, UserWithoutPassword } from "@shared/src";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActionsSection, InputField } from "@/components/admin/common/Form";
import { useUsers } from "@/hooks/admin/queries/users";
import { useToast } from "@/hooks/common/useToast";
import { query_client } from "@/lib/api";
import { ImagePreview } from "./components/ImagePreview";
import classes from "./InlineProfileForm.module.scss";

interface InlineProfileFormProps {
  user: UserWithoutPassword;
  onSuccess: () => void;
}

type FormData = Omit<Partial<UpdateUser>, "date_of_birth"> & {
  file: File | null;
  date_of_birth?: string;
};

export const InlineProfileForm = ({
  user,
  onSuccess,
}: InlineProfileFormProps) => {
  const update_mutation = useUsers().update(user.id);
  const toast = useToast();
  const [image_changed, setImageChanged] = useState<boolean>(false);
  const form = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      file: null,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone_number:
        user.phone_number && user.phone_number !== "null"
          ? user.phone_number
          : undefined,
      date_of_birth: user.date_of_birth
        ? new Date(user.date_of_birth).toISOString().split("T")[0]
        : undefined,
    },
  });
  const handleSubmit = async (data: FormData) => {
    try {
      const submitData = {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth)
          : undefined,
      };
      const response = await update_mutation.mutateAsync(submitData);
      if (response.data) {
        console.log("response.data", response.data);
        query_client.invalidateQueries({ queryKey: ["account"] });
        toast.success("Profile updated successfully");
        onSuccess();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          `Failed to update profile: ${error.response?.data?.message || error.message}`,
        );
      } else {
        toast.error("Failed to update profile");
      }
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    onSuccess();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={classes.profile_form}
    >
      {/* Main content with image and fields side by side */}
      <div className={classes.profile_edit_layout}>
        {/* Profile Image */}
        <div className={classes.image_section}>
          <ImagePreview
            imageFile={form.watch("file")}
            currentImage={user.image}
            onFileSelect={(file) => {
              form.setValue("file", file);
              setImageChanged(true);
            }}
          />
        </div>

        {/* Personal Information Fields */}
        <div className={classes.fields_section}>
          <InputField
            label="First Name"
            name="first_name"
            register={form.register}
            errors={form.formState.errors}
            rules={{
              minLength: {
                value: 1,
                message: "First name must be at least 1 character",
              },
              maxLength: {
                value: 255,
                message: "First name must be less than 255 characters",
              },
            }}
          />

          <InputField
            label="Last Name"
            name="last_name"
            register={form.register}
            errors={form.formState.errors}
            rules={{
              minLength: {
                value: 1,
                message: "Last name must be at least 1 character",
              },
              maxLength: {
                value: 255,
                message: "Last name must be less than 255 characters",
              },
            }}
          />

          <InputField
            label="Date of Birth"
            name="date_of_birth"
            register={form.register}
            errors={form.formState.errors}
            rules={{
              validate: {
                is_valid: (value) => {
                  if (value) {
                    const birthDate = new Date(String(value));
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time to start of day
                    if (birthDate >= today) {
                      return "Date of birth must be before today";
                    }
                  }
                  return true;
                },
              },
            }}
            type="date"
          />

          <InputField
            label="Phone Number"
            name="phone_number"
            register={form.register}
            errors={form.formState.errors}
            rules={{
              pattern: {
                value: /^\+[1-9]\d{1,14}$/,
                message: "Phone number must be in format +XXXXXXXXXX",
              },
            }}
          />
        </div>
      </div>

      <div className={classes.actions_wrapper}>
        <ActionsSection
          is_loading={update_mutation.isPending}
          is_valid={
            (form.formState.isValid &&
              Object.keys(form.formState.touchedFields).length > 0) ||
            image_changed
          }
          handleClose={handleCancel}
          model="USER"
          action="update"
          id={user.id}
        />
      </div>
    </form>
  );
};
