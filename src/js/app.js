let raffleData = [];
let originalRaffleData = [];
let theWheel;
let winners = [];
const getRaffleData = () => {
  return fetch(
    "https://5javhg6vja.execute-api.eu-west-1.amazonaws.com/Stage/getusers"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("err");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const initWinWheel = () => {
  theWheel = new Winwheel({
    canvasId: "raffle-canvas",
    numSegments: raffleData.length,
    lineWidth: "1",
    responsive: true,
    segments: raffleData,
    textFontFamily: "sans-serif",
    // rotationAngle: -30,
    // Note animation properties passed in constructor parameters.
    animation: {
      type: "spinToStop", // Type of animation.
      duration: 5, // How long the animation is to take in seconds.
      spins: 10, // The number of complete 360 degree rotations the wheel is to do.
      easing: "Power4.easeInOut",
      // Remember to do something after the animation has finished specify callback function.
      callbackFinished: "onSpinStopped()",

      // During the animation need to call the drawTriangle() to re-draw the pointer each frame.
    },
    pointerAngle: 0,
    // Turn pointer guide on.
    pointerGuide: {
      display: false,
      strokeStyle: "red",
      lineWidth: 3,
    },
  });
};
getRaffleData().then((res) => {
  originalRaffleData = res.data;
  raffleData = originalRaffleData.map((item, index) => ({
    text: item.name.length > 22 ? `${item.name.slice(0, 22)}...` : item.name,
    fillStyle: index % 2 === 0 ? "#232F3E" : "#ff9900",
    textFillStyle: index % 2 === 0 ? "#fff" : "#000",
  }));
  initWinWheel();
});
const onSpinWheel = () => {
  theWheel.startAnimation();
};
const onResetWheel = () => {
  document.getElementsByClassName("mainDiv")[0].classList.remove("flex");
  document
    .getElementsByClassName("winnersWrapper")[0]
    .classList.remove("w-2/5");
  document.getElementsByClassName("winnersWrapper")[0].classList.add("hidden");
  document.getElementsByClassName("wheelDiv")[0].classList.remove("w-3/5");
  window.location.reload();
};

const onSpinStopped = () => {
  const winner = theWheel.getIndicatedSegment();
  const winnerPosition = theWheel.getIndicatedSegmentNumber();
  document.getElementsByClassName("winnerName")[0].textContent = winner.text;
  const li = document.createElement("li");
  li.textContent = winner.text;
  document.getElementsByClassName("winnersList")[0].appendChild(li);
  document.getElementsByClassName("mainDiv")[0].classList.add("flex");
  document.getElementsByClassName("winnersWrapper")[0].classList.add("w-2/5");
  document
    .getElementsByClassName("winnersWrapper")[0]
    .classList.remove("hidden");
  document.getElementsByClassName("winner")[0].classList.remove("hidden");
  document.getElementsByClassName("wheelDiv")[0].classList.add("w-3/5");
  console.log();
  setTimeout(() => {
    document.getElementsByClassName("winner")[0].classList.add("hidden");

    raffleData.splice(winnerPosition - 1, 1);
    theWheel.deleteSegment(winnerPosition);
    theWheel.rotationAngle = 0;
    theWheel.draw();
  }, 5000);
};
// const setWinner = () => {
//     document.getElementsByClassName('winner')[0].;
// }
