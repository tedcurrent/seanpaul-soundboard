function playSound(keyCode) {
  const key = document.querySelector(`.key[data-key="${keyCode}"]`);
  if (!key) return;

  const source = context.createBufferSource();

  source.buffer = buffers[keyCode];
  source.playbackRate.value = appState.playbackRate;
  source.connect(filter);
  filter.frequency.value = appState.filter;
  filter.connect(context.destination);
  source.start(0);
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

const sounds = [
  { key: 81, path: "sounds/girl1.wav" },
  { key: 87, path: "sounds/girl2.wav" },
  { key: 69, path: "sounds/girl3.wav" },
  { key: 82, path: "sounds/girl4.wav" },
  { key: 65, path: "sounds/intheclub.wav" },
  { key: 83, path: "sounds/bigpapa.wav" },
  { key: 68, path: "sounds/jimmy.wav" },
  { key: 70, path: "sounds/goody.wav" },
  { key: 90, path: "sounds/dooo.wav" },
  { key: 88, path: "sounds/sk.wav" },
  { key: 67, path: "sounds/sp.wav" },
  { key: 86, path: "sounds/cool.wav" }
];

const buffers = {};

const context = new (window.AudioContext || window.webkitAudioContext)();
const filter = context.createBiquadFilter();
filter.type = "lowpass";

sounds.forEach(sound => {
  fetch(sound.path)
    .then(response => response.arrayBuffer())
    .then(data => context.decodeAudioData(data, buffer => buffers[sound.key] = buffer));
});

const keys = document.querySelectorAll(".key");
keys.forEach(key => key.addEventListener("transitionend", removeTransition));
keys.forEach(key => key.addEventListener("mousedown", (e) => mousePlaySound(key, e)));
window.addEventListener("keydown", keyboardPlaySound);

const controllers = document.querySelectorAll("input[type='range']")
controllers.forEach(controller => controller.addEventListener("input", () => appState[controller.name] = controller.value));