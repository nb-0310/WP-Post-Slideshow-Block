import { Icon, category, tag, postAuthor } from '@wordpress/icons';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    const slideshowBlocks = document.querySelectorAll('.slideshow-block');

    slideshowBlocks.forEach((block) => {
        const slidesContainer = block.querySelector('.slides');
        const slides = block.querySelectorAll('.slide');
        const itemsInView = parseInt(block.dataset.itemsInView || 1, 10);
        const autoPlay = block.dataset.autoplay === 'true';
        let currentIndex = 0;

		const slideImage = block.querySelector('.slide-image');
		const imageCoordinates = slideImage.getBoundingClientRect();
        const controls = block.querySelector('.controls');
        const prevButton = block.querySelector('.prev-btn');
        const nextButton = block.querySelector('.next-btn');

		const categoryIcons = document.querySelectorAll('.category');
		if (categoryIcons) {
			console.log('in category')
			categoryIcons.forEach((icon) => {
				icon.style.setProperty('--before-content', 'none');
				ReactDOM.render(<Icon icon={category} />, icon);
			})
		}

		const tagIcons = document.querySelectorAll('.tag');
		if (tagIcons) {
			tagIcons.forEach((icon) => {
				icon.style.setProperty('--before-content', 'none');
				ReactDOM.render(<Icon icon={tag} />, icon);
			})
		}

		const authorIcons = document.querySelectorAll('.businessperson');
		if (authorIcons) {
			authorIcons.forEach((icon) => {
				icon.style.setProperty('--before-content', 'none');
				ReactDOM.render(<Icon icon={postAuthor} />, icon);
			})
		}

        if (controls) {
			controls.style.top = `${imageCoordinates.height}`;
            controls.style.top = `${imageCoordinates.height / 2}px`;
        }

        const moveSlides = () => {
            const translateXValue = -((currentIndex * 100) / itemsInView);
            slidesContainer.style.transform = `translateX(${translateXValue}%)`;
        };

        const goToNext = () => {
            const maxIndex = Math.max(0, slides.length - itemsInView);
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            moveSlides();
        };

        const goToPrev = () => {
            const maxIndex = Math.max(0, slides.length - itemsInView);
            currentIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
            moveSlides();
        };

        const startAutoPlay = () => {
            if (autoPlay) {
                autoPlayInterval = setInterval(goToNext, 1200); // 1.2 seconds
            }
        };

        const stopAutoPlay = () => {
            if (autoPlay && autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        };

        startAutoPlay();

        if (nextButton) {
            nextButton.addEventListener('click', goToNext);
        }
        if (prevButton) {
            prevButton.addEventListener('click', goToPrev);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                goToPrev();
            } else if (event.key === 'ArrowRight') {
                goToNext();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        block.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            stopAutoPlay();
        });

        block.addEventListener('touchmove', (event) => {
            touchEndX = event.touches[0].clientX;
        });

        block.addEventListener('touchend', () => {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (swipeDistance > swipeThreshold) {
                goToPrev();
            } else if (swipeDistance < -swipeThreshold) {
                goToNext();
            }

            startAutoPlay();
        });
    });
});
