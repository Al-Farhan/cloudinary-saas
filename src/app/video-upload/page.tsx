"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const router = useRouter();
  // max file size is 70mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      // TODO: add notification
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);

      if (response.data.ok) {
        router.push("/");
      } else {
        alert("Error while uploading file");
      }
    } catch (error) {
      console.log("Error while uploading file", error);
      alert("Error while uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
