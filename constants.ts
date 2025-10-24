import { Season, PersonRole, User, UserRole } from './types';

export const INITIAL_SEASONS: Season[] = [
  {
    id: 'season-2023-2024',
    name: 'Temporada 2023-2024',
    teams: [
      { 
        id: 's2324-u11', 
        name: 'Mini M U11', 
        people: [
          { id: 'p-u11-c1', name: 'Coach Alex', role: PersonRole.Coach },
          { id: 'p-u11-p1', name: 'Pau López', role: PersonRole.Player },
          { id: 'p-u11-p2', name: 'Marc Soler', role: PersonRole.Player },
          { id: 'p-u11-p3', name: 'Jordi Puig', role: PersonRole.Player },
          { id: 'p-u11-p4', name: 'Leo Vidal', role: PersonRole.Player },
          { id: 'p-u11-p5', name: 'Biel Roca', role: PersonRole.Player },
        ]
      },
      { 
        id: 's2324-u12', 
        name: 'Mini M U12',
        people: [
          { id: 'p-u12-c1', name: 'Coach Sara', role: PersonRole.Coach },
          { id: 'p-u12-p1', name: 'Nil Garcia', role: PersonRole.Player },
          { id: 'p-u12-p2', name: 'Adrià Font', role: PersonRole.Player },
          { id: 'p-u12-p3', name: 'Sergi Martí', role: PersonRole.Player },
          { id: 'p-u12-p4', name: 'Hugo Costa', role: PersonRole.Player },
          { id: 'p-u12-p5', name: 'Izan Romero', role: PersonRole.Player },
        ]
      },
      { 
        id: 's2324-u16', 
        name: 'Cadet F U16',
        people: [
          { id: 'p-u16-c1', name: 'Coach Laura', role: PersonRole.Coach },
          { id: 'p-u16-p1', name: 'Aina Pérez', role: PersonRole.Player },
          { id: 'p-u16-p2', name: 'Martina Ruiz', role: PersonRole.Player },
          { id: 'p-u16-p3', name: 'Carla Giménez', role: PersonRole.Player },
          { id: 'p-u16-p4', name: 'Júlia Moreno', role: PersonRole.Player },
          { id: 'p-u16-p5', name: 'Ona Castillo', role: PersonRole.Player },
        ]
      },
      { 
        id: 's2324-u25', 
        name: 'U25 F',
        people: [
          { id: 'p-u25-c1', name: 'Coach David', role: PersonRole.Coach },
          { id: 'p-u25-p1', name: 'Sofia Navarro', role: PersonRole.Player },
          { id: 'p-u25-p2', name: 'Paula Ramos', role: PersonRole.Player },
          { id: 'p-u25-p3', name: 'Elena Torres', role: PersonRole.Player },
          { id: 'p-u25-p4', name: 'Lucía Sanz', role: PersonRole.Player },
          { id: 'p-u25-p5', name: 'Marta Vicente', role: PersonRole.Player },
        ]
      },
    ]
  }
];

export const INITIAL_USERS: User[] = [
  { id: 'user-admin', username: 'admin', password: 'password', role: UserRole.Admin },
  { id: 'user-coach', username: 'coach', password: 'password', role: UserRole.Coach },
];
