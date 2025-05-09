
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCSV, transformToCandidate } from "@/utils/csvParser";
import { useCandidates } from "@/contexts/CandidateContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const CsvUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addCandidates } = useCandidates();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        setError("Please select a CSV file");
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
      const text = await file.text();
      const csvData = parseCSV(text);
      
      // Transform to candidates and assign to interns
      const candidates = transformToCandidate(csvData, ["Ram", "Shyam"]);
      
      // Add candidates to context
      addCandidates(candidates);
      
      // Reset form
      setFile(null);
      if (document.getElementById("csv-file") instanceof HTMLInputElement) {
        (document.getElementById("csv-file") as HTMLInputElement).value = "";
      }
      
      toast({
        title: "Upload Successful",
        description: `${candidates.length} candidates have been imported and assigned to interns.`,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process CSV file");
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Candidate Data</CardTitle>
        <CardDescription>
          Import candidate information via CSV file. The file should include name,
          phone, email, company, and calendly columns.
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
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground">
              CSV must include: name, phone, email, company, calendly
            </p>
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload and Process"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUploader;
