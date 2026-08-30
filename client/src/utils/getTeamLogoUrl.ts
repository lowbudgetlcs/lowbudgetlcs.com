const teamLogoProxyPath = "/images/api/team-logo/";

const getTeamLogoUrl = (logo: string) => {
  if (!logo.startsWith(teamLogoProxyPath)) {
    return logo;
  }

  return `${import.meta.env.VITE_BACKEND_URL}${logo}`;
};

export default getTeamLogoUrl;