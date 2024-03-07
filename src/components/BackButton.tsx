import { Box } from "@mui/material";
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
        paddingLeft: 3,
        paddingRight: 3,
        border: "1px solid gray",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        mb: 2,
      }}
    >
      <WestIcon
        sx={{ fontSize: "30px", cursor: "pointer" }}
        color="secondary"
        onClick={() => handleBack()}
      />
    </Box>
  );
};

export default BackButton;
