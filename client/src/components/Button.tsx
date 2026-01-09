const Button = ({ children}: {children: any}) => {
    return (
<div className="relative bg-bg ring-2 ring-primary-light flex justify-center px-8 py-2 overflow-hidden group hover:bg-primary-dark transition duration-300 rounded-md">
<span className="relative transition-colors duration-300 text-primary-light group-hover:text-white ease">{children}</span>
</div>
    );
  };
  
  export default Button;