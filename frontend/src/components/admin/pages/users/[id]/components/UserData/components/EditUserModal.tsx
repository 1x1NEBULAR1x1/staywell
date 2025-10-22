'use client';

import { UserWithoutPassword, AdminUpdateUser, Role } from '@shared/src';
import { BaseFormModal } from '@/components/admin/common/Modal/BaseFormModal';
import { useForm } from 'react-hook-form';
import { InputField, SelectField } from '@/components/admin/common/Form';
import { useUsers } from '@/hooks/admin/queries/users/useUsers';
import { useToast } from '@/hooks/common/useToast';
import { isAxiosError } from 'axios';

interface EditUserModalProps {
  user: UserWithoutPassword;
  onClose: () => void;
  refetch: () => void;
}

type FormData = AdminUpdateUser & {
  image_type: 'file' | 'url';
}

export const EditUserModal = ({ user, onClose, refetch }: EditUserModalProps) => {
  const update_mutation = useUsers().update(user.id);
  const toast = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      ...user,
      image_type: 'url'
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await update_mutation.mutateAsync(data);
      onClose();
      toast.success('User has been updated successfully');
      refetch();
    } catch (error) {
      isAxiosError(error) && toast.error(`Error during update: ${error.message}`);
      console.error('Failed to update user:', error);
    }
  };

  return (
    <BaseFormModal
      is_open
      model="USER"
      onClose={onClose}
      title="Edit User"
      form={form}
      onSubmit={handleSubmit}
    >
      <InputField
        label="First Name"
        name="first_name"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Last Name"
        name="last_name"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Email"
        name="email"
        register={form.register}
        errors={form.formState.errors}
        type="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format'
          }
        }}
      />

      <InputField
        label="Phone Number"
        name="phone_number"
        register={form.register}
        errors={form.formState.errors}
      />

      <InputField
        label="Password"
        name="password"
        register={form.register}
        errors={form.formState.errors}
        type="password"
        rules={{
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        }}
      />

      <SelectField
        label="Role"
        name="role"
        register={form.register}
        errors={form.formState.errors}
        options={[
          { value: Role.USER, label: 'User' },
          { value: Role.ADMIN, label: 'Admin' },
          { value: Role.GUIDE, label: 'Guide' },
        ]}
      />

      <InputField
        label="Is Active"
        name="is_active"
        register={form.register}
        errors={form.formState.errors}
        type="checkbox"
      />

      <InputField
        label="Email Verified"
        name="email_verified"
        register={form.register}
        errors={form.formState.errors}
        type="checkbox"
      />

      <InputField
        label="Phone Verified"
        name="phone_verified"
        register={form.register}
        errors={form.formState.errors}
        type="checkbox"
      />
    </BaseFormModal>
  );
};

