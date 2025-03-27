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
    starHTML += '<span class="star empty">★</span>';
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

      console.log("Current Price Filter:", currentPriceFilter);
      console.log("Restaurants:", restaurants);

      restaurants.forEach((restaurant) => {
        // Use priceRange instead of price_level
        const restaurantPriceLevel = restaurant.priceRange || 1;

        console.log(
          "Restaurant Price Level:",
          restaurantPriceLevel,
          "Type:",
          typeof restaurantPriceLevel
        );

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


  fetch("/api/reviews/" + resturantID)
    .then((response) => response.json())
    .then((reviews) => {
      let reviewHolder = document.getElementsByClassName("reviews")[0]
      reviews.forEach((review) => {
        reviewHolder.innerHTML += `
          <h1 class="reviewStars">${review.ReviewValue}</h1>
          <h1 class="reviewDesc">${review.ReviewDesc}</h1>
          <h1 class="reviewDate">${review.ReviewDate}}</h1>
          <h1 class="Reviewer">${review.SubmitterName}</h1>
        `
      })
    })

  // Oppdater modalinnholdet med restaurantinformasjon
  modal.querySelector("h1").textContent = restaurant.resturantNavn;
  // Legg til mer informasjon om restauranten her om nødvendig

  // Vis modalen
  modal.style.display = "block";

  // Lukk modal når knappen klikkes
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

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
