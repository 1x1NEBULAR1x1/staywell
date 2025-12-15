"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/common";
import classes from "../../Form.module.scss";

export const Form = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const { register_mutation } = useAuth();
  const router = useRouter();
  const [form_data, setFormData] = useState<{
    password: string;
    confirm_password: string;
    terms_and_conditions: boolean;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    errors: { message: string; path: string }[];
  }>({
    email: "",
    password: "",
    confirm_password: "",
    terms_and_conditions: false,
    first_name: "",
    last_name: "",
    phone_number: "",
    errors: [],
  });

  const setFormValue = (
    path: keyof Omit<typeof form_data, "errors">,
    value: string | boolean,
  ) => {
    setFormData({
      ...form_data,
      [path]: value,
      errors: [...form_data.errors.filter((error) => error.path !== path)],
    });
  };

  const onSubmit = async () => {
    setFormData((prev) => ({ ...prev, errors: [] }));
    if (!form_data.terms_and_conditions) {
      setFormData((prev) => ({
        ...prev,
        errors: [
          ...prev.errors,
          {
            message: "You must agree to the terms and conditions",
            path: "terms_and_conditions",
          },
        ],
      }));
      return;
    }
    console.log(form_data);
    // TODO Fix P@SSword! validation
    // if (
    //   false &&
    //   !form_data.password.match(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   )
    // ) {
    //   setFormData((prev) => ({
    //     ...prev,
    //     password: "",
    //     errors: [
    //       ...prev.errors,
    //       {
    //         message:
    //           "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    //         path: "password",
    //       },
    //     ],
    //   }));
    // }
    if (form_data.password !== form_data.confirm_password) {
      setFormData((prev) => ({
        ...prev,
        errors: [
          ...prev.errors,
          { message: "Passwords do not match", path: "confirm_password" },
        ],
      }));
      return;
    }
    if (!form_data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormData((prev) => ({
        ...prev,
        email: "",
        errors: [
          ...prev.errors,
          { message: "Email must be a valid email address", path: "email" },
        ],
      }));
    }
    if (form_data.errors.length > 0) return;
    const result = await register_mutation.mutateAsync({
      email: form_data.email,
      password: form_data.password,
      first_name: form_data.first_name,
      last_name: form_data.last_name,
      phone_number: form_data.phone_number,
    });
    if (result.user) router.push("/");
  };

  return (
    <div className={classes.form}>
      {/* First Name */}
      <div className={classes.form_group}>
        <label htmlFor="first_name" className={classes.form_input_label}>
          First Name
        </label>

        <div className={classes.form_input_container}>
          <input
            name="first_name"
            type="text"
            className={classes.form_input}
            placeholder="First Name"
            onInput={(e) => setFormValue("first_name", e.currentTarget.value)}
          />
        </div>
        {form_data.errors
          .filter((error) => error.path === "first_name")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      {/* Last Name */}
      <div className={classes.form_group}>
        <label htmlFor="last_name" className={classes.form_input_label}>
          Last Name
        </label>

        <div className={classes.form_input_container}>
          <input
            name="last_name"
            type="text"
            className={classes.form_input}
            placeholder="Last Name"
            onInput={(e) => setFormValue("last_name", e.currentTarget.value)}
          />
        </div>
        {form_data.errors
          .filter((error) => error.path === "last_name")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      {/* Phone Number */}
      <div className={classes.form_group}>
        <label htmlFor="phone_number" className={classes.form_input_label}>
          Phone Number
        </label>

        <div className={classes.form_input_container}>
          <input
            name="phone_number"
            type="tel"
            className={classes.form_input}
            placeholder="Phone Number"
            onInput={(e) => setFormValue("phone_number", e.currentTarget.value)}
          />
        </div>
        {form_data.errors
          .filter((error) => error.path === "phone_number")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      {/* Email */}
      <div className={classes.form_group}>
        <label htmlFor="email" className={classes.form_input_label}>
          Email
        </label>

        <div className={classes.form_input_container}>
          <input
            name="email"
            type="email"
            className={classes.form_input}
            placeholder="Email"
            onInput={(e) => setFormValue("email", e.currentTarget.value)}
          />
        </div>
        {form_data.errors
          .filter((error) => error.path === "email")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      {/* Password */}
      <div className={classes.form_group}>
        <label htmlFor="password" className={classes.form_input_label}>
          Password
        </label>

        <div className={classes.form_input_container}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className={classes.form_input}
            placeholder="8+ characters"
            onInput={(e) => setFormValue("password", e.currentTarget.value)}
          />
          {!showPassword ? (
            <EyeOff
              onClick={toggleShowPassword}
              className={classes.form_show_password_icon}
            />
          ) : (
            <Eye
              onClick={toggleShowPassword}
              className={classes.form_show_password_icon}
            />
          )}
        </div>
        {form_data.errors
          .filter((error) => error.path === "password")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      {/* Confirm Password */}
      <div className={classes.form_group}>
        <label htmlFor="confirm_password" className={classes.form_input_label}>
          Confirm Password
        </label>

        <div className={classes.form_input_container}>
          <input
            name="confirm_password"
            type={showPassword ? "text" : "password"}
            className={classes.form_input}
            placeholder="Confirm Password"
            onInput={(e) =>
              setFormValue("confirm_password", e.currentTarget.value)
            }
          />
          {!showPassword ? (
            <EyeOff
              onClick={toggleShowPassword}
              className={classes.form_show_password_icon}
            />
          ) : (
            <Eye
              onClick={toggleShowPassword}
              className={classes.form_show_password_icon}
            />
          )}
        </div>
        {form_data.errors
          .filter((error) => error.path === "confirm_password")
          .map((error) => (
            <p key={error.path} className={classes.form_error}>
              {error.message}
            </p>
          ))}
      </div>

      <div className={classes.form_button_container}>
        <div className={classes.form_terms}>
          <input
            type="checkbox"
            name="terms_and_conditions"
            id="terms_and_conditions"
            checked={form_data.terms_and_conditions}
            className={classes.form_terms_checkbox}
            onChange={(e) =>
              setFormValue("terms_and_conditions", e.currentTarget.checked)
            }
          />
          <p>
            By signing up, you agree to our&nbsp;
            <Link href="/terms-conditions" className={classes.form_terms_link}>
              Terms & Conditions
            </Link>
            &nbsp;and&nbsp;
            <Link href="/privacy-policy" className={classes.form_terms_link}>
              Privacy Policy
            </Link>
            .
            {form_data.errors
              .filter((error) => error.path === "terms_and_conditions")
              .map((error) => (
                <p key={error.path} className={classes.form_error}>
                  {error.message}
                </p>
              ))}
          </p>
        </div>
        <button
          type="submit"
          className={classes.form_button}
          onClick={onSubmit}
        >
          Register
        </button>
        <Link href="/auth/login" className={classes.form_login_link}>
          Login
        </Link>
      </div>
    </div>
  );
};
