
import { Candidate } from "@/types";

export const getSLAStatus = (candidate: Candidate): 'ok' | 'warning' | 'danger' => {
  if (!candidate.slaDeadline) return 'ok';
  
  const now = new Date();
  const deadline = new Date(candidate.slaDeadline);
  const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursLeft < 6) return 'danger';
  if (hoursLeft < 12) return 'warning';
  return 'ok';
};

export const getSLATimeRemaining = (candidate: Candidate): string => {
  const now = new Date();
  const deadline = new Date(candidate.slaDeadline);
  const hoursLeft = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(((deadline.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hoursLeft < 0 || (hoursLeft === 0 && minutesLeft < 0)) {
    return "SLA Breached";
  }
  
  return `${hoursLeft}h ${minutesLeft}m left`;
};

export const calculateSLAPercentage = (candidates: Candidate[]): number => {
  if (candidates.length === 0) return 100;
  
  const scheduled = candidates.filter(c => c.status === 'scheduled').length;
  return Math.round((scheduled / candidates.length) * 100);
};

export const calculateSLAStats = (candidates: Candidate[]): { scheduled: number; total: number; percentage: number } => {
  const total = candidates.length;
  const scheduled = candidates.filter(c => c.status === 'scheduled').length;
  const percentage = total > 0 ? Math.round((scheduled / total) * 100) : 0;
  
  return { scheduled, total, percentage };
};

export const generateSLAReport = (candidates: Candidate[]): { 
  total: number;
  scheduled: number; 
  pending: number;
  onTrack: number;
  atRisk: number;
  breached: number;
} => {
  const total = candidates.length;
  const scheduled = candidates.filter(c => c.status === 'scheduled').length;
  const pending = candidates.filter(c => c.status !== 'scheduled').length;
  
  let onTrack = 0;
  let atRisk = 0;
  let breached = 0;
  
  candidates.forEach(candidate => {
    const status = getSLAStatus(candidate);
    if (candidate.status !== 'scheduled') {
      if (status === 'ok') onTrack++;
      else if (status === 'warning') atRisk++;
      else breached++;
    }
  });
  
  return {
    total,
    scheduled,
    pending,
    onTrack,
    atRisk,
    breached
  };
};
