let hoverBox = document.getElementById("hoverBox");
let modal = document.getElementById("modal");
let closeModal = document.getElementById("closeModalButton");

hoverBox.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
