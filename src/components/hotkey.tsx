import React from 'react';
import Hotkeys from 'react-hot-keys';
import { switchToInput } from '../lib/utils';
import { togglePlay, pause, forward, backward, backwardDelay } from '../lib/video';

/**
 * Hotkeys to control the video when the text input is not shown.
 */
export class KeyboardHotkey extends React.Component<{
    type: string;
    pause: string;
    forward: string;
    backward: string;
  }> {

  onKeyUp(keyName: any) {

    switch (keyName) {
      /**
       * Type a note
       */
      case this.props.type: {
        pause();
        switchToInput();
        backwardDelay();
        break;
      }
      /**
       * Pause
       */
      case this.props.pause: {
        togglePlay();
        break;
      }
      /**
       * Forward 5 seconds
       */
      case this.props.forward: {
        forward();
        break;
      }
      /**
       * Backward 5 seconds
       */
      case this.props.backward: {
        backward();
        break;
      }
    }
  }

  // all hotkeys are grouped in Hotkeys' keyname
  render() {
    const keys: string = 
      this.props.type + ', ' +
      this.props.pause + ', ' + 
      this.props.forward + ', ' + 
      this.props.backward;
    return (
      <Hotkeys
        keyName={keys}
        onKeyUp={this.onKeyUp.bind(this)}
      />
    )
  }
}

export default KeyboardHotkey;