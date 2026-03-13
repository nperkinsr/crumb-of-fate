let prediction = null;
let predictions = [];
let spinnerEl = null;
let luckyHeading = null;
let luckyNumbersEl = null;
let localizedCopy = {};

const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = new Set(["en", "es"]);

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});

async function initializePage() {
  prediction = document.getElementById("fortune-prediction");
  spinnerEl = document.getElementById("spinner");
  luckyHeading = document.getElementById("lucky-heading");
  luckyNumbersEl = document.getElementById("lucky-numbers");

  try {
    const locale = detectLocale();
    const translations = await loadTranslations();

    localizedCopy = translations[locale] || translations[DEFAULT_LOCALE];
    applyLocalizedCopy(locale);

    predictions = await loadPredictions(localizedCopy.predictionsFile);
    showSpinner();

    setTimeout(showResults, 1000);
  } catch (error) {
    console.error("Failed to initialize page:", error);
    renderLoadError();
  }
}

function detectLocale() {
  const browserLocale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    DEFAULT_LOCALE;
  const normalizedLocale = browserLocale.toLowerCase().split("-")[0];

  return SUPPORTED_LOCALES.has(normalizedLocale)
    ? normalizedLocale
    : DEFAULT_LOCALE;
}

async function loadTranslations() {
  const response = await fetch("translations.json");

  if (!response.ok) {
    throw new Error(`Translations request failed: ${response.status}`);
  }

  return response.json();
}

async function loadPredictions(fileName) {
  const response = await fetch(fileName);

  if (!response.ok) {
    throw new Error(`Predictions request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.predictions || [];
}

function applyLocalizedCopy(locale) {
  document.documentElement.lang = locale;

  document.getElementById("page-heading").textContent = localizedCopy.heading;
  document.getElementById("page-subheading").textContent =
    localizedCopy.subheading;
  document.getElementById("page-closing").textContent = localizedCopy.closing;
  document.getElementById("page-footer").textContent = localizedCopy.footer;
  luckyHeading.textContent = localizedCopy.luckyNumbersLabel;
}

function renderLoadError() {
  if (spinnerEl) {
    spinnerEl.style.display = "none";
  }

  if (prediction) {
    prediction.textContent = "Unable to load today's fortune.";
    prediction.style.display = "block";
  }

  if (luckyHeading) {
    luckyHeading.style.display = "none";
  }

  if (luckyNumbersEl) {
    luckyNumbersEl.style.display = "none";
  }
}

function getRandomItemFromList(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function createRandomPrediction() {
  const randomPrediction = getRandomItemFromList(predictions);
  return `<span class="warning-text">${randomPrediction}</span>`;
}

function showSpinner() {
  if (spinnerEl) {
    spinnerEl.style.display = "inline-block";
  }

  if (prediction) {
    prediction.style.display = "none";
  }

  if (luckyHeading) {
    luckyHeading.style.display = "none";
  }

  if (luckyNumbersEl) {
    luckyNumbersEl.style.display = "none";
  }
}

function showResults() {
  if (!prediction || !luckyNumbersEl || predictions.length === 0) {
    console.warn("Missing data for results; aborting showResults");
    return;
  }

  if (spinnerEl) {
    spinnerEl.style.display = "none";
  }

  prediction.innerHTML = createRandomPrediction();

  const luckyNumbers = generateLuckyNumbers();
  luckyNumbersEl.innerHTML = `<span class="lucky-number-text">${luckyNumbers.join(", ")}</span>`;

  prediction.style.display = "block";

  if (luckyHeading) {
    luckyHeading.style.display = "block";
  }

  luckyNumbersEl.style.display = "block";

  setTimeout(() => {
    const warningText = prediction.querySelector(".warning-text");
    if (warningText) {
      warningText.classList.add("fade-in");
    }

    const luckyNumberText = luckyNumbersEl.querySelector(".lucky-number-text");
    if (luckyNumberText) {
      luckyNumberText.classList.add("fade-in");
    }
  }, 0);
}

function generateLuckyNumbers() {
  const numbers = new Set();

  while (numbers.size < 5) {
    const num = Math.floor(Math.random() * 50) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}
