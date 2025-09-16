import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const API_URL = 'http://localhost:5001';

function App() {
  const [files, setFiles] = useState([]);
  const [needsRefresh, setNeedsRefresh] = useState(true);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
      alert('No se pudo conectar con el servidor. Asegúrate de que está en funcionamiento.');
    }
  };

  useEffect(() => {
    if (needsRefresh) {
      fetchFiles();
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  return (
    <div className="container">
      <h1>Gestor de Archivos Digitales</h1>
      <FileUpload apiUrl={API_URL} onUploadSuccess={() => setNeedsRefresh(true)} />
      <FileList files={files} apiUrl={API_URL} />
    </div>
  );
}

export default App;
