
import { useCandidates } from "@/contexts/CandidateContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { getSLAStatus } from "@/utils/slaHelpers";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { Gauge } from "lucide-react";

const SLAAnalytics = () => {
  const { candidates, filterCandidatesByUser, slaStats } = useCandidates();
  const { user } = useAuth();

  // Get candidates for the current user
  const userCandidates = filterCandidatesByUser(user);
  
  // Colors for charts
  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#9ca3af'];
  const STATUS_COLORS = {
    scheduled: "#22c55e",
    "follow-up-1": "#64748b",
    "follow-up-2": "#0ea5e9",
    pending: "#f59e0b", 
    escalated: "#ef4444"
  };
  
  // Create data for status chart
  const statusData = [
    { name: 'Scheduled', value: userCandidates.filter(c => c.status === 'scheduled').length },
    { name: 'Follow-up 1', value: userCandidates.filter(c => c.status === 'follow-up-1').length },
    { name: 'Follow-up 2', value: userCandidates.filter(c => c.status === 'follow-up-2').length },
    { name: 'Pending', value: userCandidates.filter(c => c.status === 'pending').length },
    { name: 'Escalated', value: userCandidates.filter(c => c.status === 'escalated').length },
  ].filter(item => item.value > 0);
  
  // Create data for SLA chart
  const slaData = [
    { name: 'On Track', value: userCandidates.filter(c => getSLAStatus(c) === 'ok' && c.status !== 'scheduled').length },
    { name: 'At Risk', value: userCandidates.filter(c => getSLAStatus(c) === 'warning' && c.status !== 'scheduled').length },
    { name: 'Breached', value: userCandidates.filter(c => getSLAStatus(c) === 'danger' && c.status !== 'scheduled').length },
    { name: 'Completed', value: userCandidates.filter(c => c.status === 'scheduled').length },
  ].filter(item => item.value > 0);

  // Weekly interview data (past 7 days)
  const getWeeklyData = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyData = Array(7).fill(0).map((_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      
      // Count scheduled candidates for this day
      const scheduled = userCandidates.filter(candidate => {
        if (!candidate.scheduledAt) return false;
        const scheduledDate = new Date(candidate.scheduledAt);
        return scheduledDate.toDateString() === date.toDateString();
      }).length;
      
      // Format date as day name (Mon, Tue, etc)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return { name: day, scheduled };
    });

    return weeklyData;
  };

  // Contact method stats
  const contactData = () => {
    // In a real app, this would come from tracking which contact method was used
    // For demo purposes, we're generating random distribution
    return [
      { name: 'Email', value: Math.floor(userCandidates.length * 0.4) },
      { name: 'WhatsApp', value: Math.floor(userCandidates.length * 0.35) },
      { name: 'Call', value: Math.floor(userCandidates.length * 0.25) }
    ];
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderChartSection = () => {
    if (userCandidates.length === 0) {
      return (
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <Gauge className="w-12 h-12 mb-2 opacity-20" />
            <p>Add candidates to see analytics data</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Candidate Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer
              config={{
                status: { theme: { light: "#64748b", dark: "#94a3b8" } }
              }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.name.toLowerCase().replace(' ', '-').replace(' ', '-') as keyof typeof STATUS_COLORS] || 
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">SLA Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer
              config={{
                sla: { theme: { light: "#64748b", dark: "#94a3b8" } }
              }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={slaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {slaData.map((entry, index) => {
                    let color;
                    switch (entry.name) {
                      case 'On Track': color = '#22c55e'; break;
                      case 'At Risk': color = '#eab308'; break;
                      case 'Breached': color = '#ef4444'; break;
                      case 'Completed': color = '#9ca3af'; break;
                      default: color = COLORS[index % COLORS.length];
                    }
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-1">
            <CardTitle className="text-lg">Interviews Scheduled (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer
              config={{
                scheduled: { theme: { light: "#22c55e", dark: "#4ade80" } }
              }}
              className="w-full max-w-lg"
            >
              <BarChart
                width={500}
                height={250}
                data={getWeeklyData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="scheduled" fill="#22c55e" name="Scheduled" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderMetricCards = () => {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCandidates.filter(c => c.status !== 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {userCandidates.length > 0 
                ? `${Math.round((userCandidates.filter(c => c.status !== 'pending').length / userCandidates.length) * 100)}% of candidates`
                : '0% of candidates'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* In a real app, this would be calculated from actual data */}
              {userCandidates.length > 0 ? '1.2 days' : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From first contact to scheduling
            </p>
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
            <p className="text-xs text-muted-foreground mt-1">
              Target: 80%
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      
      {renderMetricCards()}
      
      <div className="grid gap-6 md:grid-cols-2">
        {renderChartSection()}
      </div>
    </div>
  );
};

export default SLAAnalytics;
