let currentPriceFilter = 0; // 0 betyr vis alle, 1 betyr vis $, 2 betyr vis $$ & 3 betyr vis $$$

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starHTML += '<span class="star">★</span>';
  }
  if (halfStar) {
    starHTML += '<span class="star">½</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starHTML += '<span class="star empty">☆</span>';
  }
  return starHTML;
}

function getPriceLevel(level) {
  switch (level) {
    case 1:
      return "$";
    case 2:
      return "$$";
    case 3:
      return "$$$";
    default:
      return "$";
  }
}

function loadRestaurants() {
  fetch("/api/restaurants")
    .then((response) => response.json())
    .then((restaurants) => {
      const cardsContainer = document.getElementById("cards");
      cardsContainer.innerHTML = "";

      restaurants.forEach((restaurant) => {
        // Use priceRange instead of price_level
        const restaurantPriceLevel = restaurant.priceRange || 1;
        // Improved filtering logic
        if (
          currentPriceFilter === 0 ||
          restaurantPriceLevel === currentPriceFilter
        ) {
          const card = document.createElement("div");
          card.className =
            "border-3 border-[#EEE] py-5 px-5 rounded-[16px] cursor-pointer flex gap-5 hover:scale-95 duration-150 ease-in-out";
          card.setAttribute("data-restaurant-id", restaurant.id);

          card.innerHTML += `
            <img
              src="./images/Rectangle 3.png"
              class="w-full max-w-[80px] h-[80px]"
              alt="${restaurant.resturantNavn}"
            />
            <div class="flex items-center justify-between w-full">
              <div>
                <h1 class="text-[18px] Primary">${restaurant.resturantNavn}</h1>
                <p class="Primary text-[12px] text-[#4E4E4E]">
                  ${restaurant.adresse}
                </p>
              </div>
              <div class="w-fit flex flex-col gap-1">
                <p class="Primary flex justify-end">Åpner kl: ${restaurant.resturantTider
            }</p>
                <div class="flex items-center">
                  ${generateStarRating(restaurant.rating || 3)}
                </div>
                <p class="flex justify-end Primary text-[#4E4E4E]">${getPriceLevel(
              restaurantPriceLevel
            )}</p>
              </div>
            </div>
          `;

          card.addEventListener("click", () => {
            showRestaurantModal(restaurant, restaurant.ID);
          });

          cardsContainer.appendChild(card);
        }
      });
    })
    .catch((error) =>
      console.error("Feil ved henting av restauranter:", error)
    );
}

function showRestaurantModal(restaurant, resturantID) {
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("closeModalButton");
  
  // Sett restaurant-ID i det skjulte feltet
  const hiddenRestaurantIdInput = modal.querySelector("#restaurantId");
  hiddenRestaurantIdInput.value = resturantID;

  fetch("/api/reviews/" + resturantID)
    .then((response) => response.json())
    .then((reviews) => {
      let reviewHolder = document.getElementsByClassName("reviews")[0];
      reviewHolder.innerHTML = "";
      reviews.forEach((review) => {
        reviewHolder.innerHTML += `
          <span class="text-[18px] font-bold pt-[200px]">Antall stjerner: </span> 
          <h1 class="reviewStars border-2 border-[#EEE] p-1 px-3 my-3 rounded-full w-fit">${review.ReviewValue}</h1>
          <span class="text-[18px] font-bold">Beskrivelse: </span> 
          <h1 class="reviewDesc my-3">${review.ReviewDesc}</h1>
          <span class="text-[18px] font-bold">Anmeldelsesdato: </span> 
          <h1 class="reviewDate my-3">${review.ReviewDate}</h1>
          <span class="text-[18px] font-bold">Skrevet av: </span> 
          <h1 class="Reviewer pb-[25px]">${review.SubmitterName}</h1>
          <hr class="pt-[25px] opacity-50"/>
        `;
      });
    });

  // Oppdater modalinnholdet med restaurantinformasjon
  modal.querySelector("h1").textContent = restaurant.resturantNavn;

  // Vis modalen
  modal.style.display = "block";

  // Lukk modal når knappen klikkes
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Legg til en funksjon for å håndtere innsending av anmeldelsen
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // Forhindre standard innsending

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    console.log("Anmeldelse sendt:", result);
    // Lukk modalen etter innsending
    document.getElementById("modal").style.display = "none";
  })
  .catch(error => console.error("Feil ved innsending av anmeldelse:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  let filterButton = document.getElementById("filterButton");

  filterButton.addEventListener("click", () => {
    // Cycle through price filters: 0 (all) -> 1 ($) -> 2 ($$) -> 3 ($$$) -> back to 0
    currentPriceFilter = currentPriceFilter === 3 ? 0 : currentPriceFilter + 1;

    // Update button text
    switch (currentPriceFilter) {
      case 0:
        filterButton.textContent = "All";
        break;
      case 1:
        filterButton.textContent = "$";
        break;
      case 2:
        filterButton.textContent = "$$";
        break;
      case 3:
        filterButton.textContent = "$$$";
        break;
    }

    loadRestaurants();
  });

  loadRestaurants();
});


document.getElementById("Sokefelt").addEventListener("input", (event) => {
  let text = event.target.value
  fetch("/api/restaurants")
    .then((response) => response.json())
    .then((restaurants) => {
      const cardsContainer = document.getElementById("cards");
      cardsContainer.innerHTML = "";

      restaurants.forEach((restaurant) => {
        if (restaurant.resturantNavn.toUpperCase().includes(text.toUpperCase())) {
          
        } else {
          return
        }
        // Use priceRange instead of price_level
        const restaurantPriceLevel = restaurant.priceRange || 1;
        // Improved filtering logic
        if (
          currentPriceFilter === 0 ||
          restaurantPriceLevel === currentPriceFilter
        ) {
          const card = document.createElement("div");
          card.className =
            "border-3 border-[#EEE] py-5 px-5 rounded-[16px] cursor-pointer flex gap-5 hover:scale-95 duration-150 ease-in-out";
          card.setAttribute("data-restaurant-id", restaurant.id);

          card.innerHTML += `
          <img
            src="./images/Rectangle 3.png"
            class="w-full max-w-[80px] h-[80px]"
            alt="${restaurant.resturantNavn}"
          />
          <div class="flex items-center justify-between w-full">
            <div>
              <h1 class="text-[18px] Primary">${restaurant.resturantNavn}</h1>
              <p class="Primary text-[12px] text-[#4E4E4E]">
                ${restaurant.adresse}
              </p>
            </div>
            <div class="w-fit flex flex-col gap-1">
              <p class="Primary flex justify-end">Åpner kl: ${restaurant.resturantTider
            }</p>
              <div class="flex items-center">
                ${generateStarRating(restaurant.rating || 3)}
              </div>
              <p class="flex justify-end Primary text-[#4E4E4E]">${getPriceLevel(
              restaurantPriceLevel
            )}</p>
            </div>
          </div>
        `;

          card.addEventListener("click", () => {
            showRestaurantModal(restaurant, restaurant.ID);
          });

          cardsContainer.appendChild(card);
        }
      });
    })


})