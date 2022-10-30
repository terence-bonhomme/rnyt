/**
 * The plugin knows the video is on pause
 */
export const setPause = () => {
  localStorage.setItem('playing', 'false');
};

/**
 * The plugin knows the video is playing
 */
export const setStart = () => {
  localStorage.setItem('playing', 'true');
};

/**
 * Toggle play on the video with a click on a hidden button, 
 * used with the key space, check the render in widget.tsx
 */
export const togglePlay = () => {
  isPlaying() ? setPause() : setStart();
  document.getElementById("playButton")?.click();
};

/**
 * Check if the video is playing
 */
export const isPlaying = () => {
  return localStorage.getItem('playing') == 'true';
};

/**
 * Start the video with a click on a hidden button, check the render in widget.tsx
 */
export const start = () => {
  setStart();
  document.getElementById("playButton")?.click();
};

/**
 * Pause the video with a click on a hidden button, check the render in widget.tsx
 */
export const pause = () => {
  setPause();
  document.getElementById("playButton")?.click();
};

/**
 * Seek to tine on the video with a click on a hidden button, check the render in widget.tsx
 */
export const seekTo = () => {
  document.getElementById("seekToButton")?.click();
};

/**
 * Seek to the timestamp on the video with a click on a hidden button, check the render in widget.tsx
 */
export const seekToTimestamp = () => {
  document.getElementById("seekToTimestampButton")?.click();
  if (!isPlaying()) start();
};

/**
 * Forward on the video with a click on a hidden button, check the render in widget.tsx
 */
export const forward = () => {
  document.getElementById("fowardButton")?.click();
  if (isPlaying()) start();
};

/**
 * Backward on the video with a click on a hidden button, check the render in widget.tsx
 */
export const backward = () => {
  document.getElementById("backwardButton")?.click();
  if (isPlaying()) start();
};

/**
 * Backward the defined delay on the video with a click on a hidden button, check the render in widget.tsx
 */
export const backwardDelay = () => {
  document.getElementById("delayButton")?.click();
};