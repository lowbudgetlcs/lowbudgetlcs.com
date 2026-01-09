import { ButtonHTMLAttributes, ReactNode } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button = ({ children, className = "", ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={`${className} relative bg-bg-light border border-border hover:border-primary-light flex justify-center px-6 py-2 overflow-hidden group hover:bg-primary-dark cursor-pointer transition duration-300 rounded-md text-text-primary `}>
      {children}
    </button>
  );
};

export default Button;
