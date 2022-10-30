import React, { useState } from 'react';
import { addLine, durationToFormatedTime, formatedTimeToDuration, toggleInputNote, getRemTimeStamp } from './utils';
import { RNPlugin, usePlugin } from '@remnote/plugin-sdk'
import { start } from './video';

/**
 * The component for the text input used by the user to type notes
 * @returns The render with a div to handle the keys and the text input
 */
export const InputNoteInput: React.FunctionComponent = () => {

  const [note, setNote] = useState('');

  /**
   * The note is updated after each key typed
   * 
   * @param event 
   */
  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNote(event.target.value);
  };

  const plugin = usePlugin();

  /**
   * Write a rem with a note with a timestamp
   * 
   * @param {RNPlugin} plugin - RemNote plugin used to manipulate the rems
   * @param {string} note - The note typed by the user
   * @returns {number} - Position used to write the rem among the siblings
   */
  const writeNoteWithTimestamp = async (plugin: RNPlugin, note: string) => {

    // create the text for the rem

    const id = localStorage.getItem('id');
    const timeString = localStorage.getItem('time');
    const link = `https://www.youtube.com/watch?v=${id}&t=${timeString}`;
    const timeInt = timeString ? parseInt(timeString) : undefined;
    const timestamp = timeInt ? `[${durationToFormatedTime(timeInt)}](${link})` : undefined;
    const noteWithTimetamp = timestamp ? timestamp + ' ' + note : '';

    // create the rem

    const rem = await plugin.rem.createRem();
    const text = await plugin.richText.text(noteWithTimetamp).value();
    await rem?.setText(text);

    const focusedRem = await plugin.focus?.getFocusedRem();
    const children = await focusedRem?.getChildrenRem();

    // find and return position sorted by time

    if (focusedRem && children) {
      let position = children.length;
      for (let i = 0; i < children.length; i++) {
        const text = String(children[i].text[0]);

        const timestamp = getRemTimeStamp(text);

        const currentTimestamp = timeInt;
        const childTimestamp = formatedTimeToDuration(timestamp);

        if ((childTimestamp && currentTimestamp) && (currentTimestamp < childTimestamp)) {
          position = i--;
          break;
        }
      }

      await rem?.setParent(focusedRem._id, position);

      return position;
    }
  }

  /**
   * The hotkeys from the input notes are not handled by the hotkey component
   * 
   * @param event Event needed for the last key code typed
   */
  const handleKey = async (event: { keyCode: number; }) => {
    switch (event.keyCode) {
      /**
       * Enter key
       * 
       * Confirm the note typed
       */
      case 13: {
        toggleInputNote(false);
        const position = await writeNoteWithTimestamp(plugin, note);
        if (position != undefined) addLine(note, position);
        setNote('');
        start();
        break;
      }
      /**
       * Escape key
       * 
       * Cancel the note typed
       */
      case 27: {
        setNote('');
        toggleInputNote(false);
        start();
        break;
      }
    }
  };

  return (
    <div onKeyUp={handleKey}>
      <input
        type='text'
        id='input'
        autoComplete='off'
        className='h-0 invisible w-full text-center'
        onChange={handleChange}
        value={note} />
    </div>
  );
};

export default InputNoteInput;