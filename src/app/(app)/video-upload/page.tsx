import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your-upload-preset');  // You can set an upload preset in your Cloudinary dashboard.
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();

      if (data.secure_url) {
        // After successful upload, you can store the video details in your database
        const videoData = {
          title,
          description,
          publicId: data.public_id,
          originalSize: file.size.toString(),
          compressedSize: data.bytes.toString(),
          duration: data.duration || 0,
        };
        // Send videoData to your server or database
        toast.success("Video uploaded successfully!");
      } else {
        throw new Error('Failed to upload video');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className='input input-bordered w-full' required />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className='textarea textarea-bordered w-full' />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input type="file" accept="video/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className='file-input file-input-bordered w-full' required />
        </div>
        <button type="submit" className='btn btn-primary' disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default VideoUpload;
