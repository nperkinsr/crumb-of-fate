document.addEventListener("DOMContentLoaded", () => {
  // start data load and show spinner immediately
  loadpredictions();
});

let prediction = null;
let predictions = [];
let spinnerEl = null;
let luckyHeading = null;
let luckyNumbersEl = null;

/////////////////////////////////////////////////////
//////////       DATA LOADING       /////////////
/////////////////////////////////////////////////////

function loadpredictions() {
  fetch("predictions.json")
    .then((response) => response.json())
    .then((data) => {
      predictions = data.predictions || [];
      // grab references needed for display logic
      prediction = document.getElementById("fortune-prediction");
      spinnerEl = document.getElementById("spinner");
      luckyHeading = document.getElementById("lucky-heading");
      luckyNumbersEl = document.getElementById("lucky-numbers");

      // start with spinner only, everything else hidden in CSS
      showSpinner();

      // after one second swap out spinner for the results
      setTimeout(showResults, 1000);
    })
    .catch((error) => {
      console.error("Failed to load predictions:", error);
    });
}

/////////////////////////////////////////////////////
//////////       UTILITIES       /////////////
/////////////////////////////////////////////////////

function getRandomItemFromList(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function createRandomPrediction() {
  const prediction = getRandomItemFromList(predictions);
  return `<span class="warning-text">${prediction}</span>`;
}

/////////////////////////////////////////////////////
//////////       PREDICTION DISPLAY       /////////////
/////////////////////////////////////////////////////

// display spinner and keep other sections hidden
function showSpinner() {
  if (spinnerEl) {
    spinnerEl.style.display = "inline-block";
  }
  if (prediction) prediction.style.display = "none";
  if (luckyHeading) luckyHeading.style.display = "none";
  if (luckyNumbersEl) luckyNumbersEl.style.display = "none";
}

// after delay show both prediction and lucky numbers together
function showResults() {
  if (!prediction || !luckyNumbersEl) {
    console.warn("Missing elements for results; aborting showResults");
    return;
  }

  // hide spinner
  if (spinnerEl) spinnerEl.style.display = "none";

  // populate the prediction text
  const predictionText = createRandomPrediction();
  prediction.innerHTML = predictionText;

  // generate and populate lucky numbers
  const luckyNumbers = generateLuckyNumbers();
  luckyNumbersEl.innerHTML = `<span class="lucky-number-text">${luckyNumbers.join(", ")}</span>`;

  // make prediction and numbers/heading visible
  prediction.style.display = "block";
  if (luckyHeading) luckyHeading.style.display = "block";
  luckyNumbersEl.style.display = "block";

  // animate fade-in simultaneously
  setTimeout(() => {
    const warningText = prediction.querySelector(".warning-text");
    if (warningText) warningText.classList.add("fade-in");
    const luckyNumberText = luckyNumbersEl.querySelector(".lucky-number-text");
    if (luckyNumberText) luckyNumberText.classList.add("fade-in");
  }, 0);
}

// Unique numbers between one and 50
function generateLuckyNumbers() {
  const numbers = new Set();
  while (numbers.size < 5) {
    const num = Math.floor(Math.random() * 50) + 1;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b); // Welcome to my personal hell
}

/////////////////////////////////////////////////////
//////////       INITIALIZATION       /////////////
/////////////////////////////////////////////////////

loadpredictions();
