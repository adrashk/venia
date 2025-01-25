/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const apiUrl = 'http://localhost:3000/query-index.json';

  // Make a GET request
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const carouselData = data.data;
      let chunkSize;
      if (window.innerWidth < 600) {
        chunkSize = Math.ceil(carouselData.length / 5);
      } else if (window.innerWidth <= 1024) {
        chunkSize = Math.ceil(carouselData.length / 3);
      } else {
        chunkSize = Math.ceil(carouselData.length / 2);
      }
      const slides = [];
      for (let i = 0; i < carouselData.length; i += chunkSize) {
        slides.push(carouselData.slice(i, i + chunkSize));
      }
      const carouselContainer = document.createElement('div');
      carouselContainer.classList.add('card-carousel-container');
      const currentSlide = 0;
      const dots = [];
      function createSlide(cardData) {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        cardData.forEach((card) => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');
          const image = document.createElement('img');
          image.src = card.image;
          const caption = document.createElement('p');
          caption.textContent = card.title;
          const price = document.createElement('p');
          price.textContent = card.price;
          const cardButton = document.createElement('button');
          cardButton.classList.add('card-btn');
          cardButton.textContent = 'ADD TO CART';
          cardElement.appendChild(image);
          cardElement.appendChild(caption);
          cardElement.appendChild(price);
          cardElement.appendChild(cardButton);
          slide.appendChild(cardElement);
        });
        return slide;
      }

      function showSlide(index) {
        const slideShow = carouselContainer.querySelectorAll('.slide');
        slideShow.forEach((slide, i) => {
          slide.style.display = 'none';
          dots[i].classList.remove('active');
        });
        slideShow[index].style.display = 'flex';
        dots[index].classList.add('active');
      }

      // Create and append slides
      slides.forEach((cardData) => {
        const slideElement = createSlide(cardData);
        carouselContainer.appendChild(slideElement);
      });

      // Create dots container and dots
      const dotsContainer = document.createElement('div');
      dotsContainer.classList.add('dots-container');
      for (let i = 0; i < slides.length; i += 1) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener(('click'), () => showSlide(i));
        dots.push(dot);
        dotsContainer.appendChild(dot);
      }
      showSlide(currentSlide);
      dots[currentSlide].classList.add('active');

      showSlide(currentSlide);
      block.append(carouselContainer);
      block.append(dotsContainer);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
