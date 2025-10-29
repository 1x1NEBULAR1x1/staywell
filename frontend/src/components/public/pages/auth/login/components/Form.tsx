'use client'
import { useAuth } from '@/hooks/common';
import classes from './Form.module.scss';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';


export const Form = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const toggleShowPassword = () => setShowPassword(!showPassword)
  const { login } = useAuth()

  const [form_data, setFormData] = useState<{ password: string, email: string, errors: { message: string, path: string }[] }>({ email: '', password: '', errors: [] })

  const setFormValue = (path: keyof Omit<typeof form_data, 'errors'>, value: string) => {
    setFormData({
      ...form_data,
      [path]: value,
      errors: [...form_data.errors.filter((error) => error.path !== path)]
    })
  }

  const onSubmit = () => {
    setFormData((prev) => ({ ...prev, errors: [] }))
    console.log(form_data)
    if (false && !form_data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      setFormData((prev) => ({ ...prev, password: '', errors: [...prev.errors, { message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character', path: 'password' }] }))
    }
    if (!form_data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormData((prev) => ({ ...prev, email: '', errors: [...prev.errors, { message: 'Email must be a valid email address', path: 'email' }] }))
    }
    if (form_data.errors.length > 0) {
      return
    }
    login({ email: form_data.email, password: form_data.password })
  };

  return (
    <div className={classes.form}>
      <div className={classes.form_group}>
        <label htmlFor='email' className={classes.form_input_label}>Username</label>

        <div className={classes.form_input_container}>
          <input
            name='email'
            type='email'
            className={classes.form_input}
            placeholder='Email'
            onInput={(e) => setFormValue('email', e.currentTarget.value)}
          />
        </div>
        {form_data.errors.filter(error => error.path === 'email').map((error) => (
          <p key={error.path} className={classes.form_error}>{error.message}</p>
        ))}
      </div>

      <div className={classes.form_group} >
        <label htmlFor='password' className={classes.form_input_label}>Password</label>

        <div className={classes.form_input_container}>
          <input
            name='password'
            type={showPassword ? 'text' : 'password'}
            className={classes.form_input}
            placeholder='8+ characters'
            onInput={(e) => setFormValue('password', e.currentTarget.value)}
          />
          {!showPassword
            ? <EyeOff onClick={toggleShowPassword} className={classes.form_show_password_icon} />
            : <Eye onClick={toggleShowPassword} className={classes.form_show_password_icon} />
          }
        </div>
        {form_data.errors.filter(error => error.path === 'password').map((error) => (
          <p key={error.path} className={classes.form_error}>{error.message}</p>
        ))}
      </div>
      <div className={classes.form_button_container}>
        <p className={classes.form_terms}>
          By signing up, you agree to our&nbsp;
          <a href='/terms-conditions' className={classes.form_terms_link}>Terms & Conditions</a>
          &nbsp;and&nbsp;
          <a href='/privacy-policy' className={classes.form_terms_link}>Privacy Policy</a>
          .
        </p>
        <button type='submit' className={classes.form_button} onClick={onSubmit}>Login</button>
      </div>
      <a href='/auth/register' className={classes.form_register_link}>Create an account</a>
    </div>
  )
};