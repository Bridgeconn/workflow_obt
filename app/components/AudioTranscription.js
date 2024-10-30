"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomButton from "./CustomButton";

const AudioTranscription = ({ selectedAudioFile, selectedLanguage, onTranscriptionComplete }) => {
  const [processing, setProcessing] = useState(false);

  const handleTranscribe = async () => {
    setProcessing(true);
    if (!selectedLanguage || !selectedAudioFile) {
      toast.error("Please select a language and file.", {
        position: "top-center",
        theme: "colored",
      });
      setProcessing(false);
      return;
    }
    console.log("selected file", selectedAudioFile);
    console.log("selected langauge", selectedLanguage);

    try {
      const formData = new FormData();
      formData.append("files", selectedAudioFile);
      formData.append("transcription_language", selectedLanguage);
      console.log("form data", formData)

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
      console.log("response of speech to text", response.data)
      toast.success("Transcription Request Created Successfully", {
        position: "top-center",
        theme: "colored",
      });

      const newJobId = response.data.data.jobId;
      const initialJobDetail = { jobId: newJobId, status: "in progress" };

      // Store initial job details in localStorage
      localStorage.setItem("sttJob", JSON.stringify(initialJobDetail));

      checkJobStatus(newJobId);
    } catch (error) {
      console.error("Error in transcription:", error?.response?.data.details);
      toast.error(
        error?.response?.data?.details ||
          "Error in transcription. Please try again later.",
        {
          position: "top-center",
          theme: "colored",
        }
      );
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
      console.log("job response", response.data)
      const jobStatus = response.data.data.status;
      const jobDetail = response.data.data;

      // Update job detail in localStorage
      const sttJob = JSON.parse(localStorage.getItem("sttJob"));
      const updatedJobDetail = { ...sttJob, jobDetail, status: jobStatus };
      localStorage.setItem("sttJob", JSON.stringify(updatedJobDetail));

      if (jobStatus === "job finished") {
        const transcribedText = response.data.data.output.transcriptions[0].transcribedText;
        onTranscriptionComplete(transcribedText);
        toast.success("Transcription completed!", {
          position: "top-center",
          theme: "colored",
        });
        setProcessing(false);
      } else if (jobStatus === "Error") {
        toast.error(response.data?.data?.output?.message, {
          position: "top-center",
          theme: "colored",
        });
        setProcessing(false);
      } else {
        setTimeout(() => checkJobStatus(jobId), 10000);
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
      toast.error("Failed to fetch job status", {
        position: "top-center",
        theme: "colored",
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
