
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate, CandidateStatus, SLAStats, User } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { generateSLAReport, getSLAStatus } from '@/utils/slaHelpers';

interface CandidateContextType {
  candidates: Candidate[];
  addCandidates: (newCandidates: Candidate[]) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  filterCandidatesByUser: (user: User | null) => Candidate[];
  slaStats: SLAStats;
}

const CandidateContext = createContext<CandidateContextType>({
  candidates: [],
  addCandidates: () => {},
  updateCandidateStatus: () => {},
  filterCandidatesByUser: () => [],
  slaStats: { total: 0, scheduled: 0, missed: 0, onTrack: 0, atRisk: 0, breached: 0 }
});

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [slaStats, setSLAStats] = useState<SLAStats>({ 
    total: 0, scheduled: 0, missed: 0, onTrack: 0, atRisk: 0, breached: 0 
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Load candidates from localStorage
  useEffect(() => {
    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) {
      try {
        const parsedCandidates = JSON.parse(savedCandidates).map((candidate: any) => ({
          ...candidate,
          assignedAt: new Date(candidate.assignedAt),
          slaDeadline: new Date(candidate.slaDeadline),
          lastUpdated: candidate.lastUpdated ? new Date(candidate.lastUpdated) : null,
          scheduledAt: candidate.scheduledAt ? new Date(candidate.scheduledAt) : null,
        }));
        setCandidates(parsedCandidates);
      } catch (error) {
        console.error('Failed to parse saved candidates:', error);
      }
    }
  }, []);

  // Update SLA stats whenever candidates change
  useEffect(() => {
    const report = generateSLAReport(candidates);
    setSLAStats({
      total: report.total,
      scheduled: report.scheduled,
      missed: 0, // This would require historical data
      onTrack: report.onTrack,
      atRisk: report.atRisk,
      breached: report.breached
    });

    // Save to localStorage
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates]);

  // Check for SLA breaches
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      let updatedCandidates = false;
      
      setCandidates(prevCandidates => {
        const updated = prevCandidates.map(candidate => {
          // Only escalate if not already scheduled or escalated
          if (candidate.status !== 'scheduled' && candidate.status !== 'escalated') {
            const deadline = new Date(candidate.slaDeadline);
            if (now > deadline) {
              updatedCandidates = true;
              return { ...candidate, status: 'escalated' };
            }
          }
          return candidate;
        });

        if (updatedCandidates) {
          return updated;
        }
        return prevCandidates;
      });
      
      if (updatedCandidates && user?.role === 'admin') {
        toast({
          title: "SLA Breach Alert",
          description: "One or more candidates have breached SLA and been escalated",
          variant: "destructive",
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [toast, user]);

  // Add multiple candidates (from CSV import)
  const addCandidates = (newCandidates: Candidate[]) => {
    setCandidates(prevCandidates => {
      // Filter out duplicates based on email
      const existingEmails = new Set(prevCandidates.map(c => c.email));
      const filteredNew = newCandidates.filter(c => !existingEmails.has(c.email));
      
      toast({
        title: "Candidates Added",
        description: `${filteredNew.length} new candidates imported successfully.`,
      });
      
      return [...prevCandidates, ...filteredNew];
    });
  };

  // Update a candidate's status
  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate => {
        if (candidate.id === id) {
          const now = new Date();
          
          // Update follow-up count for follow-up statuses
          let followUpCount = candidate.followUpCount;
          if (status.includes('follow-up')) {
            followUpCount++;
          }
          
          // Auto-escalate after 3 follow-ups
          const newStatus = followUpCount >= 3 ? 'escalated' : status;
          
          // Set scheduledAt timestamp if status is 'scheduled'
          const scheduledAt = newStatus === 'scheduled' ? now : candidate.scheduledAt;
          
          return {
            ...candidate,
            status: newStatus,
            lastUpdated: now,
            followUpCount,
            scheduledAt,
          };
        }
        return candidate;
      })
    );
  };

  // Filter candidates based on user role
  const filterCandidatesByUser = (user: User | null): Candidate[] => {
    if (!user) return [];
    
    if (user.role === 'admin') {
      return candidates;
    } else {
      return candidates.filter(candidate => candidate.assignedTo === user.name);
    }
  };

  return (
    <CandidateContext.Provider value={{ 
      candidates, 
      addCandidates, 
      updateCandidateStatus,
      filterCandidatesByUser,
      slaStats
    }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => useContext(CandidateContext);
