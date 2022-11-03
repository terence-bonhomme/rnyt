import React from 'react';
import Hotkeys from 'react-hot-keys';
import { switchToInput } from './utils';
import { togglePlay, pause, forward, backward, backwardDelay } from './video';

/**
 * Hotkeys to control the video when the text input is not shown.
 */
export class KeyboardHotkey extends React.Component {
  async onKeyUp(keyName: any) {

    switch (keyName) {
      /**
       * Type a note
       */
      case localStorage.getItem('type'): {
        pause();
        switchToInput();
        backwardDelay();
        break;
      }
      /**
       * Pause
       */
      case localStorage.getItem('pause'): {
        togglePlay();
        break;
      }
      /**
       * Forward 5 seconds
       */
      case localStorage.getItem('forward'): {
        forward();
        break;
      }
      /**
       * Backward 5 seconds
       */
      case localStorage.getItem('backward'): {
        backward();
        break;
      }
    }
  }

  // all hotkeys are grouped in Hotkeys' keyname
  render() {
    const keys: string = 
      String(localStorage.getItem('type')) + ', ' +
      String(localStorage.getItem('pause')) + ', ' + 
      String(localStorage.getItem('forward')) + ', ' + 
      String(localStorage.getItem('backward'));
    return (
      <Hotkeys
        keyName={keys}
        onKeyUp={this.onKeyUp.bind(this)}
      />
    )
  }
}

export default KeyboardHotkey;