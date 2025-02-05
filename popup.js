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
  sentence1.innerText =
    "Welcome to NXNE 2025! We look forward to helping you put on an amazing show and ensure you play a packed out.";

  const sentence2 = document.createElement("p");
  sentence2.classList.add("popup-sentence");
  sentence2.innerText =
    "This tool was created to help artists like yourself easily develop social assets to share with your fans. It uses your music and photos to create unique graphics that bring the experience of your music to life.";

  const sentence3 = document.createElement("p");
  sentence3.classList.add("popup-sentence");
  sentence3.innerText =
    "We encourage you to use this tool to create social posts to promote your NXNE show. This tool will remain live until the end of NXNE 2025, so we hope you use it many times leading up to NXNE!";

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
