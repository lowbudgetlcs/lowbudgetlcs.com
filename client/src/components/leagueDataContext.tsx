import React, { createContext, useContext, ReactNode } from 'react';
import { useFetchData } from '../leagueData';
import { PlayerProps, TeamProps, DivisionProps } from './Roster';

interface LeagueDataContextType {
  players: PlayerProps[];
  teams: TeamProps[];
  divisions: DivisionProps[];
  error: string | null;
  loading: boolean;
}

const LeagueDataContext = createContext<LeagueDataContextType | undefined>(undefined);

export const LeagueDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { players, teams, divisions, error, loading } = useFetchData();

  return (
    <LeagueDataContext.Provider value={{ players, teams, divisions, error, loading }}>
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