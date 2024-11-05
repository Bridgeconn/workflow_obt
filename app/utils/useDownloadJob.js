import { useState } from "react";
import axios from "axios";

const useDownloadJob = (downloadJobId) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const downloadFile = async (shouldDownload = true) => {
    if (!downloadJobId) {
      throw new Error("No Job ID provided.");
    }

    setDownloadLoading(true);
    try {
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

        if (shouldDownload) {
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
        } else {
          return blob;
        }
      } else {
        throw new Error(`Failed to download file. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    } finally {
      setDownloadLoading(false);
    }
  };

  return { downloadLoading, downloadFile };
};

export default useDownloadJob;
