
import { useAuth } from "@/contexts/AuthContext";
import { useCandidates } from "@/contexts/CandidateContext";
import CandidateList from "./CandidateList";
import SLAStatsCard from "./SLAStatsCard";
import AddCandidateForm from "./AddCandidateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getSLAStatus } from "@/utils/slaHelpers";

const Dashboard = () => {
  const { user } = useAuth();
  const { filterCandidatesByUser, slaStats } = useCandidates();
  
  // Get candidates for the current user
  const userCandidates = filterCandidatesByUser(user);
  
  // Calculate at-risk and breached candidates
  const atRiskCandidates = userCandidates.filter(
    c => c.status !== 'scheduled' && getSLAStatus(c) === 'warning'
  );
  
  const breachedCandidates = userCandidates.filter(
    c => c.status !== 'scheduled' && getSLAStatus(c) === 'danger'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {user?.role === "admin" ? "Admin Dashboard" : `${user?.name}'s Dashboard`}
          </h1>
          <p className="text-muted-foreground">
            Track your assigned candidates and interview scheduling progress
          </p>
        </div>
        <AddCandidateForm />
      </div>

      <SLAStatsCard />
      
      {(atRiskCandidates.length > 0 || breachedCandidates.length > 0) && (
        <Alert variant={breachedCandidates.length > 0 ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {breachedCandidates.length > 0 && (
              <p>
                <strong>{breachedCandidates.length}</strong> candidate(s) have breached or are about to breach SLA.
              </p>
            )}
            {atRiskCandidates.length > 0 && (
              <p>
                <strong>{atRiskCandidates.length}</strong> candidate(s) are at risk of breaching SLA.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <CandidateList />
    </div>
  );
};

export default Dashboard;
