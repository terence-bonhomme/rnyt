import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { setPause } from '../components/video';

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
      localStorage.setItem('height', await plugin.settings.getSetting('height'))
      const height = parseInt(localStorage.getItem('height') as string);

      // delay setting

      await plugin.settings.registerNumberSetting({
        id: 'delay',
        title: 'Delay',
        defaultValue: 0,
      });
      const delay = parseInt(localStorage.getItem('delay') as string);
      localStorage.setItem('delay', await plugin.settings.getSetting('delay'))

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
