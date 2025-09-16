import React from 'react';
import './FileList.css';

const FileList = ({ files, apiUrl }) => {
  return (
    <div className="file-list">
      <h2>Archivos Subidos</h2>
      {files.length === 0 ? (
        <p>No hay archivos subidos todavía.</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={`${apiUrl}/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
