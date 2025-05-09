
import { Candidate } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface CSVCandidate {
  name: string;
  phone: string;
  email: string;
  company: string;
  calendly: string;
}

export const parseCSV = (csvContent: string): CSVCandidate[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  
  const requiredHeaders = ['name', 'phone', 'email', 'company', 'calendly'];
  const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header));
  
  if (!hasRequiredHeaders) {
    throw new Error('CSV file is missing required headers: name, phone, email, company, calendly');
  }
  
  const results: CSVCandidate[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(value => value.trim());
    
    const candidate: Record<string, string> = {};
    headers.forEach((header, index) => {
      candidate[header] = values[index] || '';
    });
    
    results.push(candidate as unknown as CSVCandidate);
  }
  
  return results;
};

export const transformToCandidate = (csvCandidates: CSVCandidate[], interns: string[]): Candidate[] => {
  return csvCandidates.map((csvCandidate, index) => {
    const now = new Date();
    const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    // Assign candidates in alternating fashion to ensure 50-50 split
    const assignedTo = interns[index % interns.length];
    
    return {
      id: uuidv4(),
      name: csvCandidate.name,
      email: csvCandidate.email,
      phone: csvCandidate.phone,
      company: csvCandidate.company,
      calendly: csvCandidate.calendly,
      assignedTo,
      assignedAt: now,
      slaDeadline: deadline,
      status: 'pending',
      followUpCount: 0,
      lastUpdated: null,
      scheduledAt: null
    };
  });
};
