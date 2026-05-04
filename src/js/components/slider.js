class Slider {
  sliderContainer;
  constructor(el, options = {}) {
    this.options = {
      showInfo: options.showInfo ?? false,
      autoPlay: options.autoPlay ?? false,
      pagination: options.pagination ?? false,
      slideToShow: options.slideToShow ?? 1,
      noTransformUp: options.noTransformUp ?? false,
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
    this.resizeTimerId = null;
    this.slideWidth = 0;

    this.init();
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());
    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  getLengthSlides() {
    return this.slides.length;
  }

  get maxIndex() {
    return Math.ceil(this.slides.length / this.options.slideToShow, 0) - 1;
  }

  init() {
    this.bindEvents();
    this.breakpointsCheck();
    this.updateNoTransformClass();
    if (this.options.pagination) {
      this.generatePagination();
    }
    if (this.options.autoPlay) {
      this.autoPlayInit();
    }
    this.update();
  }

  calculateSlideWidth() {
    if (!this.sliderContainer) return 0;
    return this.sliderContainer.clientWidth / this.options.slideToShow;
  }

  updateNoTransformClass() {
    if (!this.track || !this.options.noTransformUp) return;
    const shouldAddNoTransformClass =
      window.innerWidth > this.options.noTransformUp;
    this.track.classList.toggle("no-transform", shouldAddNoTransformClass);
  }

  breakpointsCheck() {
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

  handleResize(e) {
    this.breakpointsCheck();
    this.updateNoTransformClass();
    clearTimeout(this.resizeTimerId);
    this.resizeTimerId = setTimeout(() => {
      this.update(false);
    }, 100);
  }

  update(withUpdateUI = true) {
    if (!this.track) return;
    this.slideWidth = this.calculateSlideWidth();
    const pageWidth = this.slideWidth * this.options.slideToShow;
    const offset = -(this.currentIndex * pageWidth);
    this.track.style.transform = `translate3d(${offset}px, 0, 0)`;
    this.slides.forEach((s) => {
      s.style.flex = `0 0 ${this.slideWidth}px`;
    });
    if (withUpdateUI) {
      this.updateUI();
      return;
    }
    requestAnimationFrame(() => this.updateUI());
  }

  prev() {
    if (this.currentIndex !== 0) {
      this.currentIndex--;
    }
    this.update();
  }

  next() {
    console.log(this.maxIndex);
    this.currentIndex =
      this.currentIndex >= this.maxIndex
        ? this.currentIndex
        : this.currentIndex + 1;
    this.update();
  }

  generatePagination() {
    this.slides.forEach((i, index) => {
      const paginationItem = document.createElement("button");
      paginationItem.classList.add("slider-pagination__item");
      this.pagination?.append(paginationItem);
    });
    this.updateUI();
  }

  updateUI() {
    if (this.options.pagination && this.pagination) {
      Array.from(this.pagination.children).forEach((paginationItem, index) => {
        if (index !== this.currentIndex) {
          paginationItem.classList.add("slider-pagination__item--active");
        } else {
          paginationItem.classList.remove("slider-pagination__item--active");
        }
      });
    }
    if (this.options.showInfo && this.info) {
      const totalSlides = this.getLengthSlides();
      const visibleSlides = Math.min(
        (this.currentIndex + 1) * this.options.slideToShow,
        totalSlides,
      );
      this.info.textContent = `${visibleSlides} / ${totalSlides}`;
    }
    const isAtStart = this.currentIndex <= 0;
    const isAtEnd = this.currentIndex >= this.maxIndex;
    if (this.prevBtn) this.prevBtn.disabled = isAtStart;
    if (this.nextBtn) this.nextBtn.disabled = isAtEnd;
  }

  autoPlayInit() {
    this.autoPlayTimerId = setInterval(() => {
      this.currentIndex =
        this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
      this.update();
    }, this.options.autoPlay);
  }
}

export default Slider;
