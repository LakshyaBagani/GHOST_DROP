import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  File, 
  Image, 
  FileText, 
  Video, 
  Archive,
  Copy,
  Share,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface FileData {
  id: string;
  name: string;
  Link: string;
  createdAt: Date;
  status: Boolean;
  type:string;
  linkId:string
}

interface FileTableProps {
  files: FileData[];
  onToggleStatus: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

const FileTable = ({ files, onToggleStatus, onDeleteFile }: FileTableProps) => {
  const { toast } = useToast();
  const [clickedButtons, setClickedButtons] = useState<Set<string>>(new Set());

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Video;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    if (type.includes("zip") || type.includes("archive")) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCopy = (fileName: string) => {
    console.log("files",files);

    try {
      const matchedFile = files.find((file) => file.name === fileName);
      
      if (matchedFile) {
        const fileLink = matchedFile.Link;
        navigator.clipboard.writeText(fileLink);
       
        toast({
          title: "Link copied!",
          description: `Link for "${matchedFile.name}" has been copied to clipboard.`,
        });
      } else {
        toast({
          title: "File not found",
          description: `No matching file found for "${fileName}".`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error parsing user files from localStorage", err);
    }
  };

  const handleShare = (fileName: string) => {
    if (navigator.share) {
      navigator.share({
        title: fileName,
        url: `https://ghostdrop.app/file/${fileName}`,
      });
    } else {
      handleCopy(fileName);
    }
  };


  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <File className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No files uploaded</h3>
        <p className="text-muted-foreground">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-border ghost-glow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold">File</TableHead>
            <TableHead className="text-foreground font-semibold">Created</TableHead>
            <TableHead className="text-foreground font-semibold">Status</TableHead>
            <TableHead className="text-foreground font-semibold">Regenerate</TableHead>
            <TableHead className="text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            const isClicked = clickedButtons.has(file.id);
            
            return (
              <TableRow 
                key={file.id} 
                className="border-border hover:bg-muted/30 purple-hover transition-all duration-200"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <span className="text-foreground truncate max-w-[200px]">{file.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(file.createdAt).toLocaleDateString()} 
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={file.status === false ? "default" : "secondary"}
                    className={file.status === false ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
                  >
                    {file.status === true ? "Used" : "Unused"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant={file.status === false ? "outline" : "default"}
                    size="sm"
                    onClick={() => onToggleStatus(file.id)}
                    className={`transition-all duration-200 ${
                      isClicked 
                        ? "scale-95 bg-primary/80 text-primary-foreground border-primary shadow-inner" 
                        : file.status === false 
                        ? "border-muted-foreground text-muted-foreground hover:bg-muted active:scale-95" 
                        : "bg-success hover:bg-success/80 text-success-foreground border-success active:scale-95"
                    }`}
                  >
                    {"Regenerate Link"}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(file.name)}
                      className="h-8 w-8 p-0 ghost-hover text-primary hover:text-primary"
                      title="Copy Link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(file.name)}
                      className="h-8 w-8 p-0 ghost-hover text-accent hover:text-accent"
                      title="Share"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFile(file.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileTable;