import type { FC } from 'react';

interface ToastIconProps {
  type: 'success' | 'error' | 'warning' | 'info';
}

export const ToastIcon: FC<ToastIconProps> = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.2679 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 15H12.01M8.2 21H15.8C17.9201 21 18.9801 21 19.638 20.673C20.2183 20.3854 20.6854 19.9183 20.973 19.338C21.3 18.6801 21.3 17.6201 21.3 15.5V8.5C21.3 6.37992 21.3 5.31992 20.973 4.66202C20.6854 4.08169 20.2183 3.61457 19.638 3.32698C18.9801 3 17.9201 3 15.8 3H8.2C6.07992 3 5.01992 3 4.36202 3.32698C3.78169 3.61457 3.31457 4.08169 3.02698 4.66202C2.7 5.31992 2.7 6.37992 2.7 8.5V15.5C2.7 17.6201 2.7 18.6801 3.02698 19.338C3.31457 19.9183 3.78169 20.3854 4.36202 20.673C5.01992 21 6.07992 21 8.2 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'info':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};