const MainLink = ({
  to,
  className,
  children,
  onClick,
}: {
  to: string;
  className?: string;
  children: any;
  onClick?: () => void;
}) => {
  const splitHost = window.location.host.split(".");
  const protocol = window.location.protocol;
  if (splitHost[0] === "draft") {
    splitHost.shift();
  }
  const url = protocol + "//" + splitHost.join(".") + to;
  return (
    <a href={url} className={className} onClick={onClick}>
      {children}
    </a>
  );
};

export default MainLink;
