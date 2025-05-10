
import { useState } from "react";
import { Candidate, CandidateStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSLAStatus, getSLATimeRemaining } from "@/utils/slaHelpers";
import { useCandidates } from "@/contexts/CandidateContext";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Mail, MessageSquare, Phone, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CandidateRowProps {
  candidate: Candidate;
}

const CandidateRow = ({ candidate }: CandidateRowProps) => {
  const { updateCandidateStatus, deleteCandidate } = useCandidates();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communicationType, setCommunicationType] = useState<"whatsapp" | "email" | "call" | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const slaStatus = getSLAStatus(candidate);
  const timeRemaining = getSLATimeRemaining(candidate);
  
  const handleStatusChange = (newStatus: CandidateStatus) => {
    updateCandidateStatus(candidate.id, newStatus);
    toast({
      title: "Status Updated",
      description: `Candidate ${candidate.name} status changed to ${formatStatus(newStatus)}`,
    });
  };
  
  const handleCommunication = (type: "whatsapp" | "email" | "call") => {
    setCommunicationType(type);
    setIsDialogOpen(true);
  };
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    deleteCandidate(candidate.id);
    setIsDeleteDialogOpen(false);
  };
  
  const getTemplateMessage = () => {
    const { name, company, calendly } = candidate;
    return `Hi ${name}, your interview with ${company} is pending. Please use this link: ${calendly}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message template has been copied to your clipboard",
    });
    setIsDialogOpen(false);
  };
  
  const initiateCall = () => {
    window.open(`tel:${candidate.phone}`, "_blank");
    setIsDialogOpen(false);
  };
  
  const sendWhatsApp = () => {
    const message = encodeURIComponent(getTemplateMessage());
    window.open(`https://wa.me/${formatPhoneForWhatsApp(candidate.phone)}?text=${message}`, "_blank");
    setIsDialogOpen(false);
  };
  
  const sendEmail = () => {
    const subject = encodeURIComponent(`Interview Scheduling - ${candidate.company}`);
    const body = encodeURIComponent(getTemplateMessage());
    window.open(`mailto:${candidate.email}?subject=${subject}&body=${body}`, "_blank");
    setIsDialogOpen(false);
  };
  
  // Format phone number for WhatsApp (remove spaces, dashes, etc.)
  const formatPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/\D/g, "");
  };
  
  // Format status for display
  const formatStatus = (status: CandidateStatus) => {
    switch (status) {
      case "pending": return "Pending";
      case "follow-up-1": return "Follow-up 1";
      case "follow-up-2": return "Follow-up 2";
      case "scheduled": return "Scheduled";
      case "escalated": return "Escalated";
      default: return status;
    }
  };
  
  // Get background color based on SLA status
  const getStatusBgColor = () => {
    switch (slaStatus) {
      case "ok": return "bg-green-100 text-green-800";
      case "warning": return "bg-amber-100 text-amber-800";
      case "danger": return "bg-red-100 text-red-800";
      default: return "bg-gray-100";
    }
  };

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="px-4 py-3">
        <div className="font-medium">{candidate.name}</div>
        <div className="text-xs text-muted-foreground">{candidate.email}</div>
      </td>
      <td className="px-4 py-3">{candidate.company}</td>
      <td className="px-4 py-3">
        <Select
          value={candidate.status}
          onValueChange={(value) => handleStatusChange(value as CandidateStatus)}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="follow-up-1">Follow-up 1</SelectItem>
            <SelectItem value="follow-up-2">Follow-up 2</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3">
        <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${getStatusBgColor()}`}>
          {candidate.status === "scheduled" ? "Completed" : timeRemaining}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCommunication("whatsapp")}
            disabled={candidate.status === "scheduled"}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCommunication("email")}
            disabled={candidate.status === "scheduled"}
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCommunication("call")}
            disabled={candidate.status === "scheduled"}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </td>
      
      {/* Communication Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {communicationType === "whatsapp" && "Send WhatsApp"}
              {communicationType === "email" && "Send Email"}
              {communicationType === "call" && "Make Call"}
            </DialogTitle>
            <DialogDescription>
              Contact {candidate.name} via {communicationType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {communicationType !== "call" && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Template Message:</p>
                <p>{getTemplateMessage()}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              {communicationType === "whatsapp" && (
                <>
                  <Button variant="outline" onClick={() => copyToClipboard(getTemplateMessage())}>
                    Copy Text
                  </Button>
                  <Button onClick={sendWhatsApp}>Open WhatsApp</Button>
                </>
              )}
              
              {communicationType === "email" && (
                <>
                  <Button variant="outline" onClick={() => copyToClipboard(getTemplateMessage())}>
                    Copy Text
                  </Button>
                  <Button onClick={sendEmail}>Open Email Client</Button>
                </>
              )}
              
              {communicationType === "call" && (
                <>
                  <Button variant="outline" onClick={() => copyToClipboard(candidate.phone)}>
                    Copy Number
                  </Button>
                  <Button onClick={initiateCall}>Call {candidate.phone}</Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {candidate.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </tr>
  );
};

export default CandidateRow;
