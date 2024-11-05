"use client";
import { Box } from "@mui/material";
import AudioUpload from "./components/AudioUpload";
import LanguageDropdown from "./components/LanguageDropdown";
import DragAndDrop from "./components/DragAndDrop";
import { useRef, useState } from "react";
import AudioTranscription from "./components/AudioTranscription";
import TranscribeTextArea from "./components/TranscribeTextarea";
import TextToSpeech from "./components/TextToSpeech";
import DownloadJob from "./components/DownloadJob";
import {
  ContainerStyled,
  InputBoxStyled,
  TranscribeContainer,
  DragAndDropStyled,
  AudioControlContainer,
  TextToSpeechContainer,
  TTSButtonContainerStyled,
  ImageStyled,
} from "./components/StyledComponents";

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
    <ContainerStyled>
      <InputBoxStyled>
        <AudioUpload onAudioFileChange={handleAudioFileChange} />
        <LanguageDropdown onLanguageChange={handleLanguageChange} />
      </InputBoxStyled>

      <TranscribeContainer>
        <DragAndDropStyled>
          <DragAndDrop
            onAudioFileChange={handleAudioFileChange}
            audioFile={selectedAudioFile}
          />
        </DragAndDropStyled>
        <AudioControlContainer>
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
            <ImageStyled
              src="/images/trashIcon.svg"
              alt="TrashIcon"
              width={30}
              height={30}
              onClick={handleDeleteAudioFile}
            />
            <AudioTranscription
              onAudioFileChange={handleAudioFileChange}
              selectedAudioFile={selectedAudioFile}
              selectedLanguage={selectedLanguage}
              onTranscriptionComplete={handleTranscriptionComplete}
            />
          </Box>
        </AudioControlContainer>
      </TranscribeContainer>

      <TextToSpeechContainer>
        <TranscribeTextArea
          transcribedText={transcribedText}
          setTranscribedText={setTranscribedText}
        />

        <TTSButtonContainerStyled>
          <TextToSpeech
            selectedLanguage={selectedLanguage}
            transcribedText={transcribedText}
            setDownloadJobId={setDownloadJobId}
          />
        </TTSButtonContainerStyled>
      </TextToSpeechContainer>
      <DownloadJob downloadJobId={downloadJobId} />
    </ContainerStyled>
  );
}
