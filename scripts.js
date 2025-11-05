document.addEventListener("DOMContentLoaded", () => {
  loadpredictions();
});

let prediction = null;
let predictions = [];

/////////////////////////////////////////////////////
//////////       DATA LOADING       /////////////
/////////////////////////////////////////////////////

function loadpredictions() {
  fetch("predictions.json")
    .then((response) => response.json())
    .then((data) => {
      predictions = data.predictions || [];
      // Initialize prediction element reference after data is loaded
      prediction = document.getElementById("fortune-prediction");
      // Show the prediction after 1s; lucky numbers will be shown 1s after the
      // prediction (chained inside showPrediction) so they appear at t=2s.
      setTimeout(showPrediction, 1000);
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

function showPrediction() {
  if (!prediction) {
    console.warn(
      "Missing #fortune-prediction element; aborting showPrediction"
    );
    return;
  }

  const predictionText = createRandomPrediction();
  prediction.innerHTML = predictionText;

  // Made sure DOM update has occurred
  setTimeout(() => {
    const warningText = prediction.querySelector(".warning-text");
    if (warningText) {
      warningText.classList.add("fade-in");
    }
    // Show lucky numbers 1 (?) second after the prediction appears
    setTimeout(showLuckyNumbers, 1000);
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

function showLuckyNumbers() {
  const luckyNumbersElement = document.getElementById("lucky-numbers");
  if (!luckyNumbersElement) {
    console.warn("Missing #lucky-numbers element; aborting showLuckyNumbers");
    return;
  }

  const luckyNumbers = generateLuckyNumbers();
  luckyNumbersElement.innerHTML = `<span class="lucky-number-text">${luckyNumbers.join(
    ", "
  )}</span>`;

  // Use setTimeout to ensure DOM update has occurred
  setTimeout(() => {
    const luckyNumberText =
      luckyNumbersElement.querySelector(".lucky-number-text");
    if (luckyNumberText) {
      luckyNumberText.classList.add("fade-in");
    }
  }, 0);
}

/////////////////////////////////////////////////////
//////////       INITIALIZATION       /////////////
/////////////////////////////////////////////////////

loadpredictions();
