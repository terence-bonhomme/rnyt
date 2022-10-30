import React from 'react';
import Hotkeys from 'react-hot-keys';
import { switchToInput } from './utils';
import { togglePlay, pause, forward, backward, backwardDelay } from './video';

/**
 * Hotkeys to control the video when the text input is not shown.
 */
export class KeyboardHotkey extends React.Component {
  onKeyUp(keyName: any) {
    switch (keyName) {
      /**
       * Type a note
       */
      case 'Enter': {
        pause();
        switchToInput();
        backwardDelay();
        break;
      }
      /**
       * Pause
       */
      case 'Space': {
        togglePlay();
        break;
      }
      /**
       * Forward 5 seconds
       */
      case 'right': {
        forward();
        break;
      }
      /**
       * Backward 5 seconds
       */
      case 'left': {
        backward();
        break;
      }
    }
  }

  // all hotkeys are grouped in Hotkeys' keyname
  render() {
    return (
      <Hotkeys
        keyName="Enter, Space, right, left"
        onKeyUp={this.onKeyUp.bind(this)}
      />
    )
  }
}

export default KeyboardHotkey;