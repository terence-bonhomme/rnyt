import { seekToTimestamp } from './video';

/**
 * Toggle the UI between the commands panel and the text input
 * 
 * @param {boolean} displayingCommands Commands are displayed
 */
export const toggleInputNote = (displayingCommands: boolean) => {
  const commands = document.getElementById("commands")?.classList;
  const input = document.getElementById("input")?.classList;

  if (displayingCommands) {
    commands?.replace("h-8", "h-0");
    commands?.add("invisible");

    input?.replace("h-0", "h-8");
    input?.remove("invisible");
  } else {
    input?.replace("h-8", "h-0");
    input?.add("invisible");

    commands?.replace("h-0", "h-8");
    commands?.remove("invisible");
  }
};

/**
 * Add a line on the side, it is only visual
 * 
 * @param {string} text The text of the note
 * @param {number} position The position of the line sorted by time
 */
export const addLine = (text: string, position: number) => {
  // create elemets
  const ul = document.querySelectorAll('ul')[0]
  const li = document.createElement("li");
  const button = document.createElement('button');

  // duration

  const duration = localStorage.getItem('time')
  if (duration) button.textContent = durationToFormatedTime(parseInt(duration));

  // button

  button.classList.add('bg-slate-200');
  button.classList.add('hover:bg-slate-400');
  button.classList.add('mr-1');
  button.classList.add('mb-1');
  button.classList.add('px-1');
  button.classList.add('rounded');

  button.addEventListener('click', (e: Event) => {
    jumpToTimestamp(button);
  })

  // attach elements

  li.appendChild(button);
  li.appendChild(document.createTextNode(text));

  if (position == 0) {
    ul.insertBefore(li, ul.firstChild);
  } else {
    ul.insertBefore(li, ul.children[position]);
  }
};

/**
 * Switch from the commands panel to the note input
 */
export const switchToInput = () => {
  toggleInputNote(true);
  document.getElementById("input")?.focus();
};

/**
 * Convert seconds to 0:00 (or 0:00:00)
 * 
 * @param {number} duration Duration in seconds
 * @returns {string} Duration in time format
 */
export const durationToFormatedTime = (duration: number): string => {
  if (duration < 0) duration = 0;

  const hour = ~~(duration / 3600);
  const min = ~~((duration % 3600) / 60);
  const sec = ~~duration % 60;

  let ret = "";

  if (hour > 0) {
    ret += "" + hour + ":" + (min < 10 ? "0" : "");
  }

  ret += "" + min + ":" + (sec < 10 ? "0" : "");
  ret += "" + sec;

  return ret;
};

/**
 * Convert 0:00 (or 0:00:00) to seconds
 * 
 * @param {string} time Time format
 * @returns {number} seconds
 */
export const formatedTimeToDuration = (time: string): number => {
  const lineTime = time.split(":");
  let duration = 0;
  let hour, min, sec;

  if (lineTime.length == 2) {
    min = Number(lineTime[0]);
    sec = Number(lineTime[1]);
    duration = min * 60 + sec;
  } else if (lineTime.length == 3) {
    hour = Number(lineTime[0]);
    min = Number(lineTime[1]);
    sec = Number(lineTime[2]);
    duration = hour * 3600 + min * 60 + sec;
  }
  return duration;
};

/**x
 * Get a timestamp as 0:00 (or 0:00:00) from a text
 * 
 * @param {string} text - The text used
 * @returns {string} The timestamp between the brackets
 */
export const getRemTimeStamp = (text: string): string => {
  const regexTimestamp: RegExp = /[0-9]{1,}:[0-9]{1,2}:{0,1}[0-9]{0,2}/
  const regexTimestampRes = text?.match(regexTimestamp)
  return regexTimestampRes ? regexTimestampRes[0] : '';
};

/**
 * Jump to the timestamp
 */
export const jumpToTimestamp = (button: HTMLButtonElement) => {
  const timestamp = button.innerText;
  localStorage.setItem('timestamp', String(formatedTimeToDuration(timestamp)));
  seekToTimestamp();
};