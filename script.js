"use strict";

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";

var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$("#html").hide();

async function onYouTubePlayerAPIReady() {
  var player;
  var chapter;
  var video_id;

  var scroll_timeout;

  var cancel_auto_scroll = false;
  var paused = false;

  const player_margin = 30;

  const linkInput = document.getElementById("linkInput");
  const linkCont = document.getElementById("linkCont");
  const viewCont = document.getElementById("viewCont");
  const ok = document.getElementById("ok");
  const takeNote = document.getElementById("takeNote");
  const noteInput = document.getElementById("noteInput");
  const commands = document.getElementById("commands");
  const delayInput = document.getElementById("delayInput");
  const refresh = document.getElementById("refresh");
  const play_pointer = document.getElementById("play_pointer");
  const line_div = document.getElementById("line");

  const clientHeight = document.getElementById("html").clientHeight;

  var delay = 0;

  var current_chapter = 0;

  var w_parameter = 0;
  var dark_mode = 0;

  // color

  const color_0 = [
    "#FFCFD5",
    "#FFF0D4",
    "#A6FBDE",
    "#FFD9C7",
    "#ECDCFF",
    "#D4F0FF"
  ];

  const color_1 = [
    "#FFD7DD",
    "#FFF3D7",
    "#AEFFE6",
    "#FFDECC",
    "#F1E1FF",
    "#D9F5FF"
  ];

  const color_2 = [
    "#FFDEE4",
    "#FFF3D7",
    "#B5FFED",
    "#FFE3D1",
    "#F6E6FF",
    "#DEFAFF"
  ];

  const color_3 = [
    "#FFE6EC",
    "#FFF8DC",
    "#BDFFF5",
    "#FFE8D6",
    "#FBEBFF",
    "#E3FFFF"
  ];

  const color_4 = [
    "#FFEEF4",
    "#FFF8DC",
    "#C5FFFD",
    "#FFEDDB",
    "#FFF0FF",
    "#E8FFFF"
  ];

  const color_5 = [
    "#FFF5FB",
    "#FFFDE1",
    "#CCFFFF",
    "#FFF3E1",
    "#FFF6FF",
    "#EEFFFF"
  ];

  const color_0_hover = [
    "#FF99A5",
    "#FFFF66",
    "#6DF8CA",
    "#FFB999",
    "#C799FF",
    "#99DBFF"
  ];

  const color_1_hover = [
    "#FFA6B2",
    "#FFFF78",
    "#7AFFD7",
    "#FFC6A6",
    "#D4A6FF",
    "#A6E8FF"
  ];

  const color_2_hover = [
    "#FFB3BF",
    "#FFFF8A",
    "#87FFE4",
    "#FFD3B3",
    "#E1B3FF",
    "#B3F5FF"
  ];

  const color_3_hover = [
    "#FFBFCB",
    "#FFFF9C",
    "#93FFF0",
    "#FFDFBF",
    "#EDBFFF",
    "#BFFFFF"
  ];

  const color_4_hover = [
    "#FFCCD8",
    "#FFFFAD",
    "#A0FFFD",
    "#FFECCC",
    "#FACCFF",
    "#CCFFFF"
  ];

  const color_5_hover = [
    "#FFD9E5",
    "#FFFFBF",
    "#ADFFFF",
    "#FFF9D9",
    "#FFD9FF",
    "#D9FFFF"
  ];

  // read the rem's children
  const documentId = await RemNoteAPI.v0.get_context();
  const pluginId = documentId.remId;
  var plugin_rem = await RemNoteAPI.v0.get(pluginId);
  var child_array = plugin_rem.children;

  // parameters

  const plugin_markdown = plugin_rem.nameAsMarkdown;
  const enable_parameter = plugin_markdown.match(/-np/gi) == null;

  var settings = await RemNoteAPI.v0.get_by_name("RemNote YT");

  //return;

  var parameters = new Map();

  if (enable_parameter) {
    if (settings.found) {
      parameters.set(
        "dark_mode",
        (await RemNoteAPI.v0.get(settings.children[0])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "width",
        (await RemNoteAPI.v0.get(settings.children[1])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "playback_speed",
        (await RemNoteAPI.v0.get(settings.children[2])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "delay",
        (await RemNoteAPI.v0.get(settings.children[3])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "caption",
        (await RemNoteAPI.v0.get(settings.children[4])).nameAsMarkdown.split(
          ": "
        )[1]
      );
    } else {
      settings = await RemNoteAPI.v0.create("RemNote YT");

      await RemNoteAPI.v0.create("dark_mode: 0", settings.remId);
      await RemNoteAPI.v0.create("width: 65", settings.remId);
      await RemNoteAPI.v0.create("playback_speed: 1", settings.remId);
      await RemNoteAPI.v0.create("delay: 0", settings.remId);
      await RemNoteAPI.v0.create("caption: 0", settings.remId);

      parameters.set("dark_mode", 0);
      parameters.set("width", "65");
      parameters.set("playback_speed", 1);
      parameters.set("delay", 0);
      parameters.set("caption", 0);
    }

    // dark mode

    dark_mode = parameters.get("dark_mode");
    if (dark_mode == 1) {
      document.getElementById("html").style.background = "#f5f5f5";
      $("#linkInput").css("background", "black");
      $("#linkInput").css("color", "#c0bdbd");
      $("#ok").css("color", "#c0bdbd");
      $("#takeNote").css("color", "#c0bdbd");
      $("#keyboard_label").css("color", "#c0bdbd");
      $("#refresh").css("color", "#c0bdbd");
      $("img").css(
        "filter",
        "invert(90%) sepia(8%) saturate(1062%) hue-rotate(200deg) brightness(82%) contrast(84%)"
      );

      $("#refresh").on("mouseover", function() {
        $(this).css("color", "#272525");
        $("#refresh > img").css(
          "filter",
          "invert(46%) sepia(8%) saturate(1062%) hue-rotate(210deg) brightness(82%) contrast(84%)"
        );
      });
      $("#refresh").on("mouseout", function() {
        $(this).css("color", "#c0bdbd");
        $("#refresh > img").css(
          "filter",
          "invert(90%) sepia(8%) saturate(1062%) hue-rotate(200deg) brightness(82%) contrast(84%)"
        );
      });

      $("#takeNote").on("mouseover", function() {
        $(this).css("color", "#272525");
        $("#takeNote > img").css(
          "filter",
          "invert(46%) sepia(8%) saturate(1062%) hue-rotate(210deg) brightness(82%) contrast(84%)"
        );
      });
      $("#takeNote").on("mouseout", function() {
        $(this).css("color", "#c0bdbd");
        $("#takeNote > img").css(
          "filter",
          "invert(90%) sepia(8%) saturate(1062%) hue-rotate(200deg) brightness(82%) contrast(84%)"
        );
      });

      //$("#ytplayer").css("filter", "hue-rotate(180deg) invert(1)");
      $("#left").css("filter", "hue-rotate(180deg) invert(1)");
      $("#right").css("filter", "hue-rotate(180deg) invert(1)");
    }

    // width %

    var width_parameter = parameters.get("width");

    if (width_parameter != undefined) {
      document.getElementById("ytplayer").style.width = width_parameter + "%";

      document.getElementById("commands").style.width = width_parameter + "%";

      document.getElementById("noteInput").style.width = width_parameter + "%";

      document.getElementById("right").style.width =
        100 - width_parameter + "%";

      document.getElementById("right").style.left = width_parameter + "%";

      if (width_parameter <= 40) {
        w_parameter = 35;
        $("#commands")
          .removeClass("row row-cols-4 mt-3")
          .addClass("row row-cols-2 mt-3");
      }
    }

    // delay

    var delay_parameter_value = parameters.get("delay");
    if (delay_parameter_value != undefined) {
      delay = delay_parameter_value[0];
      if (delay > 0) delayInput.value = delay_parameter_value;
    }

    // caption

    var enable_caption = 0;
    var caption_parameter_value = parameters.get("caption");
    if (caption_parameter_value != undefined) {
      if (caption_parameter_value == 1) {
        enable_caption = 1;
      }
    }
  }

  // show the needed panel

  let first_rem;
  if (child_array.length != 0) {
    first_rem = await RemNoteAPI.v0.get(child_array[0]);
    linkInput.value = first_rem.name[0].text;

    linkCont.style.display = "none";
    viewCont.style.display = "block";
    $("#linkCont").removeClass(
      "d-flex flex-column min-vh-100 justify-content-center align-items-center"
    );
  } else {
    linkCont.style.display = "block";
    viewCont.style.display = "none";
  }

  // show ok button

  if (linkInput.value) {
    ok.style.display = "block";
    ok.style.opacity = "1";
  }

  // get youtube rem title

  const rem_title = await RemNoteAPI.v0.get(documentId.documentId);
  const index_title = rem_title.nameAsMarkdown.indexOf("](https://");

  if (index_title != -1 && child_array.length == 0) {
    linkInput.value = rem_title.nameAsMarkdown.slice(index_title + 2, -2);
    if (linkInput.value) {
      ok.style.display = "block";
      ok.style.opacity = "1";
    }
    setTimeout(function() {
      ok.click();
    }, 100);
  }

  // recognize the youtube link

  var url;
  if (child_array.length != 0) {
    url = first_rem.name[0].text;
    if (url.includes("youtube.com")) {
      video_id = url.split("youtube.com/watch?v=")[1].slice(0, 11);
    } else if (url.includes("youtu.be")) {
      video_id = url.split("youtu.be/")[1].slice(0, 11);
    }
  } else {
    if (linkInput.value != "") {
      url = linkInput.value;
      if (url.includes("youtube.com")) {
        video_id = url.split("youtube.com/watch?v=")[1].slice(0, 11);
      } else if (url.includes("youtu.be")) {
        video_id = url.split("youtu.be/")[1].slice(0, 11);
      }
    }
  }

  if (video_id != undefined) {
    // make the video

    player = new YT.Player("ytplayer", {
      height: clientHeight - 100 - w_parameter,
      videoId: video_id,
      playerVars: {
        cc_load_policy: enable_caption,
        color: "white",
        controls: 2,
        disablekb: 0,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showsearch: 0
      },
      events: {
        // load the content
        onReady: timeline,
        onStateChange: onPlayerStateChange
      }
    });

    // updates
    setInterval(() => {
      if (typeof player.getDuration === "function") {
        const player_current_time = parseInt(player.playerInfo.currentTime);

        // player pointer
        play_pointer.style.left =
          (player.playerInfo.currentTime / player.getDuration()) *
            (ytplayer.getBoundingClientRect().width - 20) +
          20 +
          "px";

        // chapter
        let chapter_found = false;
        for (let i = 1; i < child_array.length; i++) {
          if (document.getElementById(String(i)) !== null) {
            if (document.getElementById(String(i)).value == "0") break;
            if (
              player_current_time <
              formatedTimeToDuration(
                String(document.getElementById(String(i)).value)
              )
            ) {
              current_chapter = i - 1;
              chapter_found = true;
              break;
            }
          }
        }

        if (!chapter_found) {
          current_chapter = child_array.length - 1;
        }
      }
    }, 200);

    // auto scroll while playing
    setInterval(() => {
      if (typeof player.getDuration === "function") {
        let player_current_time = parseInt(player.playerInfo.currentTime);

        for (let i = 1; i < child_array.length; i++) {
          if (document.getElementById(String(i)) !== null) {
            if (document.getElementById(String(i)).value == "0") break;
            if (
              player_current_time ==
              formatedTimeToDuration(document.getElementById(String(i)).value)
            ) {
              if (!cancel_auto_scroll) {
                $("html, body").animate(
                  {
                    scrollTop: $("#" + i).offset().top
                  },
                  100
                );
                setTimeout(function() {
                  cancel_auto_scroll = false;
                }, 1000);
              }
            }
          }
        }
      }
    }, 1000);

    // change panel
    viewCont.style.display = "block";
    linkCont.style.display = "none";

    // erase the loading placeholder
    setTimeout(function() {
      $("#placeholder").html("");
    }, 500);
  }

  // show

  $("#html").fadeIn("slow");

  // EVENTS

  // resize
  $(window).resize(function() {
    create_chapter();
  });

  // keyboard switch

  $("input#keyboard").on("change", function() {
    $("input#keyboard").prop("checked", true);
  });

  $(window).on("blur", function() {
    document.body.classList.add("paused");
    $("input#keyboard").prop("checked", false);
  });
  $(window).on("focus", function() {
    document.body.classList.remove("paused");
    $("input#keyboard").prop("checked", true);
  });

  // link input

  linkInput.oninput = function() {
    if (linkInput.value) {
      ok.style.display = "block";
      ok.style.opacity = "1";
    } else {
      ok.style.opacity = "0";
      ok.style.display = "none";
    }
  };

  linkInput.onkeydown = function(e) {
    if (e.which == 13) {
      ok.click();
    }
  };

  // confirm link

  ok.onclick = async function() {
    if (child_array.length == 0) {
      await RemNoteAPI.v0.create(linkInput.value, pluginId, {
        positionAmongstSiblings: 0
      });
    }

    location.reload();
  };

  // take note

  takeNote.onclick = function() {
    player.pauseVideo();

    noteInput.style.display = "block";
    commands.style.display = "none";

    noteInput.focus();
  };

  // delay input

  delayInput.onclick = function() {
    delayInput.value = "";
    delay = 0;
  };

  $(delayInput).on("onkeydown", function(event) {
    // escape
    if (event.keyCode == 27) {
      document.activeElement.blur();
    }
  });

  $(delayInput).on("focusout", function() {
    if (isNaN(delayInput.value)) {
      delayInput.value = "";
      delay = 0;
    }
  });

  $(delayInput).on("mouseenter", function() {
    $(this).css("background", "#eeeef7");
    $(this).css("font-weight", "bold");
  });

  $(delayInput).on("mouseleave", function() {
    $(this).css("background", "#f4f4fa");
    $(this).css("font-weight", "normal");
  });

  // refresh
  refresh.onclick = function() {
    timeline(true);
  };

  // keyboard shortcuts

  document.onkeydown = async function(event) {
    let shortcut = "";
    let shortcuts = {};

    shortcuts.keys = {
      "shift+PageUp": "previous chapter",
      MediaTrackPrevious: "previous chapter",
      "shift+PageDown": "next chapter",
      MediaTrackNext: "next chapter",
      "shift+Home": "first chapter",
      "shift+End": "last chapter",
      "shift+ArrowUp": "increase volume",
      "shift+ArrowDown": "decrease volume",
      Backspace: "repeat",
      Space: "play/pause",
      MediaPlayPause: "play/pause",
      Enter: "take a note",
      NumpadEnter: "take a note",
      Escape: "cancel",
      ArrowLeft: "rewind",
      ArrowRight: "forward",
      KeyJ: "long rewind",
      KeyL: "long forward",
      Digit: "jump",
      Numpad: "jump",
      KeyK: "play/pause",
      m: "mute",
      "shift+Comma": "slower",
      "shift+Period": "faster"
    };

    if (event.ctrlKey) shortcut += "ctrl+";
    if (event.altKey) shortcut += "alt+";
    if (event.shiftKey) shortcut += "shift+";

    if (
      event.key == "MediaTrackPrevious" ||
      event.key == "MediaTrackNext" ||
      event.key == "MediaPlayPause"
    ) {
      shortcut += event.key;
    } else if (event.code.substr(0, 5) == "Digit") {
      shortcut += event.code.substr(0, 5);
      // without NumpadEnter
    } else if (event.code.substr(0, 6) == "Numpad" && event.code.length == 7) {
      shortcut += event.code.substr(0, 6);
      // Internationalize the key
    } else if (event.key == "m") {
      shortcut += event.key;
    } else if (event.code) {
      shortcut += event.code;
    }

    // take note mode
    if (noteInput.value == "") {
      switch (shortcuts.keys[shortcut]) {
        case "increase volume":
          player.setVolume(player.getVolume() + 5);
          break;
        case "decrease volume":
          player.setVolume(player.getVolume() - 5);
          break;
        case "mute":
          if ($("#noteInput").is(":focus") == false) {
            if (player.isMuted()) {
              player.unMute();
            } else {
              player.mute();
            }
          }
          break;
        case "previous chapter":
          current_chapter--;
          if (current_chapter > 0) {
            document.getElementById(String(current_chapter)).click();
          } else {
            current_chapter = 1;
          }
          break;
        case "next chapter":
          current_chapter++;

          plugin_rem = await RemNoteAPI.v0.get(pluginId);
          child_array = plugin_rem.children;

          if (current_chapter < child_array.length) {
            document.getElementById(String(current_chapter)).click();
          } else {
            current_chapter = child_array.length - 1;
          }
          break;
        case "first chapter":
          current_chapter = 1;
          document.getElementById(String(current_chapter)).click();
          break;
        case "last chapter":
          plugin_rem = await RemNoteAPI.v0.get(pluginId);
          child_array = plugin_rem.children;
          current_chapter = child_array.length - 1;
          document.getElementById(String(current_chapter)).click();
          break;
        case "repeat":
          if ($("#noteInput").is(":focus") == false) {
            if (document.activeElement != noteInput) {
              if (current_chapter > 0 && current_chapter < child_array.length) {
                document.getElementById(String(current_chapter)).click();
              }
            }
          }
          break;
        case "play/pause":
          if (!($("#noteInput").is(":focus") && event.code == "KeyK")) {
            event.preventDefault();
            if (paused) {
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          }
          break;
        case "rewind":
          var currentTime = player.getCurrentTime();
          player.seekTo(currentTime - 5, true);
          break;
        case "forward":
          var currentTime = player.getCurrentTime();
          player.seekTo(currentTime + 5, true);
          break;
        case "long rewind":
          if ($("#noteInput").is(":focus") == false) {
            var currentTime = player.getCurrentTime();
            player.seekTo(currentTime - 10, true);
          }

          break;
        case "long forward":
          if ($("#noteInput").is(":focus") == false) {
            var currentTime = player.getCurrentTime();
            player.seekTo(currentTime + 10, true);
          }
          break;
        case "jump":
          if (
            $("#noteInput").is(":focus") == false &&
            $("#delayInput").is(":focus") == false
          ) {
            if (event.code.substr(0, 5) == "Digit") {
              player.seekTo(
                player.getDuration() * 0.1 * event.code.substr(5),
                true
              );
            } else if (
              event.code.substr(0, 6) == "Numpad" &&
              event.code.length == 7
            ) {
              player.seekTo(
                player.getDuration() * 0.1 * event.code.substr(6),
                true
              );
            }
          }
          break;
        case "slower":
          if ($("#noteInput").is(":focus") == false) {
            player.setPlaybackRate(player.getPlaybackRate() - 0.25);
          }
          break;
        case "faster":
          if ($("#noteInput").is(":focus") == false) {
            player.setPlaybackRate(player.getPlaybackRate() + 0.25);
          }
          break;
        default:
      }
    }

    switch (shortcuts.keys[shortcut]) {
      case "take a note":
        player.pauseVideo();
        takeNote.style.display = "none";
        noteInput.style.display = "flex";
        commands.style.display = "none";
        noteInput.focus();
        break;
      case "cancel":
        player.pauseVideo();
        recoverFromNoteInput();
        break;
      default:
    }
  };

  // note input

  noteInput.onkeydown = async function(event) {
    var position;

    let shortcut = "";
    let shortcuts = {};

    shortcuts.keys = {
      Enter: "take a note",
      NumpadEnter: "take a note",
      "alt+Enter": "take a child note without a timestamp",
      "alt+NumpadEnter": "take a child note without a timestamp",
      "ctrl+Enter": "take a child note with a timestamp",
      "ctrl+NumpadEnter": "take a child note with a timestamp",
      "shift+Enter": "ask a question",
      "shift+NumpadEnter": "ask a question",
      "ctrl+shift+Enter": "ask a child question",
      "ctrl+shift+NumpadEnter": "ask a child question"
    };

    if (event.ctrlKey) shortcut += "ctrl+";

    if (event.altKey) shortcut += "alt+";

    if (event.shiftKey) shortcut += "shift+";

    if (event.code) {
      shortcut += event.code;
    }

    // different ways to take a note
    switch (shortcuts.keys[shortcut]) {
      case "take a note": {
        var delay = Number(document.getElementById("delayInput").value);

        rewind();

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        var text = `[${durationToFormatedTime(
          player.playerInfo.currentTime - delay
        )}](https://youtube.com/watch?v=${video_id}&t=${Math.floor(
          player.playerInfo.currentTime - delay
        )}) ${noteInput.value}`;

        var inserted = false;
        for (position = 1; position < child_array.length; position++) {
          const clock = (await RemNoteAPI.v0.get(child_array[position])).name[0]
            .text;

          if (clock === undefined) continue;

          if (
            formatedTimeToDuration(clock) >
            player.playerInfo.currentTime - delay
          ) {
            await RemNoteAPI.v0.create(text, pluginId, {
              positionAmongstSiblings: position
            });

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          await RemNoteAPI.v0.create(text, pluginId);
        }

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        update_timeline(position);

        recoverFromNoteInput();

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function() {
          $("html, body").animate(
            {
              scrollTop: $("#" + position).offset().top
            },
            0
          );
        }, 500);

        player.playVideo();
        break;
      }
      case "take a child note without a timestamp": {
        var delay = Number(document.getElementById("delayInput").value);

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;
        var current_rem = plugin_rem.children[current_chapter];

        if (child_array.length > 1) rewind();

        await RemNoteAPI.v0.create(noteInput.value, current_rem);

        update_note_child();

        recoverFromNoteInput();

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function() {
          $("html, body").animate(
            {
              scrollTop: $("#" + current_chapter).offset().top
            },
            100
          );
        }, 500);

        player.playVideo();
        break;
      }
      case "take a child note with a timestamp": {
        var delay = Number(document.getElementById("delayInput").value);

        //rewind();

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        if (child_array.length > 1) rewind();

        var text = `[${durationToFormatedTime(
          player.playerInfo.currentTime - delay
        )}](https://youtube.com/watch?v=${video_id}&t=${Math.floor(
          player.playerInfo.currentTime - delay
        )}) ${noteInput.value}`;

        var current_rem = plugin_rem.children[current_chapter];

        var child_child_array = (await RemNoteAPI.v0.get(current_rem)).children;

        var inserted = false;
        let count_no_timestamp = 0;
        for (position = 0; position < child_child_array.length; position++) {
          if (
            (await RemNoteAPI.v0.get(child_child_array[position])).name[0]
              .text === undefined
          )
            count_no_timestamp++;
        }

        for (
          position = 0;
          position < child_child_array.length - count_no_timestamp;
          position++
        ) {
          const clock = (await RemNoteAPI.v0.get(child_child_array[position]))
            .name[0].text;
          if (clock === undefined) continue;
          if (
            formatedTimeToDuration(clock) >
            player.playerInfo.currentTime - delay
          ) {
            await RemNoteAPI.v0.create(text, current_rem, {
              positionAmongstSiblings: position
            });

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          await RemNoteAPI.v0.create(text, current_rem, {
            positionAmongstSiblings: position
          });
        }

        update_note_child(position);

        recoverFromNoteInput();

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function() {
          $("html, body").animate(
            {
              scrollTop: $("#" + current_chapter).offset().top
            },
            100
          );
        }, 500);

        player.playVideo();
        break;
      }
      case "ask a question": {
        var delay = Number(document.getElementById("delayInput").value);

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        var text = `[${durationToFormatedTime(
          player.playerInfo.currentTime - delay
        )}](https://youtube.com/watch?v=${video_id}&t=${Math.floor(
          player.playerInfo.currentTime - delay
        )}) answer << ${noteInput.value}`;

        var inserted = false;
        for (position = 1; position < child_array.length; position++) {
          const clock = (await RemNoteAPI.v0.get(child_array[position])).name[0]
            .text;

          if (clock === undefined) continue;

          if (
            formatedTimeToDuration(clock) >
            player.playerInfo.currentTime - delay
          ) {
            await RemNoteAPI.v0.create(text, pluginId, {
              positionAmongstSiblings: position
            });

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          await RemNoteAPI.v0.create(text, pluginId);
        }

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        update_timeline(position);

        recoverFromNoteInput();

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function() {
          $("html, body").animate(
            {
              scrollTop: $("#" + position).offset().top
            },
            0
          );
        }, 500);

        player.playVideo();
        break;
      }
      case "ask a child question": {
        var delay = Number(document.getElementById("delayInput").value);

        plugin_rem = await RemNoteAPI.v0.get(pluginId);
        child_array = plugin_rem.children;

        if (child_array.length > 1) rewind();

        var text = `[${durationToFormatedTime(
          player.playerInfo.currentTime - delay
        )}](https://youtube.com/watch?v=${video_id}&t=${Math.floor(
          player.playerInfo.currentTime - delay
        )}) answer << ${noteInput.value}`;

        var current_rem = plugin_rem.children[current_chapter];

        var child_child_array = (await RemNoteAPI.v0.get(current_rem)).children;

        var inserted = false;
        let count_no_timestamp = 0;
        for (position = 0; position < child_child_array.length; position++) {
          if (
            (await RemNoteAPI.v0.get(child_child_array[position])).name[0]
              .text === undefined
          )
            count_no_timestamp++;
        }

        for (
          position = 0;
          position < child_child_array.length - count_no_timestamp;
          position++
        ) {
          const clock = (await RemNoteAPI.v0.get(child_child_array[position]))
            .name[0].text;
          if (clock === undefined) continue;
          if (
            formatedTimeToDuration(clock) >
            player.playerInfo.currentTime - delay
          ) {
            await RemNoteAPI.v0.create(text, current_rem, {
              positionAmongstSiblings: position
            });

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          await RemNoteAPI.v0.create(text, current_rem, {
            positionAmongstSiblings: position
          });
        }

        update_note_child(position);

        recoverFromNoteInput();

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function() {
          $("html, body").animate(
            {
              scrollTop: $("#" + current_chapter).offset().top
            },
            100
          );
        }, 500);

        player.playVideo();
        break;
      }

      default: {
      }
    }
  };

  // FUNCTIONS

  function recoverFromNoteInput() {
    noteInput.value = "";
    noteInput.blur();
    noteInput.style.display = "none";
    commands.style.display = "flex";
  }

  // youtube state

  function onPlayerStateChange(event) {
    // initialize
    if (event.data == -1) {
      $(window).focus();
      if (enable_parameter) {
        const speed_parameter_value = parameters.get("playback_speed");

        setTimeout(function() {
          if (speed_parameter_value != null) {
            player.setPlaybackRate(Number(speed_parameter_value));
          }
        }, 1000);
      }
    }

    // pause
    if (event.data == 2) {
      paused = true;
      cancel_auto_scroll = true;
    } else {
      paused = false;
      cancel_auto_scroll = false;
    }
  }

  // durations

  // seconds to 0:00 (or 0:00:00)
  function durationToFormatedTime(duration) {
    if (duration < 0) duration = 0;

    var hour = ~~(duration / 3600);
    var min = ~~((duration % 3600) / 60);
    var sec = ~~duration % 60;

    var ret = "";

    if (hour > 0) {
      ret += "" + hour + ":" + (min < 10 ? "0" : "");
    }

    ret += "" + min + ":" + (sec < 10 ? "0" : "");
    ret += "" + sec;

    return ret;
  }

  // 0:00 (or 0:00:00) to seconds
  function formatedTimeToDuration(time) {
    if (time == undefined || time == 0) return 0;

    var line_time = time.split(":");
    var duration;
    var min, sec, hour;

    if (line_time.length == 2) {
      min = Number(line_time[0]);
      sec = Number(line_time[1]);
      duration = min * 60 + sec;
    } else if (line_time.length == 3) {
      hour = Number(line_time[0]);
      min = Number(line_time[1]);
      sec = Number(line_time[2]);
      duration = hour * 3600 + min * 60 + sec;
    }
    return duration;
  }

  function rewind() {
    const delay = Number(document.getElementById("delayInput").value);
    var currentTime = player.getCurrentTime();

    if (currentTime > delay) {
      player.seekTo(currentTime - delay, true);
    }
  }

  // function to load when the youtube video is ready
  async function timeline(refresh) {
    // playback speed

    if (!refresh) {
      if (enable_parameter) {
        const speed_parameter_value = parameters.get("playback_speed");

        setTimeout(function() {
          if (speed_parameter_value != null) {
            player.setPlaybackRate(parseFloat(speed_parameter_value));
          }
        }, 1000);
      }
    }

    // youtube

    const player_duration = player.getDuration();
    const player_width = ytplayer.getBoundingClientRect().width;

    // rem

    plugin_rem = await RemNoteAPI.v0.get(pluginId);
    child_array = plugin_rem.children;

    //notes

    const div = document.getElementById("note");
    div.innerHTML = "";

    if (child_array.length < 2) {
      create_chapter();
      return;
    }

    const ul0 = document.createElement("ul");
    div.appendChild(ul0);
    const child_list = document.createElement("div");

    for (let i = 1; i <= child_array.length; i++) {
      if (i > 1) var previous_rem = rem;

      // level 0

      const li0 = document.createElement("li");
      let id0 = "_0-" + i;
      li0.id = id0;

      if (i < child_array.length) ul0.appendChild(li0);

      // input

      const input0 = document.createElement("input");

      input0.type = "button";

      input0.id = i;
      input0.class = "btn me-2";
      input0.style.background = color_0[(i - 1) % color_0.length];

      // list children
      if (i < child_array.length) {
        var rem = await RemNoteAPI.v0.get(child_array[i]);

        if (rem.name.length > 1) {
          input0.value = rem.name[0].text;
          if (rem.content != undefined) {
            input0.rem = rem.content[0];
          } else {
            input0.rem = rem.name[1].substr(1);
          }
        }
      }

      $(input0).on("click", function() {
        $("html, body").animate(
          {
            scrollTop: $(this).offset().top
          },
          100
        );
        var clock = $(this).val();
        player.seekTo(formatedTimeToDuration(clock), true);
      });

      $(input0).on("mouseenter", function() {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(input0).on("mouseleave", function() {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });

      // text
      if (rem.name.length > 1) {
        li0.appendChild(input0);
        if (rem.content != undefined) {
          var newContent0 = document.createTextNode(" " + rem.content[0]);
        } else {
          var newContent0 = document.createTextNode("" + rem.name[1]);
        }
      } else {
        var newContent0 = document.createTextNode("" + rem.name[0]);
      }

      li0.appendChild(newContent0);

      // list children
      if (i < child_array.length) {
        const child0_rem = await RemNoteAPI.v0.get(child_array[i]);

        // level 1
        const ul1 = document.createElement("ul");
        if (child0_rem.children != undefined) {
          for (let n1 = 0; n1 < child0_rem.children.length; n1++) {
            const li1 = document.createElement("li");
            let id1 = id0 + "_1-" + n1;
            li1.id = id1;
            const child1_rem = await RemNoteAPI.v0.get(child0_rem.children[n1]);

            const input1 = document.createElement("input");
            input1.type = "button";

            $(input1).addClass("me-2");
            input1.style.background = color_1[(i - 1) % color_1.length];

            if (child1_rem.name.length > 1) {
              input1.value = child1_rem.name[0].text;
              if (rem.content != undefined) {
                input1.rem = rem.content[0];
              } else {
                input1.rem = rem.name[1].substr(1);
              }
            }

            $(input1).on("click", function() {
              $("html, body").animate(
                {
                  scrollTop: $(this).offset().top
                },
                100
              );
              const clock = $(this).val();
              player.seekTo(formatedTimeToDuration(clock), true);
            });

            $(input1).on("mouseenter", function() {
              $(this).css(
                "background",
                color_1_hover[(i - 1) % color_1_hover.length]
              );
            });

            $(input1).on("mouseleave", function() {
              $(this).css("background", color_1[(i - 1) % color_1.length]);
            });

            if (child1_rem.name.length > 1) {
              li1.appendChild(input1);
              if (child1_rem.content != undefined) {
                var newContent1 = document.createTextNode(
                  " " + child1_rem.content[0]
                );
              } else {
                var newContent1 = document.createTextNode(
                  "" + child1_rem.name[1]
                );
              }
            } else {
              var newContent1 = document.createTextNode(
                "" + child1_rem.name[0]
              );
            }

            li1.appendChild(newContent1);
            ul1.appendChild(li1);

            // level 2
            const ul2 = document.createElement("ul");
            if (child1_rem.children != undefined) {
              for (let n2 = 0; n2 < child1_rem.children.length; n2++) {
                const li2 = document.createElement("li");
                let id2 = id1 + "_2-" + n2;
                li2.id = id2;
                const child2_rem = await RemNoteAPI.v0.get(
                  child1_rem.children[n2]
                );

                const input2 = document.createElement("input");
                input2.type = "button";

                $(input2).addClass("me-2");
                input2.style.background = color_2[(i - 1) % color_2.length];

                if (child2_rem.name.length > 1) {
                  input2.value = child2_rem.name[0].text;
                  input2.rem = child2_rem.name[1].substr(1);
                }

                $(input2).on("click", function() {
                  $("html, body").animate(
                    {
                      scrollTop: $(this).offset().top
                    },
                    100
                  );
                  const clock = $(this).val();
                  player.seekTo(formatedTimeToDuration(clock), true);
                });

                $(input2).on("mouseenter", function() {
                  $(this).css(
                    "background",
                    color_2_hover[(i - 1) % color_2_hover.length]
                  );
                });

                $(input2).on("mouseleave", function() {
                  $(this).css("background", color_2[(i - 1) % color_2.length]);
                });

                if (child2_rem.name.length > 1) {
                  li2.appendChild(input2);
                  var newContent2 = document.createTextNode(
                    "" + child2_rem.name[1]
                  );
                } else {
                  var newContent2 = document.createTextNode(
                    "" + child2_rem.name[0]
                  );
                }

                li2.appendChild(newContent2);
                ul2.appendChild(li2);

                // level 3
                const ul3 = document.createElement("ul");
                if (child2_rem.children != undefined) {
                  for (let n3 = 0; n3 < child2_rem.children.length; n3++) {
                    const li3 = document.createElement("li");
                    let id3 = id2 + "_3-" + n3;
                    li3.id = id3;
                    const child3_rem = await RemNoteAPI.v0.get(
                      child2_rem.children[n3]
                    );

                    const input3 = document.createElement("input");
                    input3.type = "button";

                    $(input3).addClass("me-2");
                    input3.style.background = color_3[(i - 1) % color_3.length];

                    if (child3_rem.name.length > 1) {
                      input3.value = child3_rem.name[0].text;
                      input3.rem = child3_rem.name[1].substr(1);
                    }

                    $(input3).on("click", function() {
                      $("html, body").animate(
                        {
                          scrollTop: $(this).offset().top
                        },
                        100
                      );
                      const clock = $(this).val();
                      player.seekTo(formatedTimeToDuration(clock), true);
                    });

                    $(input3).on("mouseenter", function() {
                      $(this).css(
                        "background",
                        color_3_hover[(i - 1) % color_3_hover.length]
                      );
                    });

                    $(input3).on("mouseleave", function() {
                      $(this).css(
                        "background",
                        color_3[(i - 1) % color_3.length]
                      );
                    });

                    if (child3_rem.name.length > 1) {
                      li3.appendChild(input3);
                      var newContent3 = document.createTextNode(
                        "" + child3_rem.name[1]
                      );
                    } else {
                      var newContent3 = document.createTextNode(
                        "" + child3_rem.name[0]
                      );
                    }

                    li3.appendChild(newContent3);
                    ul3.appendChild(li3);

                    // level 4
                    const ul4 = document.createElement("ul");
                    if (child3_rem.children != undefined) {
                      for (let n4 = 0; n4 < child3_rem.children.length; n4++) {
                        const li4 = document.createElement("li");
                        let id4 = id3 + "_4-" + n4;
                        li4.id = id4;
                        const child4_rem = await RemNoteAPI.v0.get(
                          child3_rem.children[n4]
                        );

                        const input4 = document.createElement("input");
                        input4.type = "button";

                        $(input4).addClass("me-2");
                        input4.style.background =
                          color_3[(i - 1) % color_3.length];

                        if (child4_rem.name.length > 1) {
                          input4.value = child4_rem.name[0].text;
                          input4.rem = child4_rem.name[1].substr(1);
                        }

                        $(input4).on("click", function() {
                          $("html, body").animate(
                            {
                              scrollTop: $(this).offset().top
                            },
                            100
                          );
                          var clock = $(this).val();
                          player.seekTo(formatedTimeToDuration(clock), true);
                        });

                        $(input4).on("mouseenter", function() {
                          $(this).css(
                            "background",
                            color_4_hover[(i - 1) % color_4_hover.length]
                          );
                        });

                        $(input4).on("mouseleave", function() {
                          $(this).css(
                            "background",
                            color_4[(i - 1) % color_4.length]
                          );
                        });

                        if (child4_rem.name.length > 1) {
                          li4.appendChild(input4);
                          var newContent4 = document.createTextNode(
                            "" + child4_rem.name[1]
                          );
                        } else {
                          var newContent4 = document.createTextNode(
                            "" + child4_rem.name[0]
                          );
                        }

                        li4.appendChild(newContent4);
                        ul4.appendChild(li4);

                        // level 5
                        const ul5 = document.createElement("ul");
                        if (child4_rem.children != undefined) {
                          for (
                            let n5 = 0;
                            n5 < child4_rem.children.length;
                            n5++
                          ) {
                            const li5 = document.createElement("li");
                            let id5 = id4 + "_5-" + n5;
                            li5.id = id5;

                            const child5_rem = await RemNoteAPI.v0.get(
                              child4_rem.children[n5]
                            );

                            const input5 = document.createElement("input");
                            input5.type = "button";

                            $(input5).addClass("me-2");
                            input5.style.background =
                              color_5[(i - 1) % color_5.length];

                            if (child5_rem.name.length > 1) {
                              input5.value = child5_rem.name[0].text;
                              input5.rem = child5_rem.name[1].substr(1);
                            }

                            $(input5).on("click", function() {
                              $("html, body").animate(
                                {
                                  scrollTop: $(this).offset().top
                                },
                                100
                              );
                              const clock = $(this).val();
                              player.seekTo(
                                formatedTimeToDuration(clock),
                                true
                              );
                            });

                            $(input5).on("mouseenter", function() {
                              $(this).css(
                                "background",
                                color_5_hover[(i - 1) % color_5_hover.length]
                              );
                            });

                            $(input5).on("mouseleave", function() {
                              $(this).css(
                                "background",
                                color_5[(i - 1) % color_5.length]
                              );
                            });

                            if (child5_rem.name.length > 1) {
                              li5.appendChild(input5);
                              var newContent5 = document.createTextNode(
                                "" + child5_rem.name[1]
                              );
                            } else {
                              var newContent5 = document.createTextNode(
                                "" + child5_rem.name[0]
                              );
                            }

                            li5.appendChild(newContent5);
                            ul5.appendChild(li5);
                          }
                        }
                        li4.appendChild(ul5);
                      }
                    }
                    li3.appendChild(ul4);
                  }
                }
                li2.appendChild(ul3);
              }
            }
            li1.appendChild(ul2);
          }
          li0.appendChild(ul1);
        }
      }
    }

    div.appendChild(child_list);

    create_chapter();

    // last tasks before the end

    // inputs
    for (let i = 1; i < child_array.length; i++) {
      $("input#" + i).attr("class", "me-2 ");
    }

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
    }
  }

  async function update_timeline(position) {
    const delay = Number(document.getElementById("delayInput").value);
    const div = document.getElementById("note");

    // ul level 0

    let read_ul = div.getElementsByTagName("ul");
    let ul0 = read_ul.item(0);

    if (ul0 == null) {
      ul0 = document.createElement("ul");
      ul0.id = "tree";
      div.appendChild(ul0);
    } else {
      ul0.id = "tree";
    }

    // update the current note

    const li0 = document.createElement("li");
    li0.id = "#" + "_0-" + position;

    const input0 = document.createElement("input");
    input0.type = "button";
    input0.id = position;

    input0.value = durationToFormatedTime(
      player.playerInfo.currentTime
    );
    input0.rem = noteInput.value;

    $(input0).on("click", function() {
      $("html, body").animate(
        {
          scrollTop: $("#" + input0.id).offset().top
        },
        100
      );

      var clock = $("input#" + position).val();
      player.seekTo(formatedTimeToDuration(clock), true);
    });

    $(input0).addClass("me-2");
    input0.style.background = color_0[(position - 1) % color_0.length];

    $(input0).on("mouseenter", function() {
      $(this).css(
        "background",
        color_0_hover[(position - 1) % color_0_hover.length]
      );
    });

    $(input0).on("mouseleave", function() {
      $(this).css("background", color_0[(position - 1) % color_0.length]);
    });

    var newContent0 = document.createTextNode(" " + noteInput.value);

    li0.appendChild(input0);
    li0.appendChild(newContent0);

    let ul1 = document.createElement("ul");
    li0.appendChild(ul1);

    if (position === 1) {
      $(ul0).prepend(li0);
    } else {
      $("#tree > li:nth-child( " + (position - 1) + " )").after(li0);
    }

    // updates the next notes

    // level 0

    for (let i = 1; i <= child_array.length; i++) {
      let line0 = "#tree > li:nth-child(" + i + ")";
      let id0 = "_0-" + i;
      let input0 = line0 + " > input";

      $(line0).attr("id", id0);

      $(input0).attr("id", i);

      $(input0).css("background", color_0[(i - 1) % color_0.length]);

      $(input0).on("mouseenter", function() {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(input0).on("mouseleave", function() {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });

      $(input0).on("click", function() {
        $("html, body").animate(
          {
            scrollTop: $("#" + i).offset().top
          },
          100
        );

        var clock = $(this).val();
        player.seekTo(formatedTimeToDuration(clock), true);
      });

      // level 1

      let len_j = $(line0 + " > ul li").length;
      for (let j = 1; j <= len_j; j++) {
        let line1 = line0 + "> ul > li:nth-child(" + j + ")";
        let id1 = id0 + "_1-" + (j - 1);
        let input1 = line1 + " > input";

        $(line1).attr("id", id1);

        $(input1).css("background", color_1[(i - 1) % color_1.length]);

        $(input1).on("mouseenter", function() {
          $(this).css(
            "background",
            color_1_hover[(i - 1) % color_1_hover.length]
          );
        });

        $(input1).on("mouseleave", function() {
          $(this).css("background", color_1[(i - 1) % color_1.length]);
        });

        $(input1).on("click", function() {
          var clock = $(this).val();
          player.seekTo(formatedTimeToDuration(clock), true);
        });

        // level 2

        let len_k = $(line1 + " > ul li").length;
        for (let k = 1; k <= len_k; k++) {
          let line2 = line1 + " > ul > li:nth-child(" + k + ")";
          let id2 = id1 + "_2-" + (k - 1);
          let input2 = line2 + " > input";

          $(line2).attr("id", id2);

          $(input2).css("background", color_2[(i - 1) % color_2.length]);
          $(input2).on("mouseenter", function() {
            $(this).css(
              "background",
              color_2_hover[(i - 1) % color_2_hover.length]
            );
          });
          $(input2).on("mouseleave", function() {
            $(this).css("background", color_2[(i - 1) % color_2.length]);
          });

          // level 3

          let len_l = $(line2 + " > ul li").length;
          for (let l = 1; l <= len_l; l++) {
            let line3 = line2 + " > ul > li:nth-child(" + l + ")";
            let id3 = id2 + "_3-" + (l - 1);
            let input3 = line3 + " > input";

            $(line3).attr("id", id3);

            $(input3).css("background", color_3[(i - 1) % color_3.length]);

            $(input3).on("mouseenter", function() {
              $(this).css(
                "background",
                color_3_hover[(i - 1) % color_3_hover.length]
              );
            });

            $(input3).on("mouseleave", function() {
              $(this).css("background", color_3[(i - 1) % color_3.length]);
            });

            // level 4

            let len_m = $(line3 + " > ul li").length;
            for (let m = 1; m <= len_m; m++) {
              let line4 = line3 + "> ul > li:nth-child(" + m + ")";
              let id4 = id3 + "_4-" + (m - 1);
              let input4 = line4 + " > input";

              $(line4).attr("id", id4);

              $(input4).css("background", color_4[(i - 1) % color_4.length]);
              $(input4).on("mouseenter", function() {
                $(this).css(
                  "background",
                  color_4_hover[(i - 1) % color_4_hover.length]
                );
              });
              $(input4).on("mouseleave", function() {
                $(this).css("background", color_4[(i - 1) % color_4.length]);
              });

              // level 5

              let len_n = $(line4 + " > ul li").length;
              for (let n = 1; n <= len_n; n++) {
                let line5 = line4 + " > ul > li:nth-child(" + n + ")";
                let id5 = id4 + "_5-" + (n - 1);
                let input5 = line5 + " > input";

                $(line5).attr("id", id5);

                $(input5).css("background", color_5[(i - 1) % color_5.length]);

                $(input5).on("mouseenter", function() {
                  $(this).css(
                    "background",
                    color_5_hover[(i - 1) % color_5_hover.length]
                  );
                });

                $(input5).on("mouseleave", function() {
                  $(this).css("background", color_5[(i - 1) % color_5.length]);
                });
              }
            }
          }
        }
      }
    }

    update_chapter(position);

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
    }
  }

  function update_note_child(position) {
    const delay = Number(document.getElementById("delayInput").value);

    var referenceNode = document.querySelector(
      "#" + "_0-" + current_chapter + " > ul"
    );

    const li1 = document.createElement("li");

    // ctrl + enter only
    if (position != undefined) {
      li1.id = "_0-" + current_chapter + "_1-" + position;

      const input1 = document.createElement("input");
      input1.type = "button";
      input1.value = durationToFormatedTime(
        player.playerInfo.currentTime
      );
      input1.rem = noteInput.value;

      const color = current_chapter;

      $(input1).on("click", function() {
        $("html, body").animate(
          {
            scrollTop: $(this).offset().top
          },
          100
        );

        var clock = input1.value;
        player.seekTo(formatedTimeToDuration(clock), true);
      });

      input1.style.background = color_1[(current_chapter - 1) % color_1.length];

      $(input1).on("mouseenter", function() {
        $(this).css(
          "background",
          color_1_hover[(color - 1) % color_1_hover.length]
        );
      });

      $(input1).on("mouseleave", function() {
        $(this).css("background", color_1[(color - 1) % color_1.length]);
      });
      $(input1).addClass("me-2");
      li1.appendChild(input1);
    }

    var newContent1 = document.createTextNode(" " + noteInput.value);

    li1.appendChild(newContent1);

    // ctrl + enter
    if (position != undefined) {
      var referenceNode = document.querySelector(
        "#" + "_0-" + current_chapter + " > ul"
      );

      if (position == 0 && referenceNode.children.length == 0) {
        var referenceNode = document.querySelector(
          "#" + "_0-" + current_chapter + " > ul"
        );
        referenceNode.appendChild(li1);
      } else if (position == 0 && referenceNode.children.length > 0) {
        var referenceNode = document.querySelector(
          "#" + "_0-" + current_chapter + "_1-" + position
        );
        referenceNode.parentNode.insertBefore(li1, referenceNode);

        var referenceNode = document.querySelector(
          "#" + "_0-" + current_chapter + " > ul"
        );
        let children = referenceNode.children;
        for (let i = 0; i < children.length; i++) {
          children[i].id = "_0-" + current_chapter + "_1-" + i;
        }
      } else {
        var referenceNode = document.querySelector(
          "#" + "_0-" + current_chapter + "_1-" + (position - 1)
        );
        referenceNode.parentNode.insertBefore(li1, referenceNode.nextSibling);
      }

      var referenceNode = document.querySelector(
        "#" + "_0-" + current_chapter + " > ul"
      );
      let children = referenceNode.children;
      for (let i = 0; i < children.length; i++) {
        children[i].id = "_0-" + current_chapter + "_1-" + i;
      }
      // alt + enter
    } else {
      var referenceNode = document.querySelector(
        "#" + "_0-" + current_chapter + " > ul"
      );

      referenceNode.appendChild(li1);

      let children = referenceNode.children;
      for (let i = 0; i < children.length; i++) {
        children[i].id = "_0-" + current_chapter + "_1-" + i;
      }
    }

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
    }
  }

  async function create_chapter() {
    const player_duration = player.getDuration();
    const player_width = ytplayer.getBoundingClientRect().width;

    var plugin_rem = await RemNoteAPI.v0.get(pluginId);

    child_array = plugin_rem.children;

    $("#line").html("");

    line_div.innerHTML = "";

    chapter = [];

    if (child_array.length < 2) return;

    for (let i = 1; i <= child_array.length; i++) {
      if (i > 1) var previous_rem = rem;

      if (i < child_array.length)
        var rem = await RemNoteAPI.v0.get(child_array[i]);

      if (rem.name.length > 1) {
        chapter.push(document.createElement("div"));
        const clock = rem.name[0].text;

        chapter[chapter.length - 1].id = "c" + (i - 1);

        chapter[chapter.length - 1].delay = formatedTimeToDuration(clock);

        $(chapter[chapter.length - 1]).attr("class", "mt-2 chapter");

        if (i == 2)
          $(chapter[chapter.length - 1]).attr(
            "class",
            "rounded-start mt-2 chapter"
          );

        if (i > 1) {
          chapter[chapter.length - 1].start = chapter[chapter.length - 2].delay;

          if (previous_rem.name.length > 1) {
            chapter[chapter.length - 1].rem = previous_rem.name[1].substr(1);
          } else {
            chapter[chapter.length - 1].rem = previous_rem.name[0];
          }

          chapter[chapter.length - 1].style.left =
            (chapter[chapter.length - 2].delay / player_duration) *
              (player_width - 20) +
            20 +
            "px";

          chapter[chapter.length - 1].style.width =
            (chapter[chapter.length - 1].delay / player_duration) *
              (player_width - 20) -
            (chapter[chapter.length - 2].delay / player_duration) *
              (player_width - 20) +
            2 +
            "px";

          chapter[chapter.length - 1].num = i;

          // last chapter
          if (i == child_array.length) {
            $(chapter[chapter.length - 1]).attr(
              "class",
              "rounded-end mt-2 chapter"
            );

            chapter[chapter.length - 1].style.width =
              player_width -
              player_margin -
              (chapter[chapter.length - 2].delay / player_duration) *
                (player_width - 20) +
              10 +
              "px";
          }

          // one chapter only
          if (child_array.length == 2)
            $(chapter[chapter.length - 1]).attr(
              "class",
              "rounded-start rounded-end mt-2 chapter"
            );

          // tooltip
          $(chapter[chapter.length - 1]).attr("data-toggle", "tooltip");
          if (previous_rem.name.length > 1) {
            $(chapter[chapter.length - 1]).attr(
              "title",
              previous_rem.name[0].text + "\n" + previous_rem.name[1].substr(1)
            );
          } else {
            $(chapter[chapter.length - 1]).attr(
              "title",
              previous_rem.name[0].text
            );
          }

          chapter[chapter.length - 1].style.background =
            color_0[(i - 2) % color_0.length];

          $(chapter[chapter.length - 1]).click(function() {
            current_chapter = i - 1;

            $("html, body").animate(
              {
                scrollTop: $("#" + (i - 1)).offset().top
              },
              100
            );
            player.seekTo(this.start, true);
          });

          $(chapter[chapter.length - 1]).on("mouseenter", function() {
            $(this).css(
              "background",
              color_0_hover[(i - 2) % color_0_hover.length]
            );
          });

          $(chapter[chapter.length - 1]).on("mouseleave", function() {
            $(this).css("background", color_0[(i - 2) % color_0.length]);
          });

          if (i > 0) line_div.appendChild(chapter[chapter.length - 1]);
        }
      }
    }

    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  async function update_chapter(position) {
    const player_duration = player.getDuration();
    const player_width = ytplayer.getBoundingClientRect().width;

    // unique
    if (child_array.length == 2) {
      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = await RemNoteAPI.v0.get(child_array[position]);

      const clock = rem.name[0].text;

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 20) +
        20 +
        "px";

      temp_chapter.start = temp_chapter.delay;

      temp_chapter.style.width =
        player_width -
        player_margin -
        (temp_chapter.delay / player_duration) * player_width +
        10 +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[1];

      $(temp_chapter).click(function() {
        current_chapter = position;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top
          },
          100
        );
        player.seekTo(this.delay, true);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      var referenceNode = document.querySelector("#" + "line");

      referenceNode.appendChild(temp_chapter);
      // first
    } else if (position == 1) {
      var referenceNode = document.querySelector("#" + "c" + position);
      var next_chapter = document.querySelector("#" + "c" + position);

      var temp_chapter = document.createElement("div");

      var rem = await RemNoteAPI.v0.get(child_array[position]);

      const clock = rem.name[0].text;

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 20) +
        20 +
        "px";

      temp_chapter.start = temp_chapter.delay;

      temp_chapter.style.width =
        (next_chapter.delay / player_duration) * player_width -
        (temp_chapter.delay / player_duration) * player_width +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[1];

      $(temp_chapter).click(function() {
        current_chapter = position;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top
          },
          100
        );
        player.seekTo(this.delay, true);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.insertBefore(temp_chapter, referenceNode);

      //insert in middle
    } else if (position < child_array.length - 1) {
      var referenceNode = document.querySelector("#" + "c" + (position - 1));

      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = await RemNoteAPI.v0.get(child_array[position]);

      const clock = rem.name[0].text;

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 20) +
        20 +
        "px";

      var previousNode = document.querySelector("#" + "c" + (position - 1));
      previousNode.style.width =
        temp_chapter.style.left.slice(0, -2) -
        previousNode.style.left.slice(0, -2) +
        "px";

      temp_chapter.start = temp_chapter.delay;

      var next_chapter = document.querySelector("#" + "c" + position);

      temp_chapter.style.width =
        (next_chapter.delay / player_duration) * player_width -
        (temp_chapter.delay / player_duration) * player_width +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[1];

      $(temp_chapter).click(function() {
        current_chapter = position;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top
          },
          100
        );
        player.seekTo(this.delay, true);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.insertBefore(
        temp_chapter,
        referenceNode.nextSibling
      );
      //insert last
    } else {
      var referenceNode = document.querySelector("#" + "c" + (position - 1));

      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = await RemNoteAPI.v0.get(child_array[position]);

      const clock = rem.name[0].text;

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 20) +
        20 +
        "px";

      var previousNode = document.querySelector("#" + "c" + (position - 1));
      previousNode.style.width =
        temp_chapter.style.left.slice(0, -2) -
        previousNode.style.left.slice(0, -2) +
        "px";

      temp_chapter.start = temp_chapter.delay;

      var next_chapter = document.querySelector("#" + "c" + position);

      temp_chapter.style.width =
        player_width -
        player_margin -
        (temp_chapter.delay / player_duration) * (player_width - 20) +
        10 +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[1];

      $(temp_chapter).click(function() {
        current_chapter = position;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top
          },
          100
        );
        player.seekTo(this.delay, true);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.appendChild(temp_chapter);
    }

    // update chapter id before
    var referenceNode = document.querySelector("#" + "line");
    let children = referenceNode.children;
    for (let i = 0; i < children.length; i++) {
      children[i].id = "c" + (i + 1);
    }

    // update style
    for (let i = 1; i < child_array.length; i++) {
      var referenceNode = document.querySelector("#" + "c" + i);

      $(referenceNode).removeClass();

      if (child_array.length == 2) {
        $(referenceNode).addClass("rounded-start rounded-end mt-2 chapter");
      } else if (i == child_array.length - 1) {
        $(referenceNode).addClass("rounded-end mt-2 chapter");
      } else if (i == 1) {
        $(referenceNode).addClass("rounded-start mt-2 chapter");
      } else {
        $(referenceNode).addClass("mt-2 chapter");
      }

      referenceNode.style.background = color_0[(i - 1) % color_0.length];

      $(referenceNode).on("mouseenter", function() {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(referenceNode).on("mouseleave", function() {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });
    }

    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
}
