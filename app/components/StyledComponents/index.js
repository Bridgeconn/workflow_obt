import { styled } from '@mui/material/styles';
import { Container, Box } from "@mui/material";
import Image from "next/image";

// Styled Container
const ContainerStyled = styled(Container)(({ theme }) => ({
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
}));

const InputBoxStyled = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(2),
  boxShadow: "none",
  [theme.breakpoints.up('sm')]: {
    flexDirection: "row",
    gap: theme.spacing(8),
  },
}));

const TranscribeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(2),
  boxShadow: "none",
  background: "#DCDADA80",
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    flexDirection: "row",
    marginTop: theme.spacing(4),
  },
}));

const DragAndDropStyled = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  height: "200px",
  [theme.breakpoints.up('sm')]: {
    width: "50%",
  },
}));

const AudioControlContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: "30%",
  },
}));

const TextToSpeechContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: "none",
  [theme.breakpoints.up('sm')]: {
    flexDirection: "row",
  },
}));

const TTSButtonContainerStyled = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    width: "30%",
  },
}));

const ImageStyled = styled(Image)(({ theme }) => ({
  cursor: "pointer",
}));

export {
  ContainerStyled,
  InputBoxStyled,
  TranscribeContainer,
  DragAndDropStyled,
  AudioControlContainer,
  TextToSpeechContainer,
  TTSButtonContainerStyled,
  ImageStyled,
};
