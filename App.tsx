import React, { useState, useEffect } from 'react';
import {
  Season,
  AttendanceRecord,
  User,
  Page,
  Person,
  PersonRole,
  UserRole,
  Team,
} from './types';
import {
  loadSeasons,
  saveSeasons,
  loadAttendance,
  saveAttendance,
  loadUsers,
  saveUsers,
  loadActiveSeasonId,
  saveActiveSeasonId,
} from './services/apiService';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AttendancePage from './components/AttendancePage';
import StatisticsPage from './components/StatisticsPage';
import SettingsPage from './components/SettingsPage';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data state
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [users, setUsers] = useState<User[]>([]);
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);

  // UI state
  const [currentPage, setCurrentPage] = useState<Page>('attendance');

  // Load data from storage on initial render
  useEffect(() => {
    const loadedSeasons = loadSeasons();
    const loadedAttendance = loadAttendance();
    const loadedUsers = loadUsers();
    
    setSeasons(loadedSeasons);
    setAttendance(loadedAttendance);
    setUsers(loadedUsers);

    let loadedActiveSeasonId = loadActiveSeasonId();
    if (!loadedActiveSeasonId && loadedSeasons.length > 0) {
      loadedActiveSeasonId = loadedSeasons[0].id;
    }
    setActiveSeasonId(loadedActiveSeasonId);

  }, []);

  // Persist data to storage when it changes
  useEffect(() => { saveSeasons(seasons); }, [seasons]);
  useEffect(() => { saveAttendance(attendance); }, [attendance]);
  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveActiveSeasonId(activeSeasonId); }, [activeSeasonId]);

  // --- Authentication Handlers ---
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- Attendance Handlers ---
  const handleSetAttendanceForDate = (date: string, personId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [personId]: status,
      }
    }));
  };
  
  // --- Settings Handlers ---

  // Seasons
  const handleAddSeason = (name: string) => {
    const newSeason: Season = { id: `season-${Date.now()}`, name, teams: [] };
    const newSeasons = [...seasons, newSeason];
    setSeasons(newSeasons);
    if (!activeSeasonId) {
        setActiveSeasonId(newSeason.id);
    }
  };

  const handleUpdateSeason = (seasonId: string, newName: string) => {
    setSeasons(seasons.map(s => s.id === seasonId ? { ...s, name: newName } : s));
  };
  
  const handleDeleteSeason = (seasonId: string) => {
      const newSeasons = seasons.filter(s => s.id !== seasonId);
      setSeasons(newSeasons);
      if (activeSeasonId === seasonId) {
          setActiveSeasonId(newSeasons.length > 0 ? newSeasons[0].id : null);
      }
  };
  
  // Teams
  const handleAddTeam = (seasonId: string, name: string) => {
      const newTeam: Team = { id: `team-${Date.now()}`, name, people: [] };
      setSeasons(seasons.map(s => s.id === seasonId ? { ...s, teams: [...s.teams, newTeam] } : s));
  };

  const handleDeleteTeam = (seasonId: string, teamId: string) => {
      setSeasons(seasons.map(s => s.id === seasonId ? { ...s, teams: s.teams.filter(t => t.id !== teamId) } : s));
  };

  // People
  const handleAddPerson = (seasonId: string, teamId: string, personData: Omit<Person, 'id'>) => {
      const newPerson: Person = { ...personData, id: `person-${Date.now()}`};
      setSeasons(seasons.map(s => {
          if (s.id !== seasonId) return s;
          return { ...s, teams: s.teams.map(t => {
              if (t.id !== teamId) return t;
              return { ...t, people: [...t.people, newPerson] };
          })};
      }));
  };
  
  const handleDeletePerson = (seasonId: string, teamId: string, personId: string) => {
      setSeasons(seasons.map(s => {
        if (s.id !== seasonId) return s;
        return { ...s, teams: s.teams.map(t => {
            if (t.id !== teamId) return t;
            return { ...t, people: t.people.filter(p => p.id !== personId) };
        })};
    }));
  };

  // Users
  const handleAddUser = (userData: Omit<User, 'id'>) => {
      const newUser: User = { ...userData, id: `user-${Date.now()}`};
      setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUsers(users.map(u => u.id === updatedUser.id ? {...u, ...updatedUser, password: updatedUser.password || u.password} : u));
  };

  const handleDeleteUser = (userId: string) => {
      setUsers(users.filter(u => u.id !== userId));
  };


  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeSeason = seasons.find(s => s.id === activeSeasonId);
  const isAdmin = currentUser.role === UserRole.Admin;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'attendance':
        return <AttendancePage 
                    seasons={seasons} 
                    activeSeasonId={activeSeasonId}
                    onSetActiveSeason={setActiveSeasonId}
                    attendance={attendance} 
                    onSetAttendanceForDate={handleSetAttendanceForDate}
                />;
      case 'statistics':
        return <StatisticsPage 
                    seasons={seasons} 
                    activeSeasonId={activeSeasonId}
                    onSetActiveSeason={setActiveSeasonId}
                    attendance={attendance}
                />;
      case 'settings':
        return <SettingsPage 
                    seasons={seasons}
                    activeSeasonId={activeSeasonId}
                    onSetActiveSeason={setActiveSeasonId}
                    onAddSeason={handleAddSeason}
                    onUpdateSeason={handleUpdateSeason}
                    onDeleteSeason={handleDeleteSeason}
                    onAddTeam={handleAddTeam}
                    onDeleteTeam={handleDeleteTeam}
                    onAddPerson={handleAddPerson}
                    onDeletePerson={handleDeletePerson}
                    users={users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    isAdmin={isAdmin}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
        activeSeasonName={activeSeason?.name}
      />
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <Navigation 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
        />
        {renderCurrentPage()}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
