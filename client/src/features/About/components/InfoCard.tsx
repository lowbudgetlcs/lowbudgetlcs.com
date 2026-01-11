import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Button from "../../../components/Button";

interface CardProps {
  link: string;
  title: string;
  text: string;
  btnText: string;
  image: string;
  reverse?: boolean;
  newTab?: boolean;
}

function InfoCard({ title, text, link, btnText, image, reverse = false, newTab = false }: CardProps) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`
        w-full max-w-4xl mx-auto
        flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}
        bg-bg rounded-xl overflow-hidden shadow-xl
        transform transition-all duration-700 ease-out
        ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
        border border-white/10
      `}
    >
      <div
        className="w-full md:w-2/5 h-64 md:h-auto bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      <div className="w-full md:w-3/5 p-8 flex flex-col justify-center gap-4 bg-bg">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          {title}
        </h2>
        
        <div className="w-20 h-1 bg-primary-light rounded-full" />
        
        <p className="text-gray-300 text-lg leading-relaxed">
          {text}
        </p>

        <div className="pt-4">
          <NavLink target={newTab ? '_blank' : '_self'} to={link} className="inline-block w-full md:w-auto">
            <Button className="w-full md:px-8 text-lg font-semibold tracking-wide">
              {btnText}
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
