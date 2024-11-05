"use client";
import React from "react";
import useDownloadJob from "../utils/useDownloadJob";
import CustomButton from "./CustomButton";
import Swal from "sweetalert2";

const DownloadJob = ({ downloadJobId }) => {
  const { downloadLoading, downloadFile } = useDownloadJob(downloadJobId);

  const handleDownload = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to download the audio file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, download it!",
    });

    if (result.isConfirmed) {
      try {
        await downloadFile();
        Swal.fire({
          title: "Downloaded!",
          text: "Your audio file has been downloaded successfully.",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "There was an error downloading the file.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  return (
    <CustomButton
      variant="contained"
      onClick={handleDownload}
      disabled={!downloadJobId || downloadLoading}
    >
      {downloadLoading ? "Downloading..." : "Download Audio"}
    </CustomButton>
  );
};

export default DownloadJob;
