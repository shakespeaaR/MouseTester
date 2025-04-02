// Get the elements by their IDs
const LPMCounter = document.getElementById("lpm-clickcounter");
const PPMCounter = document.getElementById("ppm-clickcounter");
const scrollUpCounter = document.getElementById("scroll-up-counter");
const scrollDownCounter = document.getElementById("scroll-down-counter");
const scrollDirection = document.getElementById("scroll-direction");
const scrollArrow = document.getElementById("scroll-arrow");
const scrollError = document.getElementById("scroll-error");
const LPMError = document.getElementById("lpm-error");
const PPMError = document.getElementById("ppm-error");
const LPMDiff = document.getElementById("lpm-diff");
const PPMDiff = document.getElementById("ppm-diff");
const mouseSection = document.getElementById("testarea");
const SPMCounter = document.getElementById("spm-clickcounter");
const SPMDiff = document.getElementById("spm-diff");
const SPMError = document.getElementById("spm-error");
const backCounter = document.getElementById("back-clickcounter");
const backDiff = document.getElementById("back-diff");
const backError = document.getElementById("back-error");
const nextCounter = document.getElementById("next-clickcounter");
const nextDiff = document.getElementById("next-diff");
const nextError = document.getElementById("next-error");
//mouseButtons
const LPMButton = document.getElementById("LeftMouseButton");
const PPMButton = document.getElementById("RightMouseButton");
const SPMButton = document.getElementById("MiddleMouseButton");
const backButton = document.getElementById("BackMouseButton");
const nextButton = document.getElementById("NextMouseButton");
const scrollRoller = document.getElementById("RollerCoaster");
//clicks
let clickDiffLPM = 0;
let clickDiffPPM = 0;
let LPMClicks = 0;
let PPMClicks = 0;
let scrollUp = 0;
let scrollDown = 0;
let scrollDirectionChanges = 0;
let lastScrollDirection = null;
let prevClickMicrotimeLPM = 0;
let prevClickMicrotimePPM = 0;
let prevScrollDirectionChangeTime = microtime(true);
let clickDiffVariable;
let isLPMPressed = false;
let isPPMPressed = false;
let LPMDouble = 0;
let PPMDouble = 0;
let SPMDouble = 0;
let SPMClicks = 0;
let clickDiffSPM = 0;
let isSPMPressed = false;
let prevClickMicrotimeSPM = 0;
let backDouble = 0;
let backClicks = 0;
let clickDiffback = 0;
let isbackPressed = false;
let prevClickMicrotimeback = 0;
let nextDouble = 0;
let nextClicks = 0;
let clickDiffnext = 0;
let isnextPressed = false;
let prevClickMicrotimenext = 0;
let debounceTime;
//hZmeter
let count = 0;
let tick = 0;
let totalMoves = 0;
let value = 0;
let timer = null;
let chartTimer = null;
let testTimeout = null;
let meterSeconds = 0;
let lastTime = performance.now();
// Inicjalizacja wykresu
const ctx = document.getElementById("myChart").getContext("2d");
const chartData = {
  labels: [],
  datasets: [
    {
      label: "Częstotliwość (Hz)",
      data: [],
      borderColor: "rgba(0, 123, 255, 1)",
      backgroundColor: "rgba(0, 123, 255, 0.2)",
      borderWidth: 2,
      fill: true,
    },
  ],
};
const myChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    responsive: true,
    animation: {
      duration: 100,
      easing: "easeInQuad",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Czas (s)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Częstotliwość (Hz)",
        },
        beginAtZero: true,
        min: 0, // Minimalna wartość osi Y
        max: 1000, // Maksymalna wartość osi Y
      },
    },
  },
});
function reloadPage() {
  window.location.reload();
}
function setDebounceTime() {
  // Pobranie wartości z pola i skonwertowanie jej na liczbę
  if (document.getElementById("debounceSet").value > 0) {
    debounceTime = document.getElementById("debounceSet").value / 100;
  } else {
    debounceTime = 10 / 100;
  }
  document.getElementById("debouncetext").innerHTML =
    "Debounce Time: " + debounceTime + "s ";
  // Wyświetlenie wartości w konsoli
  console.log(debounceTime);
}
function handleMouseClick(
  button,
  incrementClicks,
  errorElement,
  diffElement,
  prevClickMicrotime
) {
  let isDoubleClick = clickEvent(prevClickMicrotime);
  if (isDoubleClick) {
    if (button === 0) {
      LPMDouble++;
      errorElement.innerHTML =
        `&nbsp;Double Click!&nbsp;(${clickDiffVariable.toFixed(2)}s)` +
        `&nbsp;(${LPMDouble})`;
    }
    if (button === 2) {
      PPMDouble++;
      errorElement.innerHTML =
        `&nbsp;Double Click!&nbsp;(${clickDiffVariable.toFixed(2)}s)` +
        `&nbsp;(${PPMDouble})`;
    }
    if (button === 1) {
      SPMDouble++;
      errorElement.innerHTML =
        `&nbsp;Double Click!&nbsp;(${clickDiffVariable.toFixed(2)}s)` +
        `&nbsp;(${SPMDouble})`;
    }
    if (button === 4) {
      backDouble++;
      errorElement.innerHTML =
        `&nbsp;Double Click!&nbsp;(${clickDiffVariable.toFixed(2)}s)` +
        `&nbsp;(${backDouble})`;
    }
    if (button === 3) {
      nextDouble++;
      errorElement.innerHTML =
        `&nbsp;Double Click!&nbsp;(${clickDiffVariable.toFixed(2)}s)` +
        `&nbsp;(${nextDouble})`;
    }
  }
  incrementClicks();
  diffElement.innerHTML =
    " " + `&nbsp;(${clickDiffVariable.toFixed(2)}s)`;
  console.log(`(${clickDiffVariable.toFixed(2)}s)`);
}
function clickEvent(prevClickMicrotime) {
  let clickTime = microtime(true);
  let diff = clickTime - prevClickMicrotime;
  console.log(diff);
  if (diff <= debounceTime) {
    clickDiffVariable = diff;
    return true;
  }
  if (diff > 300) diff = 0;
  clickDiffVariable = diff;
  console.log(clickDiffVariable);
  return false;
}
mouseSection.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
    let currentTime = microtime(true);
    let timeSinceLastChange = currentTime - prevScrollDirectionChangeTime;
    if (e.deltaY < 0) {
      // Scroll up
      scrollUp++;
      if (lastScrollDirection === "down" && timeSinceLastChange < 0.02) {
        scrollDirectionChanges++;
        scrollError.innerHTML =
          "Przewinięcie w dół!" +
          `<span id="scroll-direction-change-counter">(` +
          scrollDirectionChanges +
          `)</span>`;
      }
      if (lastScrollDirection !== "up") {
        scrollDirection.innerHTML = "&nbsp;Góra";
        scrollArrow.innerHTML = "&#8593;"; // Up arrow
        prevScrollDirectionChangeTime = currentTime;
      }
      lastScrollDirection = "up";
    } else if (e.deltaY > 0) {
      // Scroll down
      scrollDown++;
      if (lastScrollDirection === "up" && timeSinceLastChange < 0.02) {
        scrollDirectionChanges++;
        scrollError.innerHTML =
          "Przewinięcie w górę!" +
          `<span id="scroll-direction-change-counter">(` +
          scrollDirectionChanges +
          `)</span>`;
      }
      if (lastScrollDirection !== "down") {
        scrollDirection.innerHTML = "&nbsp;Dół";
        scrollArrow.innerHTML = "&#8595;"; // Down arrow
        prevScrollDirectionChangeTime = currentTime;
      }
      lastScrollDirection = "down";
    }
    MouseRenderActiveButtons(e.deltaY); // Pass deltaY here
    updateClicks();
  },
  { passive: false }
);
mouseSection.addEventListener("mousedown", function (e) {
  let button = e.button;
  if (button === 0) {
    // Left mouse button
    isLPMPressed = true;
    handleMouseClick(
      button,
      () => LPMClicks++,
      LPMError,
      LPMDiff,
      prevClickMicrotimeLPM
    );
    prevClickMicrotimeLPM = microtime(true);
  } else if (button === 2) {
    // Right mouse button
    isPPMPressed = true;
    handleMouseClick(
      button,
      () => PPMClicks++,
      PPMError,
      PPMDiff,
      prevClickMicrotimePPM
    );
    prevClickMicrotimePPM = microtime(true);
  } else if (button === 1) {
    // Middle mouse button
    isSPMPressed = true;
    handleMouseClick(
      button,
      () => SPMClicks++,
      SPMError,
      SPMDiff,
      prevClickMicrotimeSPM
    );
    prevClickMicrotimeSPM = microtime(true);
  } else if (button === 4) {
    // Middle mouse button
    isbackPressed = true;
    handleMouseClick(
      button,
      () => backClicks++,
      backError,
      backDiff,
      prevClickMicrotimeback
    );
    prevClickMicrotimeback = microtime(true);
  } else if (button === 3) {
    // Middle mouse button
    isnextPressed = true;
    handleMouseClick(
      button,
      () => nextClicks++,
      nextError,
      nextDiff,
      prevClickMicrotimenext
    );
    prevClickMicrotimenext = microtime(true);
  }
  MouseRenderActiveButtons();
  activeState();
  updateClicks();
  e.preventDefault();
});
mouseSection.addEventListener("mouseup", function (e) {
  let button = e.button;
  if (button === 0) {
    // Left mouse button
    isLPMPressed = false;
  } else if (button === 2) {
    // Right mouse button
    isPPMPressed = false;
  } else if (button === 1) {
    // Middle mouse button
    isSPMPressed = false;
  } else if (button === 4) {
    // Middle mouse button
    isbackPressed = false;
  } else if (button === 3) {
    // Middle mouse button
    isnextPressed = false;
  }
  MouseRenderActiveButtons();
  activeState();
  updateClicks();
  e.preventDefault();
});
mouseSection.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
function MouseRenderActiveButtons(deltaY) {
  console.log("MouseRenderActiveButtons:");
  console.log("  deltaY:", deltaY);
  console.log("  isLPMPressed:", isLPMPressed);
  console.log("  isPPMPressed:", isPPMPressed);
  console.log("  isSPMPressed:", isSPMPressed);
  console.log("  isbackPressed:", isbackPressed);
  console.log("  isnextPressed:", isnextPressed);

  if (isLPMPressed) {
    LPMButton.style.backgroundColor = "#ffb100cc";
  } else if (LPMDouble > 0) {
    LPMButton.style.backgroundColor = "#ff0000cc";
  } else {
    LPMButton.style.backgroundColor = "#adadad85";
  }
  if (isPPMPressed) {
    PPMButton.style.backgroundColor = "#ffb100cc";
  } else if (PPMDouble > 0) {
    PPMButton.style.backgroundColor = "#ff0000cc";
  } else {
    PPMButton.style.backgroundColor = "#adadad85";
  }
  if (isSPMPressed) {
    SPMButton.style.backgroundColor = "#ffb100cc";
  } else if (SPMDouble > 0) {
    SPMButton.style.backgroundColor = "#ff0000cc";
  } else {
    SPMButton.style.backgroundColor = "#adadad85";
  }
  if (isbackPressed) {
    backButton.style.backgroundColor = "#ffb100cc";
  } else if (backDouble > 0) {
    backButton.style.backgroundColor = "#ff0000cc";
  } else {
    backButton.style.backgroundColor = "#adadad85";
  }
  if (isnextPressed) {
    nextButton.style.backgroundColor = "#ffb100cc";
  } else if (nextDouble > 0) {
    nextButton.style.backgroundColor = "#ff0000cc";
  } else {
    nextButton.style.backgroundColor = "#adadad85";
  }
  if (deltaY < 0) {
    scrollRoller.innerHTML = "&#8593;";
    SPMButton.style.backgroundColor = "#ffb10036";
  } else if (deltaY > 0) {
    scrollRoller.innerHTML = "&#8595;";
    SPMButton.style.backgroundColor = "#ffb10036";
  } else {
    scrollRoller.innerHTML = "";
    SPMButton.style.backgroundColor = "#191919cc";
  }
  // Reset SPMButton color after 1 second
  setTimeout(() => {
    if (SPMDouble > 0 || scrollDirectionChanges > 0) {
      SPMButton.style.backgroundColor = "#ff0000cc";
    } else {
      SPMButton.style.backgroundColor = "#000000cc";
    }
  }, 5);
}
function updateClicks() {
  LPMCounter.innerHTML = `&nbsp;` + LPMClicks;
  PPMCounter.innerHTML = `&nbsp;` + PPMClicks;
  SPMCounter.innerHTML = `&nbsp;` + SPMClicks;
  backCounter.innerHTML = `&nbsp;` + backClicks;
  nextCounter.innerHTML = `&nbsp;` + nextClicks;
  scrollUpCounter.innerHTML = `&nbsp;` + scrollUp;
  scrollDownCounter.innerHTML = `&nbsp;` + scrollDown;
}
function activeState() {
  if (
    isLPMPressed ||
    isPPMPressed ||
    isSPMPressed ||
    isbackPressed ||
    isnextPressed
  ) {
    document.getElementById("testareaText").style.backgroundColor =
      "#ffb100aa";
  } else {
    document.getElementById("testareaText").style.backgroundColor =
      "#007bff";
  }
}
updateClicks();
setDebounceTime();
MouseRenderActiveButtons();
function microtime(get_as_float) {
  const now = new Date().getTime() / 1000;
  const s = parseInt(now, 10);
  return get_as_float
    ? now
    : Math.round((now - s) * 1000) / 1000 + " " + s;
}
function updateCount() {
  let now = performance.now();
  let elapsed = now - lastTime;

  if (elapsed >= 1000) { // Aktualizacja co 1 sekundę
    value = count / (elapsed / 1000);
    totalMoves += count;
    tick++;

    let avgValue = Math.ceil(totalMoves / tick);
    document.getElementById("hZmeter").innerHTML =
      `Aktualny: ${value.toFixed(2)} Hz, Średnia: ${avgValue} Hz`;

    count = 0;
    lastTime = now;

    if (tick > 30) { // Resetowanie co 30 sekund
      tick = 0;
      totalMoves = 0;
    }
  }
}
function updateChart() {
  meterSeconds++;
  chartData.labels.push(meterSeconds);
  chartData.datasets[0].data.push(value);

  if (chartData.labels.length > 80) {
    chartData.labels.shift();
    chartData.datasets[0].data.shift();
  }
  myChart.update();
}


function valloop(event) {
  let events = "getCoalescedEvents" in event ? event.getCoalescedEvents() : [event];
  count += events.length;
}
function checkRate() {
  if (timer) {
    // Zatrzymanie pomiaru
    clearInterval(timer);
    clearInterval(chartTimer);
    clearTimeout(testTimeout);
    document.removeEventListener("pointermove", valloop);
    timer = null;
    document.getElementById("meterButton").innerHTML =
      "Pomiar zakończony! Kliknij, aby rozpocząć ponownie!";
  } else {
    // Resetowanie wartości
    count = 0;
    tick = 0;
    totalMoves = 0;
    meterSeconds = 0;
    lastTime = performance.now();

    chartData.labels = [];
    chartData.datasets[0].data = [0];
    myChart.update();

    document.getElementById("hZmeter").innerHTML =
      "Aktualny: 0 Hz, Średnia: 0 Hz";
    document.getElementById("meterButton").innerHTML =
      "Pomiar rozpoczęty! Ruszaj myszką!";
    document.getElementById("myChart").style.display = "flex";

    document.addEventListener("pointermove", valloop);

    timer = setInterval(updateCount, 100);
    chartTimer = setInterval(updateChart, 1000);

    testTimeout = setTimeout(() => {
      clearInterval(timer);
      clearInterval(chartTimer);
      document.removeEventListener("pointermove", valloop);
      timer = null;
      document.getElementById("meterButton").innerHTML =
        "Pomiar zakończony! Kliknij, aby rozpocząć ponownie!";
    }, 30000);
  }
}