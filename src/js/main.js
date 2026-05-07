import "../styles/main.css";
import Slider from "./components/slider";

document.addEventListener("DOMContentLoaded", () => {
  const stagesSliderContainer = document.getElementById("stages-slider");
  const participantsSliderContainer = document.getElementById(
    "participants-slider",
  );
  let sliderStages = null;
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

  const initStagesSlider = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !sliderStages) {
      sliderStages = new Slider(stagesSliderContainer, {
        pagination: true,
      });
    } else if (!isMobile && sliderStages) {
      sliderStages.destroy();
      sliderStages = null;
    }
  };

  const handleResize = () => {
    initStagesSlider();
  };

  const debouncedResize = Slider.debounce(handleResize, 100);
  window.addEventListener("resize", debouncedResize);

  initStagesSlider();
});
