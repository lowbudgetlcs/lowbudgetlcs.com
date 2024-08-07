const Button = ({ children}: {children: string}) => {
    return (
<div className="relative bg-light-blue/20 flex justify-center px-8 py-2 overflow-hidden group rounded-md">
<span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-4 border-orange group-hover:w-full rounded-md ease"></span>
<span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-4 border-orange group-hover:w-full ease"></span>
<span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 border-l-4  border-orange group-hover:h-full ease"></span>
<span className="absolute bottom-0 right-0 w-full h-0 transition-all duration-300 border-r-4 border-orange group-hover:h-full ease"></span>
<span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">{children}</span>
</div>
    );
  };
  
  export default Button;