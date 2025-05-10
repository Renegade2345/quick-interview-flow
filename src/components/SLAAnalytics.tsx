
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { useCandidates } from "@/contexts/CandidateContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const SLAAnalytics = () => {
  const { candidates, slaStats } = useCandidates();
  const { user } = useAuth();
  const [chartAnimated, setChartAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after data is ready
    if (candidates.length > 0 || candidates.length === 0) {
      setIsLoading(false);
    }
    
    // Delay the animation to create a staggered effect
    const timer = setTimeout(() => {
      setChartAnimated(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [candidates]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  // Prepare data for pie chart
  const statusData = [
    { name: 'Initial Contact', value: candidates.filter(c => c.status === 'pending').length },
    { name: 'Follow-up 1', value: candidates.filter(c => c.status === 'follow-up-1').length },
    { name: 'Follow-up 2', value: candidates.filter(c => c.status === 'follow-up-2').length },
    { name: 'Scheduled', value: candidates.filter(c => c.status === 'scheduled').length },
  ];

  // Prepare data for SLA bar chart
  const slaData = [
    { name: 'On Track', value: slaStats.onTrack, color: '#34C759' }, // iOS Green
    { name: 'At Risk', value: slaStats.atRisk, color: '#FF9500' },   // iOS Orange
    { name: 'Breached', value: slaStats.breached, color: '#FF3B30' }, // iOS Red
  ];

  // Trend data (mocked for now, could be replaced with real data)
  const trendData = [
    { name: 'Week 1', scheduled: 5, contacted: 12 },
    { name: 'Week 2', scheduled: 8, contacted: 15 },
    { name: 'Week 3', scheduled: 12, contacted: 20 },
    { name: 'Week 4', scheduled: 15, contacted: 18 },
    { name: 'Week 5', scheduled: 20, contacted: 25 },
  ];

  // Mock data for contact method distribution
  const contactData = [
    { name: 'Email', value: 65 },
    { name: 'Phone', value: 20 },
    { name: 'LinkedIn', value: 15 },
  ];

  // Colors for status pie chart (iOS colors)
  const COLORS = ['#007AFF', '#5AC8FA', '#34C759', '#AF52DE'];

  return (
    <div className={`space-y-6 ${chartAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg text-ios-blue data-[state=active]:bg-ios-blue data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="sla" className="rounded-lg text-ios-blue data-[state=active]:bg-ios-blue data-[state=active]:text-white">SLA Metrics</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-lg text-ios-blue data-[state=active]:bg-ios-blue data-[state=active]:text-white">Trends</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg text-ios-blue data-[state=active]:bg-ios-blue data-[state=active]:text-white">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ios-card">
              <CardHeader>
                <CardTitle>Candidate Status</CardTitle>
                <CardDescription>Distribution of candidates by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="ios-card">
              <CardHeader>
                <CardTitle>SLA Status</CardTitle>
                <CardDescription>Current SLA compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={slaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Candidates" radius={[4, 4, 0, 0]}>
                      {slaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="ios-card">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Key statistics for {user?.role === 'admin' ? 'all recruiters' : user?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">Total Candidates</span>
                    <span className="text-2xl font-bold text-ios-blue">{candidates.length}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">Scheduled</span>
                    <span className="text-2xl font-bold text-ios-green">
                      {candidates.filter(c => c.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">Need Follow-up</span>
                    <span className="text-2xl font-bold text-ios-orange">
                      {candidates.filter(c => c.status === 'follow-up-1' || c.status === 'follow-up-2').length}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">SLA Compliant</span>
                    <span className="text-2xl font-bold text-ios-purple">
                      {Math.round((slaStats.onTrack / (candidates.length || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sla" className="pt-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>SLA Analysis</CardTitle>
              <CardDescription>Detailed breakdown of SLA performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={slaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Candidates" radius={[4, 4, 0, 0]}>
                      {slaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">SLA Definitions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-ios-green mr-2"></div>
                      <span><strong>On Track</strong>: Contact made within specified timeframe</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-ios-orange mr-2"></div>
                      <span><strong>At Risk</strong>: Approaching SLA deadline (within 24 hours)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-ios-red mr-2"></div>
                      <span><strong>Breached</strong>: SLA deadline has passed without contact</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="pt-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>Scheduling Trends</CardTitle>
              <CardDescription>Weekly progression of candidate contacts and scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="scheduled" stroke="#34C759" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="contacted" stroke="#007AFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="pt-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle>Contact Method Analysis</CardTitle>
              <CardDescription>Distribution of preferred contact methods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contactData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#007AFF', '#FF9500', '#AF52DE'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Contact Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-ios-blue mr-2"></div>
                    <span><strong>Email</strong>: Best for initial outreach and scheduling confirmations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-ios-orange mr-2"></div>
                    <span><strong>Phone</strong>: Recommended for follow-ups and urgent communications</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-ios-purple mr-2"></div>
                    <span><strong>LinkedIn</strong>: Effective for professional networking and passive candidates</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SLAAnalytics;
