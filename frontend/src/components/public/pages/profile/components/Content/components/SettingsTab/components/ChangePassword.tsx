"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/common";
import { InputField } from "@/components/admin/common/Form";
import { ActionsSection } from "@/components/admin/common/Form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/common/useToast";
import classes from "./ChangePassword.module.scss";

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const ChangePassword = () => {
  const { changePassword } = useAuth();
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
      await changePassword.mutateAsync({
        current_password: data.current_password,
        new_password: data.new_password,
      });

      toast.success("Пароль успешно изменён");
      form.reset();
    } catch (error) {
      // Ошибка уже обрабатывается в useAuth
      console.error("Failed to change password:", error);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className={classes.change_password}>
      <div className={classes.section_header}>
        <h3>Смена пароля</h3>
        <p>Обновите пароль для защиты вашего аккаунта</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className={classes.form}>
        <div className={classes.password_fields}>
          <div className={classes.password_field}>
            <InputField
              label="Текущий пароль"
              name="current_password"
              type={showPasswords.current ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "Текущий пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
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
              label="Новый пароль"
              name="new_password"
              type={showPasswords.new ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "Новый пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
                validate: {
                  not_same_as_current: (value) => {
                    const currentPassword = form.getValues("current_password");
                    if (currentPassword && value === currentPassword) {
                      return "Новый пароль должен отличаться от текущего";
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
              label="Подтверждение пароля"
              name="confirm_password"
              type={showPasswords.confirm ? "text" : "password"}
              register={form.register}
              errors={form.formState.errors}
              rules={{
                required: "Подтверждение пароля обязательно",
                validate: {
                  matches: (value) => {
                    const newPassword = form.getValues("new_password");
                    if (value !== newPassword) {
                      return "Пароли не совпадают";
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
          is_loading={changePassword.isPending}
          is_valid={form.formState.isValid}
          handleClose={() => form.reset()}
          action="update"
        />
      </form>
    </div>
  );
};
