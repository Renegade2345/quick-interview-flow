
import { useCandidates } from "@/contexts/CandidateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CsvUploader from "./CsvUploader";
import AddCandidateForm from "./AddCandidateForm";
import SLAStatsCard from "./SLAStatsCard";
import CandidateList from "./CandidateList";

const AdminPanel = () => {
  const { candidates } = useCandidates();
  
  // Calculate stats by intern
  const ramCandidates = candidates.filter(c => c.assignedTo === "Ram");
  const shyamCandidates = candidates.filter(c => c.assignedTo === "Shyam");
  
  const calculateCompletionRate = (candidates: typeof ramCandidates) => {
    if (candidates.length === 0) return 0;
    
    const completed = candidates.filter(c => c.status === 'scheduled').length;
    return Math.round((completed / candidates.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage candidates, track SLA performance, and oversee scheduling progress
          </p>
        </div>
        <AddCandidateForm />
      </div>

      <SLAStatsCard />
      
      <div className="grid gap-6 md:grid-cols-2">
        <CsvUploader />
        
        <Card>
          <CardHeader>
            <CardTitle>Intern Performance</CardTitle>
            <CardDescription>
              Compare scheduling performance between interns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ram ({ramCandidates.length} candidates)</span>
                <span>{calculateCompletionRate(ramCandidates)}% completed</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo" 
                  style={{ width: `${calculateCompletionRate(ramCandidates)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Shyam ({shyamCandidates.length} candidates)</span>
                <span>{calculateCompletionRate(shyamCandidates)}% completed</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo" 
                  style={{ width: `${calculateCompletionRate(shyamCandidates)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Candidates</TabsTrigger>
          <TabsTrigger value="ram">Ram's Candidates</TabsTrigger>
          <TabsTrigger value="shyam">Shyam's Candidates</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <CandidateList />
        </TabsContent>
        <TabsContent value="ram" className="mt-4">
          {/* The CandidateList will be filtered by the admin context */}
          <CandidateList />
        </TabsContent>
        <TabsContent value="shyam" className="mt-4">
          {/* The CandidateList will be filtered by the admin context */}
          <CandidateList />
        </TabsContent>
        <TabsContent value="escalated" className="mt-4">
          {/* The CandidateList will be filtered by the admin context */}
          <CandidateList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
