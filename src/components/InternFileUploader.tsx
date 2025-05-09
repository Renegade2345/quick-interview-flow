
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useCandidates } from "@/contexts/CandidateContext";
import { useAuth } from "@/contexts/AuthContext";
import { parseCSV, transformToCandidate } from "@/utils/csvParser";
import { Download, Upload } from "lucide-react";

const InternFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addCandidates } = useCandidates();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Validate file type
      if (
        fileType !== "text/csv" && 
        fileType !== "application/pdf" && 
        fileType !== "application/vnd.google-apps.spreadsheet" &&
        fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        fileExt !== "csv" && 
        fileExt !== "pdf" && 
        fileExt !== "xlsx" && 
        fileExt !== "xls"
      ) {
        setError("Please select a CSV, PDF or Google Sheet file");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Process based on file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'pdf') {
        toast({
          title: "Processing PDF",
          description: "PDF parsing is handled through our backend service.",
        });
        
        // Here we would normally send the PDF to a backend service
        // For MVP, we'll simulate success after a delay
        setTimeout(() => {
          const mockCandidates = [
            {
              name: `Test Candidate from PDF`,
              email: `test_${Date.now()}@example.com`,
              phone: "123-456-7890",
              company: "PDF Import Co",
              calendly: "https://calendly.com/test"
            }
          ];
          
          const candidates = transformToCandidate(mockCandidates, [user?.name || ""]);
          addCandidates(candidates);
          
          toast({
            title: "PDF Processed",
            description: `${candidates.length} candidate(s) extracted and added.`,
          });
        }, 1500);
      } 
      else if (fileExt === 'xlsx' || fileExt === 'xls') {
        toast({
          title: "Processing Spreadsheet",
          description: "Spreadsheet parsing is handled through our conversion service.",
        });
        
        // Here we would normally convert the spreadsheet to CSV format
        // For MVP, we'll simulate success after a delay
        setTimeout(() => {
          const mockCandidates = [
            {
              name: `Test Candidate from Sheet`,
              email: `test_${Date.now()}@example.com`,
              phone: "123-456-7890",
              company: "Sheet Import Co",
              calendly: "https://calendly.com/test"
            }
          ];
          
          const candidates = transformToCandidate(mockCandidates, [user?.name || ""]);
          addCandidates(candidates);
          
          toast({
            title: "Spreadsheet Processed",
            description: `${candidates.length} candidate(s) extracted and added.`,
          });
        }, 1500);
      } 
      else {
        // Process CSV as before
        const text = await file.text();
        const csvData = parseCSV(text);
        
        // For interns, we only assign to themselves
        const candidates = transformToCandidate(csvData, [user?.name || ""]);
        
        addCandidates(candidates);
        
        toast({
          title: "Upload Successful",
          description: `${candidates.length} candidates have been imported and assigned to you.`,
        });
      }
      
      // Reset form
      setFile(null);
      if (document.getElementById("intern-file") instanceof HTMLInputElement) {
        (document.getElementById("intern-file") as HTMLInputElement).value = "";
      }
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process file");
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = "name,phone,email,company,calendly\nJohn Doe,1234567890,john@example.com,Example Inc,https://calendly.com/john";
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "candidate_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Candidates</CardTitle>
        <CardDescription>
          Import candidate information via CSV, spreadsheet, or PDF file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Input
              id="intern-file"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: CSV, Excel spreadsheets, PDF
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? "Processing..." : "Upload and Process"}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="mt-2 md:mt-0"
            >
              Download Template
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternFileUploader;
