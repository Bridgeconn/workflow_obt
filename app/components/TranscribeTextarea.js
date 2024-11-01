import { Box, TextField } from "@mui/material";

const TranscribeTextArea = ({ transcribedText, setTranscribedText }) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "50%" },
        padding: 2,
      }}
    >
      <TextField
        multiline
        rows={8}
        fullWidth
        sx={{
            backgroundColor: "white"
        }}
        variant="outlined"
        label="Transcribed Text"
        value={transcribedText}
        onChange={(e) => setTranscribedText(e.target.value)}
      />
    </Box>
  );
};

export default TranscribeTextArea;
