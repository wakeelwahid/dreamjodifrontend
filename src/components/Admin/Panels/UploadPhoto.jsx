import React, { useState, useRef, useEffect } from "react";
import "./panels.css";

const UploadPhoto = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Fetch photos from the backend when the component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          "http://localhost:8000/api/admin/get-photos/",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Failed to fetch photos.");
          return;
        }
        // Normalize photo objects to always have id, url, and title fields
        const normalizedPhotos = (data || []).map((photo) => ({
          id: photo.id,
          url: photo.image || photo.url, // handle both possible keys
          title: photo.title || "",
        }));
        setPhotos(normalizedPhotos);
      } catch (err) {
        alert("Failed to fetch photos.");
      }
    };

    fetchPhotos(); // Call fetchPhotos when the component mounts
  }, []); // Empty dependency array means this runs once after initial render

  // Handle file change to update preview and photo object
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setCurrentPhoto((prev) => ({
        ...(prev || {}),
        id: prev?.id || Date.now(),
        file,
        url: reader.result,
        title: prev?.title || "",
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission to upload photo to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPhoto || !currentPhoto.file) return;

    const formData = new FormData();
    formData.append("photo", currentPhoto.file); // Make sure "photo" matches the backend field name
    formData.append("title", currentPhoto.title);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:8000/api/admin/upload-photo/",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(
          data.error || Object.values(data).flat().join("\n") || "Upload failed"
        );
        return;
      }
      setPhotos((prevPhotos) => [
        ...prevPhotos,
        {
          id: data.id,
          url: data.image,
          title: data.title,
        },
      ]);
      setCurrentPhoto(null);
      setPreviewUrl("");
      setEditMode(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      alert("Upload failed");
    }
  };

  // Handle deleting a photo
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:8000/api/admin/delete-photo/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete photo.");
        return;
      }
      setPhotos(photos.filter((photo) => photo.id !== id));
      if (currentPhoto && currentPhoto.id === id) {
        setCurrentPhoto(null);
        setPreviewUrl("");
        setEditMode(false);
      }
    } catch (err) {
      alert("Failed to delete photo.");
    }
  };

  // Handle editing a photo
  const handleEdit = (photo) => {
    setCurrentPhoto(photo);
    setPreviewUrl(photo.url);
    setEditMode(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle input change for photo title
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPhoto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-form-group">
          <label htmlFor="photo-upload" className="upload-label">
            Choose Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="upload-input"
          />
        </div>

        {previewUrl && (
          <div className="upload-preview-container">
            <img
              src={previewUrl}
              alt="Preview"
              className="upload-preview-image"
            />
          </div>
        )}

        <div className="upload-form-group">
          <label htmlFor="photo-title" className="upload-label">
            Title
          </label>
          <input
            id="photo-title"
            type="text"
            name="title"
            value={currentPhoto?.title || ""}
            onChange={handleInputChange}
            className="upload-input"
            required
          />
        </div>

        <button type="submit" className="upload-button upload-button-primary">
          {editMode ? "Update Photo" : "Upload Photo"}
        </button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setCurrentPhoto(null);
              setPreviewUrl("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="upload-button upload-button-secondary"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="upload-gallery">
        {photos.length === 0 ? (
          <p className="upload-empty-message">No photos uploaded yet.</p>
        ) : (
          <div className="upload-photo-table-wrapper">
            <table className="upload-photo-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Sr. No.</th>
                  <th style={{ width: "120px" }}>Image</th>
                  <th>Title</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo, idx) => (
                  <tr key={photo.id} className="upload-photo-row">
                    <td className="upload-photo-serial">{idx + 1}</td>
                    <td>
                      <img
                        src={
                          photo.url && photo.url.startsWith("http")
                            ? photo.url
                            : `http://localhost:8000${photo.url}`
                        }
                        alt={photo.title}
                        className="upload-photo-thumbnail-table"
                        style={{
                          maxWidth: "80px",
                          maxHeight: "60px",
                          borderRadius: "8px",
                          border: "1px solid #ffd700",
                          background: "#222",
                        }}
                      />
                    </td>
                    <td className="upload-photo-title-table">{photo.title}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="upload-button upload-button-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
