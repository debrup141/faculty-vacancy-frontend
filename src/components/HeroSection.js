import "../App.css";
import "./HeroSection.css";
import { Button, Typography } from "@mui/material";

const HeroSection = () => {
  return (
    <div className="hero-container">
      <video src="/videos/video-2.mp4" autoPlay loop muted />
      <Typography variant="h1" gutterBottom>
        WELCOME TO RECRUITEASY
      </Typography>
      <Typography variant="h2" gutterBottom>
        Vacancy Handling Made Easy
      </Typography>
      <div className="hero-btns">
        <Button variant="contained" className="solidbtn">
          LOGIN
        </Button>
        <Button variant="outlined" className="outbtn">
          SIGNUP
        </Button>
        {/*<Button variant="outlined" color="light">
          SIGNUP
        </Button> */}
      </div>
    </div>
  );
};

export default HeroSection;
