import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ apiUrl, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsUploading(true);

    try {
      await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Archivo subido con éxito!');
      onUploadSuccess(); // Trigger a refresh in the parent component
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Hubo un error al subir el archivo.');
    } finally {
      setSelectedFile(null); // Reset file input
      document.querySelector('input[type="file"]').value = '';
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Subir un Archivo</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} disabled={isUploading} />
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Subiendo...' : 'Subir'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
