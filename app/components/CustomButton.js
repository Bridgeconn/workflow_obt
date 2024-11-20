import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ children, onClick = () => {}, ...props }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        backgroundColor: "#333",
        color: "white",
        '&:hover': {
          backgroundColor: "#444"
        },
        padding: "6px 16px",
        textTransform: "none",
        fontSize: "18px",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;


// import { Button } from "@mui/material";
// import { styled } from '@mui/material/styles';

// const CustomButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "blue",
//   color: "black",
//   padding: theme.spacing(1, 3),
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//   fontWeight: "bold",
//   textTransform: "none", // Prevents uppercase transformation
//   "&:hover": {
//     backgroundColor: "grey",
//     boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
//   },
//   "&:disabled": {
//     backgroundColor: "grey",
//     color: "black",
//   },
// }));

// export default CustomButton;
