"use client";

import type { UpdateUser, User, UserWithoutPassword } from "@shared/src";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/admin/common/Form";
import { BaseFormModal } from "@/components/admin/common/Modal/BaseFormModal";
import { useAccount } from "@/hooks/common";
import { useToast } from "@/hooks/common/useToast";
import { UsersApi } from "@/lib/api/services";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

type FormData = Partial<UserWithoutPassword> & {
  image_type: "file" | "url";
  password?: string;
};

export const EditProfileModal = ({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) => {
  const { updateUser } = useAccount();
  const toast = useToast();
  const usersApi = new UsersApi();

  const form = useForm<FormData>({
    defaultValues: {
      ...user,
      image_type: "url",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const update_data: Record<string, unknown> = {};

      // Only include fields that have changed
      if (data.first_name !== user.first_name)
        update_data.first_name = data.first_name;
      if (data.last_name !== user.last_name)
        update_data.last_name = data.last_name;
      if (data.phone_number !== user.phone_number)
        update_data.phone_number = data.phone_number;
      if (data.image !== user.image) update_data.image = data.image;
      if (data.password) update_data.password = data.password;

      const response = await usersApi.update(
        { id: user.id },
        update_data as UpdateUser,
      );

      if (response.data) {
        updateUser(response.data);
        toast.success("Profile updated successfully");
        onClose();
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

  return (
    <BaseFormModal
      is_open={isOpen}
      model="USER"
      onClose={onClose}
      title="Edit Profile"
      form={form}
      onSubmit={handleSubmit}
      id={user.id}
      size="md"
    >
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

      <InputField
        label="Profile Image URL"
        name="image"
        register={form.register}
        errors={form.formState.errors}
        placeholder="https://example.com/avatar.jpg"
      />

      <InputField
        label="New Password (optional)"
        name="password"
        register={form.register}
        errors={form.formState.errors}
        type="password"
        rules={{
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
          },
        }}
      />
    </BaseFormModal>
  );
};
