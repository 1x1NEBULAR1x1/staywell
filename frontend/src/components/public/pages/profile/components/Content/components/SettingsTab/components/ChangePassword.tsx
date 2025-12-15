"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActionsSection, InputField } from "@/components/admin/common/Form";
import { useAuth } from "@/hooks/common";
import { useToast } from "@/hooks/common/useToast";
import classes from "./ChangePassword.module.scss";

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const ChangePassword = () => {
  const { changePassword, is_change_password_loading } = useAuth();
  const toast = useToast();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordForm) => {
    try {
      changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });

      toast.success("Password successfully changed");
      form.reset();
    } catch (error) {
      // Error is already handled in useAuth
      console.error("Failed to change password:", error);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className={classes.change_password}>
      <div className={classes.section_header}>
        <h3>Change Password</h3>
        <p>Update your password to protect your account</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className={classes.form}>
        <div className={classes.password_fields}>
          <div className={classes.password_field}>
            <InputField
              label="Current Password"
              name="current_password"
              type={showPasswords.current ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message: "Password must contain at least 6 characters",
                },
              }}
            />
            <button
              type="button"
              className={classes.eye_button}
              onClick={() => togglePasswordVisibility("current")}
            >
              {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className={classes.password_field}>
            <InputField
              label="New Password"
              name="new_password"
              type={showPasswords.new ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must contain at least 6 characters",
                },
                validate: {
                  not_same_as_current: (value) => {
                    const currentPassword = form.getValues("current_password");
                    if (currentPassword && value === currentPassword) {
                      return "New password must be different from current";
                    }
                    return true;
                  },
                },
              }}
            />
            <button
              type="button"
              className={classes.eye_button}
              onClick={() => togglePasswordVisibility("new")}
            >
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className={classes.password_field}>
            <InputField
              label="Confirm Password"
              name="confirm_password"
              type={showPasswords.confirm ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "Password confirmation is required",
                validate: {
                  matches: (value) => {
                    const newPassword = form.getValues("new_password");
                    if (value !== newPassword) {
                      return "Passwords do not match";
                    }
                    return true;
                  },
                },
              }}
            />
            <button
              type="button"
              className={classes.eye_button}
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <ActionsSection
          is_loading={is_change_password_loading}
          is_valid={form.formState.isValid}
          handleClose={() => form.reset()}
          action="update"
        />
      </form>
    </div>
  );
};
