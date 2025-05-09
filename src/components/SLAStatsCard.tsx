
import { useAuth } from "@/contexts/AuthContext";
import { useCandidates } from "@/contexts/CandidateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SLAStatsCard = () => {
  const { user } = useAuth();
  const { filterCandidatesByUser, slaStats } = useCandidates();
  
  // Get candidates for the current user
  const userCandidates = filterCandidatesByUser(user);
  
  // Calculate SLA percentage
  const totalCandidates = userCandidates.length;
  const scheduledCandidates = userCandidates.filter(c => c.status === 'scheduled').length;
  const scheduledPercentage = totalCandidates > 0 
    ? Math.round((scheduledCandidates / totalCandidates) * 100) 
    : 0;
  
  // Get color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCandidates}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scheduledCandidates}</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">SLA Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-2xl font-bold">{scheduledPercentage}%</span>
            <span className="text-xs text-muted-foreground self-end">Target: 80%</span>
          </div>
          <Progress 
            value={scheduledPercentage} 
            className={`h-2 ${getProgressColor(scheduledPercentage)}`}
          />
        </CardContent>
      </Card>
      
      {user?.role === "admin" && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{slaStats.onTrack}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{slaStats.atRisk}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Breached</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{slaStats.breached}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">SLA Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {slaStats.total > 0 
                  ? `${Math.round((slaStats.scheduled / slaStats.total) * 100)}%` 
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SLAStatsCard;
