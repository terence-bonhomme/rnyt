import { renderWidget, usePlugin, useTracker } from '@remnote/plugin-sdk';
import KeyboardHotkey from '../components/hotkey';
import { useRef, useState } from 'react';
import { isPlaying } from '../components/video';
import ReactPlayer from 'react-player';
import { jumpToTimestamp, getRemTimeStamp as getRemTimeStamp, switchToInput } from '../components/utils';
import InputNoteInput from '../components/note-input';
import { COMMANDS_HEIGHT } from '../lib/constants';

export const Widget = () => {
  const plugin = usePlugin();

  let heightSetting = useTracker(() => plugin.settings.getSetting<number>('height'));
  let height = heightSetting ? heightSetting : 0;

  const [delay, setDelay] = useState(localStorage.getItem('delay'));

  const [speed, setSpeed] = useState(Number(localStorage.getItem('speed')));
  if (!speed) setSpeed(1);

  const [play, setPlay] = useState(false);

  const [videoId, setVideoId] = useState(localStorage.getItem('id'));

  const [previousInserted, setPreviousInserted] = useState(false);

  const typeKey: string = String(localStorage.getItem('type'));
  const pauseKey: string = String(localStorage.getItem('pause'));
  const forwardKey: string = String(localStorage.getItem('forward'));
  const backwardKey: string = String(localStorage.getItem('backward'));

  // get the react player component to control the video
  const player = useRef<ReactPlayer>(null)

  /**
   * Display previous notes on the side, only at the beginning
   */
  useTracker(async (reactivePlugin) => {
    if (!previousInserted) {
      const rem = await reactivePlugin.focus.getFocusedRem();
      const children = await rem?.getChildrenRem();
      if (children) children.forEach(child => {

        // create a note

        const li = document.createElement('li');
        const text = String(child.text[0]);

        // timestamp

        const timestamp = getRemTimeStamp(text);

        const button = document.createElement('button');
        button.textContent = timestamp;

        button.classList.add('bg-slate-200');
        button.classList.add('hover:bg-slate-400');
        button.classList.add('mr-1');
        button.classList.add('mb-1');
        button.classList.add('px-1');
        button.classList.add('rounded');

        button.addEventListener('click', (e: Event) => {
          jumpToTimestamp(button);
        })

        // text

        const regexNote: RegExp = /\s(.*)/gm
        const regexNoteRes = text?.match(regexNote);
        const note = regexNoteRes ? (regexNoteRes[0]).trimStart() : '';

        // attach a note

        li.appendChild(button);
        li.appendChild(document.createTextNode(note));
        document.getElementById('note-list')?.appendChild(li);
      });
      setPreviousInserted(true);
    }
  })

  return (
    <div className='App'>

      {/**
        * Hotkeys when the video is playing
        */}
      <KeyboardHotkey 
        type={typeKey} 
        pause={pauseKey}
        forward={forwardKey}
        backward={backwardKey}
      />

      {/**
        * The video width could be updated with the class
        */}
      <div id='left' className='w-2/3'>
        <div className=''>

          {/**
            * Reactplayer with parameters that could be used later for creating new hotkeys
            */}
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            controls={true}
            playing={play}
            ref={player}
            pip={false}
            light={false}
            volume={0.5}
            muted={false}
            played={0}
            loaded={0}
            duration={0}
            playbackRate={speed}
            loop={false}
            width={`auto`}
            height={height - COMMANDS_HEIGHT}
          />

          {/**
            * Play
            */}
          <button id='playButton' className='invisible h-0' onClick={() => {
            isPlaying() ? setPlay(true) : setPlay(false);
          }}>Play</button>

          {/**
            * Forward
            */}
          <button id='fowardButton' className='invisible h-0' onClick={() => {
            player.current?.seekTo(player.current.getCurrentTime() + 5);
          }}>Forward</button>

          {/**
            * Backward
            */}
          <button id='backwardButton' className='invisible h-0' onClick={() => {
            player.current?.seekTo(player.current.getCurrentTime() - 5);
          }
          }>Backward</button>

          {/**
            * Seek to timestamp
            */}
          <button id='seekToTimestampButton' className='invisible h-0' onClick={() => {
            const timestamp = localStorage.getItem('timestamp');
            if (timestamp) player.current?.seekTo(parseInt(timestamp));
          }
          }>SeekToTimestamp</button>

          {/**
            * Backward with delay
            */}
          <button id='delayButton' className='invisible h-0' onClick={() => {
            let time = player.current?.getCurrentTime();
            time = time && delay ? Math.floor(time) - parseInt(delay) : 0;
            localStorage.setItem('time', String(time))
            player.current?.seekTo(time);
          }
          }>Delay</button>
        </div>

        {/**
          * Timeline (not implemented)
          */}
        <div id="line" className='h-8 z-10'></div>

        {/**
          * Input Note
          */}
        <InputNoteInput />

        <div id='commands' className='columns-2 h-8'>

          {/**
            * Take Note button
            */}
          <div onClick={switchToInput}>
            <div className='hover:bg-zinc-200 text-slate-600 select-none text-center rounded'>Take Note</div>
          </div>

          {/**
            * Delay text input
            */}
          <input
            id='delayInput'
            type='text'
            value={delay as unknown as number}
            onChange={(e) => { setDelay(e.target.value) }}
            placeholder='Delay'
            autoComplete='off'
            className='
								bg-slate-100 hover:bg-zinc-200 placeholder:hover text-slate-600 w-full px-1 rounded text-align: center border-none'
          />
        </div>
      </div>

      {/**
        * Side notes
        */}
      <div
        id='note'
        className='absolute left-2/3 top-0 h-screen overflow-scroll scrollbar-hide pl-2'>
        <ul
          id='note-list'
          className='list-disc list-inside'></ul>
      </div>
    </div>
  );
};

renderWidget(Widget);
