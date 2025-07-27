import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileData } from "./FileTable";

interface FileUploadProps {
  onFileUpload: (file: FileData) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filterType: string;
  onFilterChange: (filter: string) => void;
}

const FileUpload = ({
  onFileUpload,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterChange,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate file upload
    setTimeout(async () => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3000/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const upload = response.data
      
      

       const newFile = {
        id: Date.now().toString(),
        name: upload.FileName,
        createdAt: upload.createdAt,
        status: upload.status ?? false,
        Link: upload.Link,
        type:upload.type
      };
      
      onFileUpload(newFile);

      toast({
        title: "File uploaded successfully!",
        description: `${file.name} has been added to your vault.`,
      });
      setTimeout(()=>{window.location.reload();},1000)
      setIsUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          onClick={triggerFileUpload}
          className="ghost-glow border-2 font-semibold"
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload New File"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 ghost-hover bg-card border-2 w-full sm:w-64"
            />
          </div>

          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="ghost-hover bg-card border-2 w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="ghost-hover bg-card border-2 w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
