const PLAYING = "PLAYING";
const IDLE = "IDLE";
const PROCESSING = "PROCESSING";

music_sources = [
  "./assets/music/bensound-betterdays.mp3",
  "./assets/music/bensound-november.mp3",
  "./assets/music/bensound-relaxing.mp3",
];

background_sources = [
  "./assets/img/1.jpg",
  "./assets/img/2.jpg",
  "./assets/img/3.jpg",
  "./assets/img/4.jpg",
  "./assets/img/5.jpg",
  "./assets/img/6.jpg",
  "./assets/img/7.jpg",
  "./assets/img/8.jpg",
  "./assets/img/9.jpg",
  "./assets/img/10.jpg",
];

$(document).ready(function () {
  let state = IDLE;

  const duration = 2 * 60;

  const textTransitionTimes = 1000;

  const slideshowTime = 5000;

  const musicFadeInTime = 4000;

  const musicFadeOutTime = 2000;

  let timer;

  let slideshowOn = false;

  const audio = $("#theAudio");

  const background = $(".root");

  const overlay = $(".overlay");

  const mainText = $("#maintext");

  const secText = $("#sectext");

  $(window).on({
    click: function () {
      if (state == IDLE) {
        polishedStart();
        state = PROCESSING;
        console.log("hi, state = " + state);
      }
    },
    keypress: function () {
      if (state == IDLE) {
        polishedStart();
        state = PLAYING;
        console.log("hi, state = " + state);
      }
    },
  });

  $(window).on("click keydown keyup mousemove", function () {
    if (state == PLAYING) {
      polishedHalt();
      state = PROCESSING;
      console.log("bye, state = " + state);
    }
  });

  setInterval(function () {
    console.log(audio[0].volume);
  }, 500);

  // function startPlaying() {
  //   file = Math.floor(Math.random() * 3);
  //   audio.attr("src", music_sources[file]);
  //   sound = audio[0];
  //   sound.play();
  //   sound.volume = 0.1;
  //   audio.animate({ volume: 1 }, 5000);

  //   overlay.animate({ opacity: 1 }, 1000);

  //   var time = 2 * 60,
  //     r = document.querySelector("#maintext"),
  //     tmp = time;

  //   timer = setInterval(function () {
  //     var c = tmp--,
  //       m = (c / 60) >> 0,
  //       s = c - m * 60 + "";
  //     r.textContent = "Relax for " + m + ":" + (s.length > 1 ? "" : "0") + s;
  //     if (tmp < 0) {
  //       state = IDLE;
  //       stopPlaying();
  //     }
  //   }, 1000);
  // }

  // function stopPlaying() {
  //   audio.animate({ volume: 0 }, 2000, function () {
  //     audio[0].pause();
  //   });
  //   overlay.animate({ opacity: 0.4 }, 1000);
  //   clearInterval(timer);
  // }

  const backgroundFadeOut = () =>
    overlay.animate({ opacity: 1 }, textTransitionTimes).promise();

  const backgroundFadeIn = (image) => {
    background.css("background-image", `url(${image})`);
    return overlay.animate({ opacity: 0.4 }, textTransitionTimes).promise();
  };

  const changeBackground = async () => {
    background.css(
      "background-image",
      `url(${
        background_sources[
          Math.floor(Math.random() * background_sources.length)
        ]
      })`
    );
    background.css("background-size", "100%");
    background.animate({ backgroundSize: "110%" }, 5000);
    await overlay.animate({ opacity: 0.4 }, textTransitionTimes).promise();
    await timeout(3000);
    await overlay.animate({ opacity: 1 }, textTransitionTimes).promise();
  };

  const backgroundSlideshowFadeIn = async () => {
    slideshowOn = true;
    while (slideshowOn) {
      await changeBackground();
    }
  };

  const endSlideShow = () => {
    slideshowOn = false;
  };

  const textFadeOut = () => {
    mainText.animate({ opacity: 0 }, textTransitionTimes);
    return secText
      .animate({ opacity: 0 }, textTransitionTimes, function () {
        secText.css("display", "none");
      })
      .promise();
  };

  const textFadeIn = () => {
    mainText.text("Relax and do nothing for two minutes");
    secText.css("display", "block");
    mainText.animate({ opacity: 1 }, textTransitionTimes);
    return secText.animate({ opacity: 1 }, textTransitionTimes).promise();
  };

  const mainTextFadeOut = () =>
    mainText.animate({ opacity: 0 }, textTransitionTimes).promise();

  const mainTextFadeIn = (text) => {
    mainText.text(text);
    return mainText.animate({ opacity: 1 }, textTransitionTimes).promise();
  };

  const musicFadeOut = () => {
    clearInterval(timer);
    return audio.animate({ volume: 0 }, musicFadeOutTime).promise();
  };

  const musicFadeIn = (music) => {
    audio.attr("src", music);
    audio[0].play();
    audio[0].volume = 0.1;
    return audio.animate({ volume: 1 }, musicFadeInTime).promise();
  };

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function polishedStart() {
    // Everything fades out
    // Background
    backgroundFadeOut();
    // Text
    await textFadeOut();

    // Instructions appear one by one on black screen
    const instructions = ["Leave Everything", "Take a deep breath", "Let's Go"];
    await asyncForEach(instructions, async (instruction) => {
      await mainTextFadeIn(instruction);
      await timeout(2000);
      await mainTextFadeOut();
    });

    backgroundSlideshowFadeIn();

    musicFadeIn(
      music_sources[Math.floor(Math.random() * music_sources.length)]
    );

    mainTextFadeIn("Relax for 2:00");

    state = PLAYING;

    let tmp = duration;

    timer = setInterval(async function () {
      var c = tmp--,
        m = (c / 60) >> 0,
        s = c - m * 60 + "";
      mainText.text("Relax for " + m + ":" + (s.length > 1 ? "" : "0") + s);
      if (tmp < 0) {
        await polishedStop();
        state = IDLE;
      }
    }, 1000);
  }

  async function polishedHalt() {
    backgroundFadeOut();
    endSlideShow();
    musicFadeOut();
    clearInterval(timer);
    mainText.addClass("danger");
    mainTextFadeIn("Try again");
    await timeout(2000);
    await mainTextFadeOut();
    mainText.removeClass("danger");
    backgroundFadeIn(
      background_sources[Math.floor(Math.random() * background_sources.length)]
    );
    await textFadeIn();
    state = IDLE;
  }

  async function polishedStop() {
    backgroundFadeOut();
    endSlideShow();
    musicFadeOut();
    clearInterval(timer);
    await textFadeOut();
    await mainTextFadeIn("You are calm now");
    await timeout(2000);
    await mainTextFadeOut();
    backgroundFadeIn(
      background_sources[Math.floor(Math.random() * background_sources.length)]
    );
    textFadeIn();
  }

  // Initialization

  backgroundFadeIn(
    background_sources[Math.floor(Math.random() * background_sources.length)]
  );

  textFadeIn();

  var images = new Array();
  function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
      images[i] = new Image();
      images[i].src = preload.arguments[i];
    }
  }
  preload(background_sources);
});
