import '../styles/main.css'
import Slider from './components/slider'

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('[data-slider]').forEach(s => {
		let slider = new Slider(s)
	})
})
