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
  const { protocol, hostname, port } = window.location;

  const parts = hostname.split(".");
  // Determines how many parts make up the main domain.
  // This handles both 'localhost' (1 part) and standard domains like 'example.com' (2 parts).
  const mainDomainPartsCount = parts[parts.length - 1] === "localhost" ? 1 : 2;

  // Extracts the main domain by taking the last part of the hostname.
  const mainDomain = parts.slice(-mainDomainPartsCount).join(".");
  const portString = port ? `:${port}` : "";

  // Constructs the new URL.
  const url = `${protocol}//${mainDomain}${portString}${to}`;
  return (
    <a href={url} className={className} onClick={onClick}>
      {children}
    </a>
  );
};

export default MainLink;
