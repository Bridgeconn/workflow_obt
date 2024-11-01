"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomButton from "./CustomButton";

const DownloadJob = ({ downloadJobId }) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async () => {
    if (downloadJobId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to download the audio file?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, download it!",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        setDownloadLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/ai/assets?job_id=${downloadJobId}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.ApiToken}`,
            },
            responseType: "blob",
          }
        );

        if (response.status === 200) {
          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;

          // Extract filename from headers
          const contentDisposition = response.headers["content-disposition"];
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          let filename = "download.zip";
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }

          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          Swal.fire({
            title: "Downloaded!",
            text: "Your audio file has been downloaded successfully.",
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          console.error("Failed to download file. Status:", response.status);
          Swal.fire({
            title: "Error!",
            text: "Failed to download file.",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error downloading the file.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        setDownloadLoading(false);
      }
    } else {
      Swal.fire({
        title: "No Job!",
        text: "No job available for download.",
        icon: "error",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
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
