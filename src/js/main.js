import "../styles/main.css";
import Slider from "./components/slider";

document.addEventListener("DOMContentLoaded", () => {
  const stagesSliderContainer = document.getElementById("stages-slider");
  const participantsSliderContainer = document.getElementById(
    "participants-slider",
  );
  const sliderStages = new Slider(stagesSliderContainer, {
    pagination: true,
    disableTransformWidth: 768,
  });
  const participantStages = new Slider(participantsSliderContainer, {
    autoPlay: 4000,
    pagination: false,
    slideToShow: 3,
    showInfo: true,
    breakpoints: {
      992: {
        slideToShow: 2,
      },
      768: {
        slideToShow: 1,
      },
    },
  });
});
