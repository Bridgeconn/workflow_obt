// DragAndDrop.js
"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Box } from "@mui/material";

const DragAndDrop = ({ onAudioFileChange }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        console.log("Dropped audio file:", file);
        onAudioFileChange(file);
      }
    },
    onDropRejected: (rejectedFiles) => {
      console.error("File type not accepted:", rejectedFiles);
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #888",
        borderRadius: "8px",
        padding: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: isDragActive ? "#e0f7fa" : "#f9f9f9",
        transition: "background-color 0.2s ease",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p style={{ color: "#00796b" }}>Drop the audio file here...</p>
      ) : (
        <p>Drag and drop your audio file here, or click to select</p>
      )}
    </Box>
  );
};

export default DragAndDrop;
