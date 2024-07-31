const Button = ({ children}: {children: string}) => {
    return (
<a href="#_" className="relative flex justify-center px-24 py-8 overflow-hidden group">
<span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-orange group-hover:w-full ease"></span>
<span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-orange group-hover:w-full ease"></span>
<span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 border-l-2  border-orange group-hover:h-full ease"></span>
<span className="absolute bottom-0 right-0 w-full h-0 transition-all duration-300 border-r-2 border-orange group-hover:h-full ease"></span>
<span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">{children}</span>
</a>
    );
  };
  
  export default Button;