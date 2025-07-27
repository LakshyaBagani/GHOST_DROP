import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import FileUpload from "@/components/FileUpload";
import FileTable, { FileData } from "@/components/FileTable";
import { FolderOpen, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Dashboard = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [usersFileUpload, setUsersFileUpload] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/files/allfiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filesFromServer = response.data.files;
      console.log("All files",response.data);
      

      const formattedFiles = filesFromServer.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt),
        type: file.mimeType,
        name: file.fileName,
        status:file.link.used,
        Link:file.link.Link
      }));
      console.log("Formate",formattedFiles);
      
      setFiles(formattedFiles);
    };

    fetchFiles();
  }, [navigate]);

  useEffect(() => {
    console.log(
      "Local files",
      JSON.parse(localStorage.getItem("requiredFile"))
    );
  }, [files]);

  const handleFileUpload = (newFile: FileData) => {
    setUsersFileUpload((prev) => [newFile, ...prev]);
    localStorage.setItem("requiredFile", JSON.stringify([newFile, ...files]));
  };

  const handleToggleStatus = (id: string) => {
    // setFiles((prev) =>
    //   prev.map((file) =>
    //     file.id === id
    //       ? { ...file, status: file.status === "used" ? "unused" : "used" }
    //       : file
    //   )
    // );

    // const file = files.find((f) => f.id === id);
    // if (file) {
    //   toast({
    //     title: "Status updated",
    //     description: `${file.name} marked as ${
    //       file.status === false ? "unused" : "used"
    //     }.`,
    //   });
    // }
  };

  

  const handleDeleteFile = async (id: string) => {
    const file = files.find((f) => f.id === id);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        "http://localhost:3000/files/delete",
        {
          data: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        toast({
          title: "File deleted",
          description: `${file.name} has been removed from your vault.`,
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "File not deleted",
        description: `Failed to delete the ${file.name}`,
        variant: "destructive",
      });
    }
  };

  // Filter and sort files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = (file.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const fileType = file.type || "";
    const matchesFilter =
      filterType === "all" ||
      (filterType === "image" && fileType.startsWith("image/")) ||
      (filterType === "video" && fileType.startsWith("video/")) ||
      (filterType === "document" &&
        (file.type.includes("pdf") || fileType.includes("document"))) ||
      (filterType === "archive" &&
        (file.type.includes("zip") || fileType.includes("archive")));

    return matchesSearch && matchesFilter;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    switch (sortBy) {
      case "newest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const stats = {
    total: files.length,
    used: files.filter((f) => f.status === false).length,
    unused: files.filter((f) => f.status === false).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Files"
            value={stats.total}
            icon={FolderOpen}
            variant="total"
          />
          <StatsCard
            title="Used Files"
            value={stats.used}
            icon={CheckCircle}
            variant="used"
          />
          <StatsCard
            title="Unused Files"
            value={stats.unused}
            icon={XCircle}
            variant="unused"
          />
        </div>

        {/* File Upload Section */}
        <div className="bg-card rounded-lg border-2 border-border ghost-glow p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            File Management
          </h2>
          <FileUpload
            onFileUpload={handleFileUpload}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterType={filterType}
            onFilterChange={setFilterType}
          />
        </div>

        {/* File Table Section */}
        <div className="bg-card rounded-lg border-2 border-border ghost-glow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Your Files
            </h2>
            {files.length > 0 && (
              <span className="text-sm text-muted-foreground">
                Showing {sortedFiles.length} of {files.length} files
              </span>
            )}
          </div>

          <FileTable
            files={sortedFiles}
            onToggleStatus={handleToggleStatus}
            onDeleteFile={handleDeleteFile}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
