const DraftLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: any;
}) => {
  const splitHost = window.location.host.split(".");
  const protocol = window.location.protocol;
  if (splitHost[0] !== "draft") {
    splitHost.unshift("draft");
  }
  const url = protocol + "//" + splitHost.join(".") + to;
  return (
    <a href={url} className={className}>
      {children}
    </a>
  );
};

export default DraftLink;
