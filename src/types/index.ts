
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  calendly: string;
  assignedTo: string;
  assignedAt: Date;
  slaDeadline: Date;
  status: CandidateStatus;
  followUpCount: number;
  lastUpdated: Date | null;
  scheduledAt: Date | null;
}

export type CandidateStatus = 
  | 'pending'
  | 'follow-up-1'
  | 'follow-up-2'
  | 'scheduled'
  | 'escalated';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'intern';
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SLAStats {
  total: number;
  scheduled: number;
  missed: number;
  onTrack: number;
  atRisk: number;
  breached: number;
}
