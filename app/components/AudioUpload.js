"use client";
import React from 'react';
import CustomButton from './CustomButton';

const AudioUpload = ({ onAudioFileChange }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected audio file:', file);
      onAudioFileChange(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('audio-file-input').click();
  };

  return (
    <div>
      <input
        accept="audio/*"
        id="audio-file-input"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <CustomButton onClick={handleUploadClick}>
        Upload Audio
      </CustomButton>
    </div>
  );
};

export default AudioUpload;
