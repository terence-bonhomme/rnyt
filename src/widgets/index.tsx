import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { setPause } from '../lib/video';

const onActivate = async (plugin: ReactRNPlugin) => {
  await plugin.app.registerCommand({
    id: 'rnyt',
    name: 'rnyt',

    action: async () => {

      // YouTube video id

      localStorage.setItem('id', await getVideoId(plugin));

      // height setting

      await plugin.settings.registerNumberSetting({
        id: 'height',
        title: 'Height',
        defaultValue: 580,
      });

      // delay setting

      await plugin.settings.registerNumberSetting({
        id: 'delay',
        title: 'Delay',
        defaultValue: 0,
      });
      localStorage.setItem('delay', await plugin.settings.getSetting('delay'))

      // speed setting

      await plugin.settings.registerDropdownSetting({
        id: 'speed',
        title: 'Speed',
        defaultValue: '1',
        options: [{
          key: '0',
          label: '0.25',
          value: '0.25',
        },
        {
          key: '1',
          label: '0.5',
          value: '0.5',
        },
        {
          key: '2',
          label: '0.75',
          value: '0.75',
        },
        {
          key: '3',
          label: '1',
          value: '1',
        },
        {
          key: '4',
          label: '1.25',
          value: '1.25',
        },
        {
          key: '5',
          label: '1.5',
          value: '1.5',
        },
        {
          key: '6',
          label: '1.75',
          value: '1.75',
        },
        {
          key: '7',
          label: '2',
          value: '2',
        }]
      })
      localStorage.setItem('speed', await plugin.settings.getSetting('speed'));

      // commands

      // type a note command

      await plugin.settings.registerStringSetting({
        id: 'type',
        title: 'Type a note',
        defaultValue: 'enter',
      });
      localStorage.setItem('type', await plugin.settings.getSetting('type'));

      // pause setting command

      await plugin.settings.registerStringSetting({
        id: 'pause',
        title: 'Pause',
        defaultValue: 'space',
      });
      localStorage.setItem('pause', await plugin.settings.getSetting('pause'));

      // forward setting command

      await plugin.settings.registerStringSetting({
        id: 'forward',
        title: 'Forward',
        defaultValue: 'right',
      });
      localStorage.setItem('forward', await plugin.settings.getSetting('forward'));

      // backward setting command

      await plugin.settings.registerStringSetting({
        id: 'backward',
        title: 'Backward',
        defaultValue: 'left',
      });
      localStorage.setItem('backward', await plugin.settings.getSetting('backward'));

      // widget

      await plugin.app.registerWidget('widget', WidgetLocation.Pane, {
        dimensions: { height: 'auto', width: '100%' },
      });

      await plugin.window.openWidgetInPane('widget');

      // playing state

      setPause();
    },
  });
}

/**
 * A basic way to get the id from a YouTube video url 
 * like https://www.youtube.com/watch?v= from the focused rem.
 * 
 * @param plugin Plugin to read the content of the focused rem
 * @returns {string} The id of the video
 */
const getVideoId = async (plugin: ReactRNPlugin) => {
  const focusedRem = await plugin.focus?.getFocusedRem();
  let url;
  // the video can be a url or an embed video
  if (focusedRem?.text[0].i == "q") {
    const linkRemId = focusedRem?.text[0]._id;
    const linkRem = await plugin.rem.findOne(linkRemId);
    url = String(linkRem?.text[0]).replace(" ", "-")
  } else if (focusedRem?.text[0].i == "a") {
    url = focusedRem?.text[0].url;
  } else {
    return '';
  }
  const id = url?.split("?v=")[1];
  return id;
}

const onDeactivate = async (_: ReactRNPlugin) => { }

declareIndexPlugin(onActivate, onDeactivate);
