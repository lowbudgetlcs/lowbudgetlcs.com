import { ButtonHTMLAttributes, ReactNode } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const AltButton = ({ children, className = "", ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={`relative bg-bg/10 border border-primary-light cursor-pointer flex justify-center px-8 py-2 overflow-hidden group hover:bg-primary-dark transition duration-300 rounded-md ${className}`}>
      <span className="relative transition-colors duration-300 text-primary-light group-hover:text-white ease font-bold">{children}</span>
    </button>
  );
};
export default AltButton;
