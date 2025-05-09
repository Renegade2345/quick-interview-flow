
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCandidates } from "@/contexts/CandidateContext";
import { Candidate, CandidateStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSLAStatus, getSLATimeRemaining } from "@/utils/slaHelpers";
import CandidateRow from "./CandidateRow";

const CandidateList = () => {
  const { user } = useAuth();
  const { filterCandidatesByUser } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Get candidates for the current user
  const userCandidates = filterCandidatesByUser(user);
  
  // Apply filters
  const filteredCandidates = userCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort by SLA deadline (most urgent first)
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Assigned Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="follow-up-1">Follow-up 1</SelectItem>
                <SelectItem value="follow-up-2">Follow-up 2</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Company</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">SLA Deadline</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCandidates.length > 0 ? (
                sortedCandidates.map((candidate) => (
                  <CandidateRow key={candidate.id} candidate={candidate} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                    No candidates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateList;
