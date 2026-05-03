class Slider {
	sliderContainer
	constructor(el, options = {}) {
		this.sliderContainer = el
		this.slides = Array.from(
			this.sliderContainer.querySelectorAll('.slider__item')
		)
		this.track = this.sliderContainer.querySelector('.slider__track')
		this.prevBtn = this.sliderContainer.querySelector('.slider__prev')
		this.nextBtn = this.sliderContainer.querySelector('.slider__next')
		this.currentIndex = 0
		this.showSlides = 3
		this.update()
		this.bindEvents()
	}

	bindEvents() {
		this.prevBtn.addEventListener('click', () => this.prev())
		this.nextBtn.addEventListener('click', () => this.next())
	}

	update() {
		if (!this.track) return
		const offset = -(this.currentIndex * 100)
		this.track.style.transform = `translateX(${offset}%)`
		this.slides.forEach(s => {
			s.style.flex = `1 0 ${100 / this.showSlides}%`
		})
	}

	prev() {
		if (this.currentIndex === 0) return
		this.currentIndex--
		this.update()
	}

	next() {
		this.currentIndex =
			this.currentIndex + 1 * this.showSlides >= this.slides.length - 1
				? 0
				: this.currentIndex + 1
		this.update()
	}
}

export default Slider
