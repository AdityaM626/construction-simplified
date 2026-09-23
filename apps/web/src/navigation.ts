import type { UserRole } from './types';

export type NavigationIcon =
  | 'overview' | 'actions' | 'timeline' | 'site' | 'quality'
  | 'money' | 'changes' | 'documents' | 'handover' | 'home'
  | 'boq' | 'procurement' | 'team' | 'analytics' | 'verification';

export interface NavigationItem {
  id: string;
  label: string;
  icon: NavigationIcon;
  mobile?: boolean;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

const homeowner: NavigationGroup[] = [
  { label: 'Overview', items: [
    { id: 'dashboard', label: 'Project overview', icon: 'overview', mobile: true },
    { id: 'action-center', label: 'Needs my decision', icon: 'actions', mobile: true },
  ] },
  { label: 'Project', items: [
    { id: 'progress-timeline', label: 'Timeline', icon: 'timeline', mobile: true },
    { id: 'journal', label: 'Site updates', icon: 'site' },
    { id: 'issues', label: 'Quality & defects', icon: 'quality' },
  ] },
  { label: 'Money', items: [
    { id: 'financials', label: 'Budget', icon: 'money', mobile: true },
    { id: 'change-orders', label: 'Change orders', icon: 'changes' },
  ] },
  { label: 'Records', items: [
    { id: 'documents', label: 'Documents', icon: 'documents' },
    { id: 'handover', label: 'Handover', icon: 'handover' },
    { id: 'home-passport', label: 'Home passport', icon: 'home' },
  ] },
];

const builder: NavigationGroup[] = [
  { label: 'Overview', items: [
    { id: 'projects', label: 'Projects', icon: 'overview', mobile: true },
    { id: 'action-center', label: 'Pending actions', icon: 'actions', mobile: true },
  ] },
  { label: 'Execution', items: [
    { id: 'journal', label: 'Site reports', icon: 'site', mobile: true },
    { id: 'team-roster', label: 'Team', icon: 'team' },
    { id: 'issues', label: 'Quality', icon: 'quality' },
  ] },
  { label: 'Commercial', items: [
    { id: 'boq-estimation', label: 'BOQ & estimates', icon: 'boq', mobile: true },
    { id: 'budget-vs-actual', label: 'Budget vs actual', icon: 'money' },
    { id: 'procurement', label: 'Material requests', icon: 'procurement' },
  ] },
];

const admin: NavigationGroup[] = [
  { label: 'Platform', items: [
    { id: 'verifications', label: 'Verification queue', icon: 'verification', mobile: true },
    { id: 'analytics', label: 'Analytics', icon: 'analytics', mobile: true },
  ] },
];

export function navigationFor(role: UserRole): NavigationGroup[] {
  if (role === 'HOMEOWNER') return homeowner;
  if (role === 'BUILDER') return builder;
  if (role === 'ADMIN') return admin;
  return []; // Legacy DEALER has no production workspace.
}
