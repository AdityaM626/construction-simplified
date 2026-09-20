import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project } from '../types';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  projects: Project[];
  refreshProjects: () => Promise<void>;
}

const defaultProjects: Project[] = [
  {
    id: 'prj-101',
    homeownerId: 'usr-homeowner-1',
    homeownerName: 'Rajesh Kumar',
    builderId: 'usr-builder-1',
    builderName: 'Apex Infrastructure & Builders',
    name: 'Sharma Residence / Kumar Villa (4BHK)',
    type: 'NEW_CONSTRUCTION',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    builtUpAreaSqFt: 2750,
    floorsCount: 2,
    contractValue: 4500000,
    totalBudget: 4500000,
    spentCost: 1820000,
    committedCost: 850000,
    paidAmount: 1820000,
    startDate: '2026-02-01',
    targetCompletionDate: '2027-03-31',
    status: 'IN_PROGRESS',
    projectHealth: 'HEALTHY',
    healthReason: 'Project execution on schedule with minor 2.1% material rate variance',
    currentPhase: 'Ground & First Floor Superstructure',
    completionPercentage: 46,
    createdAt: '2026-02-01T09:00:00.000Z'
  },
  {
    id: 'prj-102',
    homeownerId: 'usr-homeowner-2',
    homeownerName: 'Anil Mehta',
    builderId: 'usr-builder-1',
    builderName: 'Apex Infrastructure & Builders',
    name: 'Mehta Modern Penthouse Renovation',
    type: 'RENOVATION',
    location: 'Indiranagar 100ft Road, Bengaluru',
    builtUpAreaSqFt: 1850,
    floorsCount: 1,
    contractValue: 2200000,
    totalBudget: 2200000,
    spentCost: 950000,
    committedCost: 400000,
    paidAmount: 950000,
    startDate: '2026-04-01',
    targetCompletionDate: '2026-11-30',
    status: 'IN_PROGRESS',
    projectHealth: 'HEALTHY',
    healthReason: 'Interior partition and plumbing rough-in completed',
    currentPhase: 'Electrical & Plumbing Layout',
    completionPercentage: 35,
    createdAt: '2026-04-01T10:00:00.000Z'
  }
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeProjectId, setActiveProjectId] = useState<string>('prj-101');
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  const refreshProjects = async () => {
    try {
      const sharedProjects = await api.getProjects() as Project[];
      setProjects(sharedProjects);
      if (sharedProjects.length && !sharedProjects.some(project => project.id === activeProjectId)) {
        setActiveProjectId(sharedProjects[0].id);
      }
    } catch {
      // The API may not be running during UI-only development; retain seed data.
    }
  };

  useEffect(() => { void refreshProjects(); }, [currentUser.id]);

  return (
    <ProjectContext.Provider value={{ activeProjectId, setActiveProjectId, projects, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
