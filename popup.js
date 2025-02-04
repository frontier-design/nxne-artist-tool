document.addEventListener("DOMContentLoaded", function () {
  // Create the overlay
  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";
  overlay.classList.add("popup-overlay");

  // Create the popup container
  const popup = document.createElement("div");
  popup.id = "popupContainer";
  popup.classList.add("popup-container");

  // Create the close button
  const closeBtn = document.createElement("button");
  closeBtn.id = "popupCloseBtn";
  closeBtn.classList.add("popup-close-btn");
  closeBtn.innerText = "←";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Create the NXNE logo image
  const logo = document.createElement("img");
  logo.id = "nxneLogo";
  logo.classList.add("nxne-logo");
  logo.src = "./images/faviconBlack.svg"; // Adjust the path as needed
  logo.alt = "NXNE Logo";

  // Create the sentences
  const sentence1 = document.createElement("p");
  sentence1.classList.add("popup-sentence");
  sentence1.innerText = "Welcome to the NXNE Artist Tool.";

  const sentence2 = document.createElement("p");
  sentence2.classList.add("popup-sentence");
  sentence2.innerText = "Customize your post blah blah blah";

  const sentence3 = document.createElement("p");
  sentence3.classList.add("popup-sentence");
  sentence3.innerText = "Click ( ← ) to get started.";

  // Append the elements to the popup container
  popup.appendChild(closeBtn);
  popup.appendChild(logo);
  popup.appendChild(sentence1);
  popup.appendChild(sentence2);
  popup.appendChild(sentence3);

  // Append the popup container to the overlay
  overlay.appendChild(popup);

  // Append the overlay to the body
  document.body.appendChild(overlay);
});
