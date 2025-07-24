import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Ghost,
  Upload,
  FileImage,
  Video,
  Music,
  FileText,
  Eye,
  Copy,
  Trash2,
  Settings,
  User,
  LogOut,
  Search,
  AlertCircle,
  Share2,
} from "lucide-react";

export default function GhostDropDashboard({ isLoggedIn, setIsLoggedIn }) {
  // Files state (empty if logged out)
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Dummy files when logged out (empty array here)
  const dummyFiles = [];

  // Determine files to display based on login
  const displayedFiles = isLoggedIn ? files : dummyFiles;

  // Stats counts
  const totalFilesCount = displayedFiles.length;
  const activeFilesCount = displayedFiles.filter((f) => f.status === true).length; // true = Used
  const expiredFilesCount = displayedFiles.filter((f) => f.status === false).length; // false = Unused

  function getFileIcon(filename) {
    if (!filename) return <FileText className="w-5 h-5 text-gray-400" />;
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(ext))
      return <FileImage className="w-5 h-5 text-blue-400" />;
    if (["mp4", "mkv", "mov", "avi", "flv"].includes(ext))
      return <Video className="w-5 h-5 text-red-400" />;
    if (["mp3", "wav", "ogg", "m4a"].includes(ext))
      return <Music className="w-5 h-5 text-green-400" />;
    if (["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"].includes(ext))
      return <FileText className="w-5 h-5 text-purple-400" />;

    return <FileText className="w-5 h-5 text-gray-400" />;
  }

  function copyToClipboard(text) {
    if (!isLoggedIn) {
      alert("Please login to copy links.");
      redirectToLogin();
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  }

  function redirectToLogin() {
    window.location.href = "/login";
  }

  function deleteFile(fileId) {
    if (!isLoggedIn) {
      alert("Please login to delete files.");
      redirectToLogin();
      return;
    }
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    toast.info("File deleted");
  }

  function toggleFileStatus(fileId) {
    if (!isLoggedIn) {
      alert("Please login to change file status.");
      redirectToLogin();
      return;
    }

    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, status: !file.status } : file
      )
    );
    toast.success("Status updated");
  }

  const filteredFiles = displayedFiles
    .filter((file) => {
      const name = file.Filename || file.name || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterType === "all") return matchesSearch;
      const ext = name.split(".").pop().toLowerCase();
      if (filterType === "image")
        return matchesSearch && ["jpg","jpeg","png","gif","bmp"].includes(ext);
      if (filterType === "video")
        return matchesSearch && ["mp4","mkv","mov","avi","flv"].includes(ext);
      if (filterType === "audio")
        return matchesSearch && ["mp3","wav","ogg","m4a"].includes(ext);
      if (filterType === "document")
        return matchesSearch && ["pdf","doc","docx","txt","xls","xlsx","ppt","pptx"].includes(ext);
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name") {
        return (a.Filename || a.name || "").localeCompare(b.Filename || b.name || "");
      }
      if (sortBy === "size") {
        return (a.size || 0) - (b.size || 0);
      }
      return 0;
    });

  function handleUploadButtonClick() {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    if (event.target.files && event.target.files.length > 0) {
      // only take the first file, ignore others
      setSelectedFiles([event.target.files[0]]);
    }
  }

  async function handleUpload() {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      // Append only one file at a time
      formData.append("file", selectedFiles[0]);

      const token = localStorage.getItem("token");

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

      // Assume response.data contains the single uploaded file info
      const file = response.data;

      const newFile = {
        id: file.id || file.Filename + Date.now(),
        Filename: file.Filename,
        createdAt: file.createdAt,
        status: file.status ?? false,
        Link: file.Link,
        size: file.size || 0,
      };

      setFiles((prev) => [newFile, ...prev]);

      setShowUploadModal(false);
      setSelectedFiles([]);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleCancelUpload() {
    setSelectedFiles([]);
    setShowUploadModal(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900 bg-opacity-95 backdrop-blur-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3">
                <Ghost className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Ghost Drop
              </h1>
            </div>

            {/* User info or Login */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-white text-sm">User</span>
                  </div>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="inline-block px-5 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-500 hover:shadow-xl transition duration-300 ease-in-out select-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-1"
                  type="button"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-white">{totalFilesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Used Files</p>
                <p className="text-2xl font-bold text-white">{activeFilesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-500 bg-opacity-20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Unused Files</p>
                <p className="text-2xl font-bold text-white">{expiredFilesCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                if (!isLoggedIn) return redirectToLogin();
                setShowUploadModal(true);
              }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload New File
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => {
                    if (!isLoggedIn) return redirectToLogin();
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => {
                  if (!isLoggedIn) return redirectToLogin();
                  setFilterType(e.target.value);
                }}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  if (!isLoggedIn) return redirectToLogin();
                  setSortBy(e.target.value);
                }}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Files Table */}
        <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Toggle Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, idx) => (
                    <tr
                      key={file.id || file.Filename || idx}
                      className="hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(file.Filename)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white truncate max-w-xs" title={file.Filename}>
                              {file.Filename}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                            file.status ? "bg-green-600" : "bg-gray-600"
                          }`}
                        >
                          {file.status ? "Used" : "Unused"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFileStatus(file.id)}
                          className={`px-3 py-1 rounded ${
                            file.status
                              ? "bg-gray-500 hover:bg-gray-700"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white transition-colors duration-200`}
                          title="Toggle Status"
                        >
                          {file.status ? "Mark as Unused" : "Mark as Used"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(file.Link)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className={`text-blue-400 hover:text-blue-300 transition-colors duration-200 opacity-50 cursor-not-allowed`}
                            title="Share (not implemented)"
                            disabled
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-6">
                      No files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Upload New File</h3>
            <p className="text-gray-400 mb-6">
              Drag and drop your file here or click the button below to browse
            </p>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={uploading}
            />

            <button
              onClick={handleUploadButtonClick}
              className={`px-6 py-2 mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 w-full ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
            >
              {uploading ? "Selecting file disabled while uploading..." : "Select File"}
            </button>

            {selectedFiles.length > 0 && (
              <div className="mb-4 max-h-40 overflow-y-auto rounded border border-yellow-500 p-2 text-yellow-300 text-sm bg-gray-800">
                <ul>
                  {selectedFiles.map((file, idx) => (
                    <li key={idx} className="truncate" title={file.name}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className={`px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
