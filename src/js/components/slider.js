class Slider {
  sliderContainer;
  constructor(el, options = {}) {
    this.options = {
      showInfo: options.showInfo ?? false,
      autoPlay: Slider.normalizeAutoPlay(options.autoPlay),
      pagination: options.pagination ?? false,
      slideToShow: options.slideToShow ?? 1,
      breakpoints: options.breakpoints ?? {},
    };
    this.baseSlideToShow = this.options.slideToShow;

    this.sliderContainer = el;
    this.slides = Array.from(
      this.sliderContainer?.querySelectorAll(".slider__item"),
    );
    this.track = this.sliderContainer.querySelector(".slider__track");
    this.pagination = this.sliderContainer.querySelector(".slider-pagination");
    this.prevBtn = this.sliderContainer.querySelector(".slider__prev");
    this.nextBtn = this.sliderContainer.querySelector(".slider__next");
    this.info = this.sliderContainer.querySelector(".slider__info");
    this.currentIndex = 0;
    this.autoPlayTimerId = null;
    this.slideWidth = 0;
    this.resizeHandler = null;
    this.prevHandler = null;
    this.nextHandler = null;

    this.init();
  }

  static normalizeAutoPlay(value) {
    if (value === false) return false;
    if (value === true) return 3000;
    if (typeof value === "number" && value > 0) return value;
    return false;
  }

  static debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  bindEvents() {
    this.nextHandler = this.next.bind(this);
    this.prevHandler = this.prev.bind(this);
    if (this.prevBtn) this.prevBtn.addEventListener("click", this.prevHandler);
    if (this.nextBtn) this.nextBtn.addEventListener("click", this.nextHandler);
    this.resizeHandler = Slider.debounce(this.handleResize.bind(this), 100);
    window.addEventListener("resize", this.resizeHandler);
  }

  get lengthSlides() {
    return this.slides.length;
  }

  get maxIndex() {
    const pages = Math.ceil(this.lengthSlides / this.options.slideToShow);
    return Math.max(0, pages - 1);
  }

  get calculateSlideWidth() {
    return !this.sliderContainer
      ? 0
      : this.sliderContainer.clientWidth / this.options.slideToShow;
  }

  init() {
    if (!this.sliderContainer || !this.track || this.lengthSlides === 0) {
      console.warn("Slider: необходимые элементы не найдены");
      return;
    }
    this.bindEvents();
    this.applyBreakpoints();
    if (this.options.pagination) this.generatePagination();
    this.startAutoPlay();
    this.update();
  }

  applyBreakpoints() {
    const breakpoints = Object.entries(this.options.breakpoints)
      .map(([width, config]) => [Number(width), config])
      .filter(([width]) => Number.isFinite(width))
      .sort((a, b) => a[0] - b[0]);

    const matchedBreakpoint = breakpoints.find(
      ([width]) => window.innerWidth <= width,
    );

    const nextSlideToShow =
      matchedBreakpoint?.[1]?.slideToShow ?? this.baseSlideToShow;

    this.options.slideToShow = nextSlideToShow;
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  handleResize() {
    this.applyBreakpoints();
    this.update();
  }

  update() {
    if (!this.track) return;
    this.slideWidth = this.calculateSlideWidth;
    const pageWidth = this.slideWidth * this.options.slideToShow;
    const offset = -(this.currentIndex * pageWidth);

    const hasNoTransform = this.track.classList.contains("no-transform");
    if (!hasNoTransform) {
      this.track.style.transform = `translate3d(${offset}px, 0, 0)`;
    } else {
      this.track.style.transform = "";
    }

    this.slides.forEach((s) => {
      s.style.flex = `0 0 ${this.slideWidth}px`;
    });
    this.updateUI();
  }

  prev() {
    if (this.currentIndex !== 0) {
      this.currentIndex--;
      this.resetAutoPlay();
      this.update();
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex += 1;
      this.resetAutoPlay();
      this.update();
    }
  }

  generatePagination() {
    if (!this.pagination) {
      console.warn("Нет контейнера для пагинации .slider-pagination");
      return;
    }
    Array(this.maxIndex + 1)
      .fill()
      .forEach(() => {
        const paginationItem = document.createElement("li");
        paginationItem.classList.add("slider-pagination__item");
        this.pagination?.append(paginationItem);
      });
    this.updateUI();
  }

  updateUI() {
    this.updatePagination();
    this.updateInfo();
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex <= 0;
    if (this.nextBtn)
      this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

    if (this.maxIndex < 0) {
      this.prevBtn.disabled = true;
      this.nextBtn.disabled = true;
    }
  }

  updatePagination() {
    if (this.options.pagination && this.pagination) {
      for (let i = 0; i < this.maxIndex + 1; i++) {
        if (this.pagination.children[i]) {
          this.pagination.children[i].classList.toggle(
            "slider-pagination__item--active",
            i === this.currentIndex,
          );
        }
      }
    }
  }

  updateInfo() {
    if (this.options.showInfo && this.info) {
      const totalSlides = this.lengthSlides;
      const currentContainer = this.info.querySelector(".slider__info-current");
      const totalContainer = this.info.querySelector(".slider__info-total");
      const visibleSlides = Math.min(
        (this.currentIndex + 1) * this.options.slideToShow,
        totalSlides,
      );
      currentContainer.textContent = `${visibleSlides}`;
      totalContainer.textContent = ` / ${totalSlides}`;
    }
  }

  startAutoPlay() {
    if (this.options.autoPlay === false) return;
    if (this.autoPlayTimerId) clearInterval(this.autoPlayTimerId);
    this.autoPlayTimerId = setInterval(() => {
      const nextIndex =
        this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
      this.currentIndex = nextIndex;
      this.update();
    }, this.options.autoPlay);
  }

  stopAutoPlay() {
    if (this.autoPlayTimerId) {
      clearInterval(this.autoPlayTimerId);
      this.autoPlayTimerId = null;
    }
  }

  resetAutoPlay() {
    if (this.options.autoPlay !== false) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  destroy() {
    this.stopAutoPlay();

    if (this.prevBtn) this.prevBtn.removeEventListener("click", this.prev);
    if (this.nextBtn) this.nextBtn.removeEventListener("click", this.next);

    window.removeEventListener("resize", this.resizeHandler);

    if (this.track) {
      this.track.style.transform = "";
      this.track.classList.remove("no-transform");
    }
    this.slides.forEach((slide) => {
      slide.style.flex = "";
    });

    if (this.pagination) this.pagination.innerHTML = "";

    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }
}

export default Slider;
