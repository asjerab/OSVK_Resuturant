/* let hoverBox = document.getElementById("hoverBox"); */
let modal = document.getElementById("modal");
let closeModal = document.getElementById("closeModalButton");

/* hoverBox.addEventListener("click", () => {
  modal.style.display = "flex";
}); */

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
// Funksjon for å laste inn restauranter
function loadRestaurants() {
  fetch('/api/restaurants')
    .then(response => response.json())
    .then(restaurants => {
      const cardsContainer = document.getElementById('cards');
      cardsContainer.innerHTML = ''; 
      
      restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'border-3 border-[#EEE] py-5 px-5 rounded-[16px] flex gap-5 hover:scale-95 duration-150 ease-in-out';
        card.setAttribute('data-restaurant-id', restaurant.id);
        
        card.innerHTML += `
          <img
            src="./images/Rectangle 3.png"
            class="w-full max-w-[80px] h-[80px]"
            alt="${restaurant.name}"
          />
          <div class="flex items-center justify-between w-full">
            <div>
              <h1 class="text-[18px] Primary">${restaurant.resturantNavn}</h1>
              <p class="Primary text-[12px] text-[#4E4E4E]">
                ${restaurant.adresse}
              </p>
            </div>
            <div class="w-fit flex flex-col gap-1">
              <p class="Primary flex justify-end">Åpner kl: ${restaurant.resturantTider}</p>
              <div class="flex items-center">
                ${generateStarRating(restaurant.rating)}
              </div>
              <p class="flex justify-end Primary text-[#4E4E4E]">${getPriceLevel(restaurant.price_level)}</p>
            </div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          showRestaurantModal(restaurant);
        });
        
        cardsContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Feil ved henting av restauranter:', error));
}

function generateStarRating(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += `
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
          <path d="M8.63641 0.499001C8.67871 0.395832 8.75074 0.307576 8.84333 0.24546C8.93593 0.183345 9.04491 0.150177 9.15641 0.150177C9.26792 0.150177 9.3769 0.183345 9.46949 0.24546C9.56209 0.307576 9.63412 0.395832 9.67641 0.499001L11.8014 5.61C11.8412 5.70564 11.9066 5.78844 11.9904 5.84931C12.0742 5.91018 12.1732 5.94675 12.2764 5.955L17.7944 6.397C18.2934 6.437 18.4954 7.06 18.1154 7.385L13.9114 10.987C13.8329 11.0542 13.7743 11.1417 13.7422 11.24C13.7101 11.3382 13.7057 11.4434 13.7294 11.544L15.0144 16.929C15.0402 17.037 15.0335 17.1503 14.995 17.2545C14.9565 17.3587 14.8879 17.4491 14.798 17.5144C14.7082 17.5797 14.601 17.6169 14.49 17.6212C14.379 17.6256 14.2692 17.597 14.1744 17.539L9.44941 14.654C9.36119 14.6001 9.2598 14.5716 9.15641 14.5716C9.05303 14.5716 8.95164 14.6001 8.86341 14.654L4.13841 17.54C4.04367 17.598 3.93387 17.6266 3.82287 17.6222C3.71187 17.6179 3.60466 17.5807 3.51478 17.5154C3.4249 17.4501 3.35638 17.3597 3.31787 17.2555C3.27936 17.1513 3.27259 17.038 3.29841 16.93L4.58341 11.544C4.60724 11.4434 4.60286 11.3382 4.57075 11.2399C4.53864 11.1416 4.48005 11.0541 4.40141 10.987L0.197414 7.385C0.112757 7.31284 0.0514208 7.21717 0.0211737 7.11012C-0.00907338 7.00307 -0.00687058 6.88945 0.027503 6.78365C0.0618766 6.67785 0.126875 6.58464 0.214265 6.51581C0.301656 6.44698 0.407507 6.40563 0.518414 6.397L6.03641 5.955C6.13966 5.94675 6.23864 5.91018 6.32244 5.84931C6.40625 5.78844 6.47164 5.70564 6.51141 5.61L8.63641 0.499001Z" fill="#F9DC5C"/>
        </svg>
      `;
    } else {
      stars += `
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
          <path d="M8.63641 0.499001C8.67871 0.395832 8.75074 0.307576 8.84333 0.24546C8.93593 0.183345 9.04491 0.150177 9.15641 0.150177C9.26792 0.150177 9.3769 0.183345 9.46949 0.24546C9.56209 0.307576 9.63412 0.395832 9.67641 0.499001L11.8014 5.61C11.8412 5.70564 11.9066 5.78844 11.9904 5.84931C12.0742 5.91018 12.1732 5.94675 12.2764 5.955L17.7944 6.397C18.2934 6.437 18.4954 7.06 18.1154 7.385L13.9114 10.987C13.8329 11.0542 13.7743 11.1417 13.7422 11.24C13.7101 11.3382 13.7057 11.4434 13.7294 11.544L15.0144 16.929C15.0402 17.037 15.0335 17.1503 14.995 17.2545C14.9565 17.3587 14.8879 17.4491 14.798 17.5144C14.7082 17.5797 14.601 17.6169 14.49 17.6212C14.379 17.6256 14.2692 17.597 14.1744 17.539L9.44941 14.654C9.36119 14.6001 9.2598 14.5716 9.15641 14.5716C9.05303 14.5716 8.95164 14.6001 8.86341 14.654L4.13841 17.54C4.04367 17.598 3.93387 17.6266 3.82287 17.6222C3.71187 17.6179 3.60466 17.5807 3.51478 17.5154C3.4249 17.4501 3.35638 17.3597 3.31787 17.2555C3.27936 17.1513 3.27259 17.038 3.29841 16.93L4.58341 11.544C4.60724 11.4434 4.60286 11.3382 4.57075 11.2399C4.53864 11.1416 4.48005 11.0541 4.40141 10.987L0.197414 7.385C0.112757 7.31284 0.0514208 7.21717 0.0211737 7.11012C-0.00907338 7.00307 -0.00687058 6.88945 0.027503 6.78365C0.0618766 6.67785 0.126875 6.58464 0.214265 6.51581C0.301656 6.44698 0.407507 6.40563 0.518414 6.397L6.03641 5.955C6.13966 5.94675 6.23864 5.91018 6.32244 5.84931C6.40625 5.78844 6.47164 5.70564 6.51141 5.61L8.63641 0.499001Z" fill="#EEEEEE"/>
        </svg>
      `;
    }
  }
  
  return stars;
}

function getPriceLevel(level) {
  switch(level) {
    case 1: return '$';
    case 2: return '$$';
    case 3: return '$$$';
    default: return '$';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  let hoverBox = document.getElementById("hoverBox");
  let modal = document.getElementById("modal");
  let closeModal = document.getElementById("closeModalButton");

  if (hoverBox) {
    hoverBox.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  loadRestaurants();
});
  
