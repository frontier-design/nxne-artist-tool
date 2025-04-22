document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";
  overlay.classList.add("popup-overlay");

  const popup = document.createElement("div");
  popup.id = "popupContainer";
  popup.classList.add("popup-container");

  const closeBtn = document.createElement("button");
  closeBtn.id = "popupCloseBtn";
  closeBtn.classList.add("popup-close-btn");
  closeBtn.innerText = "←";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  const logo = document.createElement("img");
  logo.id = "nxneLogo";
  logo.classList.add("nxne-logo");
  logo.src = "./images/nxne30Black.svg";
  logo.alt = "NXNE Logo";

  const sentence1 = document.createElement("p");
  sentence1.classList.add("popup-sentence");
  sentence1.classList.add("first-sentence");
  sentence1.innerHTML =
    "Welcome to NXNE 2025! We look forward to helping you put on an amazing show and ensuring you play a packed house.";

  const sentence2 = document.createElement("p");
  sentence2.classList.add("popup-sentence");
  sentence2.innerHTML =
    "This tool was created to help artists like yourself easily develop social assets to share with your fans. <span>It uses your music and photos to create unique graphics that bring the experience of your music to life.</span>";

  const sentence3 = document.createElement("p");
  sentence3.classList.add("popup-sentence");
  sentence3.innerHTML =
    "We encourage you to use this tool to create social posts to promote your NXNE show. This tool will remain live until the end of NXNE 2025, so we hope you use it many times leading up to NXNE!";

  popup.appendChild(closeBtn);
  popup.appendChild(logo);
  popup.appendChild(sentence1);
  popup.appendChild(sentence2);
  popup.appendChild(sentence3);

  overlay.appendChild(popup);

  document.body.appendChild(overlay);
});
