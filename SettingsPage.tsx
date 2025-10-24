
import React, { useState, useEffect } from 'react';
import { Person, Team, PersonRole, User, UserRole, Season } from './types';
import ShieldCheckIcon from './components/icons/ShieldCheckIcon';
import UserGroupIcon from './components/icons/UserGroupIcon';
import TrashIcon from './components/icons/TrashIcon';

interface SettingsPageProps {
  seasons: Season[];
  activeSeasonId: string | null;
  onSetActiveSeason: (seasonId: string) => void;
  onAddSeason: (name: string) => void;
  onUpdateSeason: (seasonId: string, newName: string) => void;
  onDeleteSeason: (seasonId: string) => void;
  onAddTeam: (seasonId: string, name: string) => void;
  onDeleteTeam: (seasonId: string, teamId: string) => void;
  onAddPerson: (seasonId: string, teamId: string, person: Omit<Person, 'id'>) => void;
  onDeletePerson: (seasonId: string, teamId: string, personId: string) => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  isAdmin: boolean;
}

const UserForm: React.FC<{ user?: User | null; onSubmit: (userData: any) => void; onCancel: () => void; }> = ({ user, onSubmit, onCancel }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user?.role || UserRole.Coach);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || (!user && !password.trim())) return;
        onSubmit({ id: user?.id, username, password, role });
    }
    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mt-4 space-y-3 border border-gray-200">
            <h4 className="font-semibold text-gray-800">{user ? 'Editar' : 'Afegir'} Usuari</h4>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'usuari" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={user ? 'Nova contrasenya (opcional)' : 'Contrasenya'} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required={!user} />
            <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md">
                <option value={UserRole.Coach}>Coach</option>
                <option value={UserRole.Admin}>Admin</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">Cancel·lar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">{user ? 'Guardar' : 'Afegir'}</button>
            </div>
        </form>
    );
};

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const { seasons, activeSeasonId, onSetActiveSeason, onAddSeason, onUpdateSeason, onDeleteSeason, onAddTeam, onDeleteTeam, onAddPerson, onDeletePerson, users, onAddUser, onUpdateUser, onDeleteUser, isAdmin } = props;
  const [activeTab, setActiveTab] = useState<'teams' | 'users'>('teams');
  
  // State for managing which season is being viewed/edited in the settings UI
  const [viewingSeasonId, setViewingSeasonId] = useState<string | null>(activeSeasonId);
  const viewingSeason = seasons.find(s => s.id === viewingSeasonId);

  useEffect(() => {
    // If the viewing season gets deleted, or on initial load, default to active season or first season
    if (!seasons.some(s => s.id === viewingSeasonId)) {
        setViewingSeasonId(activeSeasonId ?? (seasons.length > 0 ? seasons[0].id : null));
    }
  }, [seasons, activeSeasonId, viewingSeasonId]);

  // Forms state
  const [isAddingSeason, setIsAddingSeason] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [editingSeason, setEditingSeason] = useState<{id: string, name: string} | null>(null);
  
  const [addingTeamToSeason, setAddingTeamToSeason] = useState<string|null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  
  const [addingPersonTo, setAddingPersonTo] = useState<{seasonId: string, teamId: string}|null>(null);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState<PersonRole>(PersonRole.Player);
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);

  // --- Handlers ---
  const handleAddSeason = () => { if(newSeasonName.trim()) { onAddSeason(newSeasonName); setNewSeasonName(""); setIsAddingSeason(false); }};
  const handleEditSeason = () => { if(editingSeason && editingSeason.name.trim()) { onUpdateSeason(editingSeason.id, editingSeason.name); setEditingSeason(null); }};
  const handleDeleteSeasonClick = (seasonId: string, seasonName: string) => {
      if (window.confirm(`Estàs segur que vols eliminar la temporada "${seasonName}"? S'esborraran tots els equips, jugadors i registres d'assistència associats.`)) {
          onDeleteSeason(seasonId);
      }
  };

  const handleAddTeam = () => { if(newTeamName.trim() && addingTeamToSeason) { onAddTeam(addingTeamToSeason, newTeamName); setNewTeamName(""); setAddingTeamToSeason(null); }};
  const handleDeleteTeamClick = (seasonId: string, teamId: string, teamName: string) => {
    if (window.confirm(`Vols eliminar l'equip "${teamName}" i tots els seus membres?`)) {
      onDeleteTeam(seasonId, teamId);
    }
  };

  const handleAddPerson = () => { if(newPersonName.trim() && addingPersonTo) { onAddPerson(addingPersonTo.seasonId, addingPersonTo.teamId, {name: newPersonName, role: newPersonRole}); setNewPersonName(""); setAddingPersonTo(null); }};
  const handleDeletePersonClick = (seasonId: string, teamId: string, personId: string, personName: string) => {
    if (window.confirm(`Vols eliminar a ${personName}?`)) {
      onDeletePerson(seasonId, teamId, personId);
    }
  };

  const handleDeleteUserClick = (userId: string, username: string) => {
      if (window.confirm(`Vols eliminar l'usuari "${username}"?`)) {
          onDeleteUser(userId);
      }
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-2 rounded-lg shadow-md flex justify-center gap-2">
          <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}><ShieldCheckIcon className="w-5 h-5" /> Temporades i Equips</button>
          {isAdmin && <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}><UserGroupIcon className="w-5 h-5" /> Usuaris</button>}
       </div>

       {activeTab === 'teams' && (
         <div className="space-y-6">
           <div className="bg-white p-4 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">Gestionar Temporades</h2>
                <button onClick={() => setIsAddingSeason(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">Nova Temporada</button>
             </div>
             {isAddingSeason && (
                 <div className="flex gap-2 mt-4">
                     <input type="text" value={newSeasonName} onChange={e => setNewSeasonName(e.target.value)} placeholder="Ex: Temporada 2024-2025" className="flex-grow px-3 py-2 border border-gray-300 rounded-md" autoFocus />
                     <button onClick={handleAddSeason} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">Guardar</button>
                     <button onClick={() => setIsAddingSeason(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm">Cancel·lar</button>
                 </div>
             )}
            <ul className="mt-4 space-y-2">
                {seasons.map(season => (
                    <li key={season.id} className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        {editingSeason?.id === season.id ? (
                            <div className="flex-grow flex gap-2 items-center">
                                <input type="text" value={editingSeason.name} onChange={e => setEditingSeason({...editingSeason, name: e.target.value})} className="flex-grow px-3 py-2 border border-gray-300 rounded-md" autoFocus/>
                                <button onClick={handleEditSeason} className="px-3 py-1 bg-green-500 text-white rounded-md text-xs">OK</button>
                                <button onClick={() => setEditingSeason(null)} className="px-3 py-1 bg-gray-200 rounded-md text-xs">X</button>
                            </div>
                        ) : (
                            <span className="font-semibold text-gray-700 cursor-pointer" onClick={() => setEditingSeason({id: season.id, name: season.name})}>{season.name}</span>
                        )}
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {season.id === activeSeasonId && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">ACTIVA</span>}
                            <button onClick={() => onSetActiveSeason(season.id)} disabled={season.id === activeSeasonId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">Establir com a activa</button>
                            <button onClick={() => setViewingSeasonId(season.id)} className={`px-3 py-1 rounded-md text-xs ${viewingSeasonId === season.id ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Gestionar</button>
                            <button onClick={() => handleDeleteSeasonClick(season.id, season.name)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </li>
                ))}
            </ul>
           </div>
            {viewingSeason ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Equips de: {viewingSeason.name}</h3>
                    {viewingSeason.teams.map(team => (
                        <div key={team.id} className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l-2 my-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold text-gray-700">{team.name}</h4>
                                <div className="flex gap-2">
                                <button onClick={() => setAddingPersonTo({seasonId: viewingSeason.id, teamId: team.id})} className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs">Afegir Membre</button>
                                <button onClick={() => handleDeleteTeamClick(viewingSeason.id, team.id, team.name)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                            {addingPersonTo?.teamId === team.id && (
                                <div className="flex gap-2 items-center my-2 p-2 bg-gray-50 rounded">
                                    <input type="text" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} placeholder="Nom del membre" className="flex-grow px-2 py-1 border rounded-md text-sm" autoFocus/>
                                    <select value={newPersonRole} onChange={e => setNewPersonRole(e.target.value as PersonRole)} className="px-2 py-1 border bg-white rounded-md text-sm"><option value={PersonRole.Player}>Jugador</option><option value={PersonRole.Coach}>Entrenador</option></select>
                                    <button onClick={handleAddPerson} className="px-3 py-1 bg-green-500 text-white rounded-md text-xs">OK</button>
                                    <button onClick={() => setAddingPersonTo(null)} className="px-3 py-1 bg-gray-200 rounded-md text-xs">X</button>
                                </div>
                            )}
                            {team.people.map(person => (
                                <div key={person.id} className="flex justify-between items-center py-1 ml-4">
                                    <p className="text-sm text-gray-600">{person.name} <span className="text-xs text-gray-400">({person.role})</span></p>
                                    <button onClick={() => handleDeletePersonClick(viewingSeason.id, team.id, person.id, person.name)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>
                    ))}
                    {addingTeamToSeason === viewingSeason.id ? (
                        <div className="flex gap-2 mt-4 ml-4">
                            <input type="text" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Nom del nou equip" className="flex-grow px-3 py-2 border border-gray-300 rounded-md" autoFocus/>
                            <button onClick={handleAddTeam} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">Guardar</button>
                            <button onClick={() => setAddingTeamToSeason(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm">Cancel·lar</button>
                        </div>
                    ) : <button onClick={() => setAddingTeamToSeason(viewingSeason.id)} className="mt-4 ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">Afegir Equip</button>}
                </div>
            ) : <p className="text-center text-gray-500 py-4">Selecciona una temporada per gestionar els seus equips.</p>}
         </div>
       )}

       {activeTab === 'users' && isAdmin && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Gestionar Usuaris</h3>
                    <button onClick={() => { setEditingUserId(null); setIsAddingUser(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">Afegir Usuari</button>
                </div>
                {isAddingUser && <UserForm onSubmit={(d) => { onAddUser(d); setIsAddingUser(false); }} onCancel={() => setIsAddingUser(false)} />}
                 <div className="divide-y divide-gray-200">
                    {users.map(user => (
                        <div key={user.id}>
                            {editingUserId === user.id ? (
                                <UserForm user={user} onSubmit={(d) => { onUpdateUser(d); setEditingUserId(null); }} onCancel={() => setEditingUserId(null)} />
                            ) : (
                                <div className="py-3 flex justify-between items-center">
                                    <div><p className="font-medium text-gray-800">{user.username}</p><p className="text-sm text-gray-500 capitalize">{user.role}</p></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setIsAddingUser(false); setEditingUserId(user.id); }} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm">Editar</button>
                                        <button onClick={() => handleDeleteUserClick(user.id, user.username)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Eliminar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
       )}
    </div>
  );
};

export default SettingsPage;
