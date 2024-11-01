"use client";
import { Container, Box } from "@mui/material";
import AudioUpload from "./components/AudioUpload";
import LanguageDropdown from "./components/LanguageDropdown";
import DragAndDrop from "./components/DragAndDrop";
import { useRef, useState } from "react";
import Image from "next/image";
import AudioTranscription from "./components/AudioTranscription";
import TranscribeTextArea from "./components/TranscribeTextarea";
import TextToSpeech from "./components/TextToSpeech";
import DownloadJob from "./components/DownloadJob";

export default function Home() {
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [downloadJobId, setDownloadJobId] = useState(null);
  const audioRef = useRef(null);

  const handleAudioFileChange = (file) => {
    setSelectedAudioFile(file);

    if (audioRef.current.src) {
      URL.revokeObjectURL(audioRef.current.src);
    }

    const newAudioURL = URL.createObjectURL(file);
    setAudioURL(newAudioURL);
    audioRef.current.src = newAudioURL;
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleDeleteAudioFile = () => {
    setSelectedAudioFile(null);
    setAudioURL("");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (audioRef.current.src) {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current.src = "";
    }
  };

  const handleTranscriptionComplete = (text) => {
    setTranscribedText(text);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
        minWidth: "100vw",
        padding: 0,
        margin: 0,
        backgroundColor: "#EFEFEF",
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 2, sm: 8 },
          width: "100%",
          padding: 2,
          boxShadow: "none",
        }}
      >
        <AudioUpload onAudioFileChange={handleAudioFileChange} />
        <LanguageDropdown onLanguageChange={handleLanguageChange} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 2,
          width: "100%",
          padding: 2,
          boxShadow: "none",
          background: "#DCDADA80",
          marginTop: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            padding: 2,
            height: "200px",
          }}
        >
          <DragAndDrop
            onAudioFileChange={handleAudioFileChange}
            audioFile={selectedAudioFile}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "30%" }, padding: 2 }}>
          <audio
            ref={audioRef}
            controls
            disabled={!selectedAudioFile}
            style={{ width: "100%" }}
          >
            <source src={audioURL} type={selectedAudioFile?.type} />
            Your browser does not support the audio element.
          </audio>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "center" },
              marginTop: 4,
              gap: 4,
            }}
          >
            <Image
              src="/images/trashIcon.svg"
              alt="TrashIcon"
              width={30}
              height={30}
              onClick={handleDeleteAudioFile}
              style={{ cursor: "pointer" }}
            />
            <AudioTranscription
              selectedAudioFile={selectedAudioFile}
              selectedLanguage={selectedLanguage}
              onTranscriptionComplete={handleTranscriptionComplete}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 2,
          padding: 2,
          boxShadow: "none",
        }}
      >
        <TranscribeTextArea
          transcribedText={transcribedText}
          setTranscribedText={setTranscribedText}
        />

        <Box
          sx={{
            width: { xs: "100%", sm: "30%" },
            height: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <TextToSpeech
            selectedLanguage={selectedLanguage}
            transcribedText={transcribedText}
            setDownloadJobId={setDownloadJobId}
          />
        </Box>
      </Box>
      <DownloadJob downloadJobId={downloadJobId} />
    </Container>
  );
}
