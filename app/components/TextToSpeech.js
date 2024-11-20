"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomButton from "./CustomButton";
import languagesData from "../data/seamless_language.json";

const TextToSpeech = ({ selectedLanguage, transcribedText, setDownloadJobId }) => {
  const [processing, setProcessing] = useState(false);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model`,
  //       {
  //         params: {
  //           model_name: "seamless-m4t-large",
  //           skip: 0,
  //           limit: 1,
  //         },
  //         headers: {
  //           accept: "application/json",
  //           Authorization: `Bearer ${process.env.ApiToken}`,
  //         },
  //       }
  //     );

  //     console.log("Languages Fetched Successfully", response.data[0].languages);

  //     if (Array.isArray(response.data) && response.data.length > 0) {
  //       const modelSpecificLanguages = response.data[0].languages;
  //       const checkLanguage = modelSpecificLanguages.find((lang) => {
  //         return lang.lang_code === selectedLanguage;
  //       });
  //       if (!checkLanguage) {
  //         console.log("language not supported");
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'Language not supported for this task, Please choose another language',
  //           position: 'top-end',
  //           toast: true,
  //           showConfirmButton: false,
  //           timer: 3000
  //         });
  //         setProcessing(false);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching languages:", error);
  //   }
  // };

  const checkLanguageSupport = () => {
    const languageExists = languagesData.some((language) => language.lang_code === selectedLanguage);
    
    if (!languageExists) {
      console.log("Language not supported");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Language not supported for this task. Please choose another language.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
      setProcessing(false);
      return false;
    } 
    return true;
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

      const ttsJob = JSON.parse(localStorage.getItem("ttsJob"));
      const updatedJobDetail = { ...ttsJob, jobDetail, status: jobStatus };
      localStorage.setItem("ttsJob", JSON.stringify(updatedJobDetail));

      if (jobStatus === "job finished") {
        setDownloadJobId(jobId);
        setProcessing(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Audio generation completed!',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 3000
        });
      } else if (jobStatus === "Error") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.data?.output?.message,
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 3000
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
        timer: 3000
      });
      setProcessing(false);
    }
  };

  const handleConvert = async () => {
    try {
      setProcessing(true);
      setDownloadJobId(null);
      const languageSupported = checkLanguageSupport();
      if (!languageSupported) {
        setProcessing(false);
        return;
      }
      const transcribedTextArray = [transcribedText.trim()];
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model/audio/generate?model_name=seamless-m4t-large&language=${selectedLanguage}`,
        transcribedTextArray,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.ApiToken}`,
          },
        }
      );
      const newJobId = response.data.data.jobId;
      const initialJobDetail = { jobId: newJobId, status: "in progress" };

      // Store initial job details in localStorage
      localStorage.setItem("ttsJob", JSON.stringify(initialJobDetail));

      checkJobStatus(newJobId);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Audio Generation Request Created Successfully',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      setProcessing(false);
      console.error("Error in TTS conversion:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error in TTS conversion. Please try again later.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  return (
    <CustomButton
      variant="contained"
      onClick={handleConvert}
      disabled={processing}
    >
      {processing ? "Processing..." : "Text to Speech"}
    </CustomButton>
  );
};

export default TextToSpeech;
