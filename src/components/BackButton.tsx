import { Box, Typography } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  function handleBack() {
    navigate("/");
  }

  return (
    <Box
      sx={{
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2,
        // border: "1px solid gray",
        // borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2,
        width: "fit-content",
        cursor: "pointer",
      }}
      onClick={() => handleBack()}
    >
      <WestIcon sx={{ fontSize: "30px" }} color="secondary" />
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Back
      </Typography>
    </Box>
  );
};

export default BackButton;
