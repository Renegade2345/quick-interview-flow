
import { useAuth } from "@/contexts/AuthContext";
import { useCandidates } from "@/contexts/CandidateContext";
import CandidateList from "./CandidateList";
import SLAStatsCard from "./SLAStatsCard";
import AddCandidateForm from "./AddCandidateForm";
import InternFileUploader from "./InternFileUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

  // Calculate recent contact stats
  const contactsLast24h = userCandidates.filter(c => {
    if (!c.lastUpdated) return false;
    const lastUpdated = new Date(c.lastUpdated);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastUpdated > yesterday;
  }).length;

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
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/analytics">View Analytics</Link>
          </Button>
          <AddCandidateForm />
        </div>
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
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsLast24h}</div>
            <p className="text-xs text-muted-foreground mt-1">Contacts in the last 24 hours</p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCandidates.filter(c => 
                c.status === 'follow-up-1' || 
                c.status === 'follow-up-2'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires your attention</p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduling Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCandidates.length > 0 
                ? `${Math.round((userCandidates.filter(c => c.status === 'scheduled').length / userCandidates.length) * 100)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target: 80%</p>
          </CardContent>
        </Card>
      </div>
      
      {user?.role !== "admin" && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <InternFileUploader />
        </div>
      )}
      
      <CandidateList />
    </div>
  );
};

export default Dashboard;
