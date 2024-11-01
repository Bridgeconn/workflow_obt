"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomButton from "./CustomButton";

const AudioTranscription = ({ selectedAudioFile, selectedLanguage, onTranscriptionComplete }) => {
  const [processing, setProcessing] = useState(false);

  const handleTranscribe = async () => {
    setProcessing(true);
    if (!selectedLanguage || !selectedAudioFile) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a language or file.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
      setProcessing(false);
      return;
    }
    console.log("selected file", selectedAudioFile);
    console.log("selected language", selectedLanguage);

    try {
      const formData = new FormData();
      formData.append("files", selectedAudioFile);
      formData.append("transcription_language", selectedLanguage);
      console.log("form data", formData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model/audio/transcribe?model_name=mms-1b-all`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.ApiToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response of speech to text", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Transcription Request Created Successfully',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });

      const newJobId = response.data.data.jobId;
      const initialJobDetail = { jobId: newJobId, status: "in progress" };

      // Store initial job details in localStorage
      localStorage.setItem("sttJob", JSON.stringify(initialJobDetail));

      checkJobStatus(newJobId);
    } catch (error) {
      console.error("Error in transcription:", error?.response?.data.details);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.details || 'Error in transcription. Please try again later.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
      setProcessing(false);
    }
  };

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
      console.log("job response", response.data);
      const jobStatus = response.data.data.status;
      const jobDetail = response.data.data;

      const sttJob = JSON.parse(localStorage.getItem("sttJob"));
      const updatedJobDetail = { ...sttJob, jobDetail, status: jobStatus };
      localStorage.setItem("sttJob", JSON.stringify(updatedJobDetail));

      if (jobStatus === "job finished") {
        const transcribedText = response.data.data.output.transcriptions[0].transcribedText;
        onTranscriptionComplete(transcribedText);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Transcription completed!',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
        });
        setProcessing(false);
      } else if (jobStatus === "Error") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.data?.output?.message,
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
        });
        setProcessing(false);
      } else {
        setTimeout(() => checkJobStatus(jobId), 10000);
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch job status',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
      setProcessing(false);
    }
  };

  return (
    <CustomButton
      variant="contained"
      onClick={handleTranscribe}
      disabled={processing}
    >
      {processing ? "Processing..." : "Speech to Text"}
    </CustomButton>
  );
};

export default AudioTranscription;
