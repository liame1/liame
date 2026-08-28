const dialog = document.querySelector(".dialog-container");


const images = document.querySelectorAll(".preview-img img");
const modals = document.querySelectorAll(".dialog-container dialog");

images.forEach((img, index) => {
    const modal = modals[index];
    img.addEventListener("click", () => 
        modal.showModal(dialog.style.display = "inherit"));

    modal.addEventListener("click", (event) => {
        // Close only if clicking outside the image or h3
        if (!event.target.closest("img") && !event.target.closest("h3")) {
            modal.close();
            dialog.style.display = "none";
        }
    });
});
