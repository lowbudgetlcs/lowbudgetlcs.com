export const getClientId = (): string => {
    // Get client ID from localStorage
  let clientId = localStorage.getItem("lblcsClientId");

  // Generate a new client ID if none exists
  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    localStorage.setItem("lblcsClientId", clientId);
  }

  return clientId;
};
