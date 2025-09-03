import React, { createContext, useContext, ReactNode } from 'react';
import { TeamProps, useFetchData } from '../leagueData';

interface LeagueDataContextType {
  divisions: string[];
  teams: TeamProps[];
  error: string | null;
  loading: boolean;
}

const LeagueDataContext = createContext<LeagueDataContextType | undefined>(undefined);

export const LeagueDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { divisions, teams, error, loading } = useFetchData();

  return (
    <LeagueDataContext.Provider value={{ divisions, teams, error, loading }}>
      {children}
    </LeagueDataContext.Provider>
  );
};

export const useLeagueData = () => {
  const context = useContext(LeagueDataContext);
  if (context === undefined) {
    throw new Error('useLeagueData must be used within a LeagueDataProvider bozo');
  }
  return context;
};