import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Button from "./Button";

interface CardProps {
  link: string;
  title: string;
  text: string;
  btnText: string;
  image: string;
  reverse: boolean;
}

function HomeCard({ title, text, link, btnText, image, reverse }: CardProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  if (!reverse)
    return (
      <div
        ref={ref}
        className={`card ${
          inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        } transition duration-700 flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40`}
      >
        <div
          className={`w-full h-96 bg-cover bg-center text-center bg-[url('${image}')] border-b-orange border-b-4 md:border-r-orange md:border-r-4`}
        ></div>
        <div className=" w-full md:w-1/2 p-2 md:p-4">
          <h2 className="text-xl text-white text-center font-semibold p-2">
            {title}
          </h2>
          <p className="py-2 text-sm md:text-md">{text}</p>
          <div className="font-semibold">
            <NavLink to={link}>
              <Button>{btnText}</Button>
            </NavLink>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div
        ref={ref}
        className={`card ${
          inView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        } transition duration-700 flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40`}
      >
        <div className=" w-full md:w-1/2 p-2 md:p-4">
          <h2 className="text-xl text-white text-center font-semibold p-2">
            {title}
          </h2>
          <p className="py-2 text-sm md:text-md">
           {text}
          </p>
          <div className="font-semibold mt-4">
            <NavLink target="_blank" to={link}>
              <Button>{btnText}</Button>
            </NavLink>
          </div>
        </div>
        <div className={`w-full h-96 bg-cover bg-center text-center bg-[url('${image}')] border-t-orange border-t-4 md:border-l-orange md:border-l-4`}></div>
      </div>
    );
}

export default HomeCard;
