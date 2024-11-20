"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const NoiseRemoval = ({ selectedAudioFile, onComplete }) => {
  const [processing, setProcessing] = useState(false);

  const checkJobStatus = async (jobId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model/job?job_id=${jobId}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.ApiToken}`,
          },
        }
      );
      console.log("Job Status Fetched:", response.data);
      const jobStatus = response.data.data.status;
      const jobDetail = response.data.data;

      const nrJob = JSON.parse(localStorage.getItem("nrJob"));
      const updatedJobDetail = { ...nrJob, jobDetail, status: jobStatus };
      localStorage.setItem("nrJob", JSON.stringify(updatedJobDetail));

      if (jobStatus === "job finished") {
        setProcessing(false);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Noise removal completed! You can now preview the audio file.',
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 3000
          });
        onComplete?.(jobId);
      } else if (jobStatus === "Error") {
        setProcessing(false);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data?.data?.output?.message,
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 3000
          });
      } else {
        setTimeout(() => checkJobStatus(jobId), 10000);
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
      setProcessing(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch job status',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const handleNoiseRemoval = async () => {
    if (!selectedAudioFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please upload an audio file.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      setProcessing(true);

      const formData = new FormData();
      formData.append("files", selectedAudioFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model/audio/noise-removal?model_name=DeepFilterNet3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.ApiToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Noise removal response", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your audio is being processed for Noise removal!',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
      const newJobId = response.data.data.jobId;
      const initialJobDetail = { jobId: newJobId, status: "in progress" };

      // Store initial job details in localStorage
      localStorage.setItem("nrJob", JSON.stringify(initialJobDetail));

      checkJobStatus(newJobId);
    } catch (error) {
      console.error("Error in noise removal:", error);
      setProcessing(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Noise removal failed. Please try again later.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
      return null;
    }
  };

  return {
    handleNoiseRemoval,
    processing,
  };
};

export default NoiseRemoval;
