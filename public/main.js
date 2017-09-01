function playSound(keyCode) {
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${keyCode}"]`);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play();
  key.classList.add("playing");
}

function keyboardPlaySound(e) {
  return !e.repeat && playSound(e.keyCode);
}

function mousePlaySound(key, e) {
  return !e.repeat && key.contains(e.target) && playSound(key.getAttribute("data-key"));
}

function removeTransition(e) {
  this.classList.remove("playing");
}

const appState = {
  playbackRate: 1.0,
  filter: 18000
};

const context = new (window.AudioContext || window.webkitAudioContext)();
const filter = context.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = appState.filter;

const audioInputs = document.querySelectorAll("audio");
audioInputs.forEach((audio) => {
  const source = context.createMediaElementSource(audio);
  source.connect(filter)
  filter.connect(context.destination);
});

const keys = document.querySelectorAll(".key");
keys.forEach(key => key.addEventListener("transitionend", removeTransition));
keys.forEach(key => key.addEventListener("mousedown", (e) => mousePlaySound(key, e)));
window.addEventListener("keydown", keyboardPlaySound);

const controllers = document.querySelectorAll("input[type='range']")
controllers.forEach(controller => controller.addEventListener("input", () => {
  appState[controller.name] = controller.value;
  audioInputs.forEach(audio => audio.playbackRate = appState.playbackRate);
  filter.frequency.value = appState.filter;
}));