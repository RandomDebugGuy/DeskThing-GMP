class settingsManager {
    private DeskThing: any;
    public settings: {};
    constructor(DeskThing) {
      this.DeskThing = DeskThing;
    }

    /**
     * Adds settings; does nothing if settings already exist
     * 
     * @param { JSON[] | JSON } settings - Settings to add
     * 
     * @returns void
     * 
     * @example
     * import settings_manager from './settings';
     * const settingsManager = new settings_manager(DeskThingInstance);
     * 
     * settingsManager.add({
     *   theme: {
     *     label: "App theme",
     *     description: "Select the theme of the app",
     *     type: "select",
     *     value: "value",
     *     options: [{
     *         label: "Light",
     *         value: "light"
     *       }, {
     *         label: "Dark",
     *         value: "dark"
     *       }
     *     ]},
     *   background: {
     *     label: "Background color",
     *     description: "Select the background color of the app (in hex)",
     *     type: "string",
     *     value: "#FFFFFF"
     *   }
     * });
     * 
     */
    add(settings: any) {
      Object.entries(settings).forEach((setting: any) => {
        if (!(setting[0] in this.settings)) {
          this.DeskThing.addSettings(setting[0]);
        }
      });
    }

    /**
     * Updates settings, adds them if they don't exist
     * 
     * @param { JSON[] | JSON } settings - Settings to update
     *
     * @returns void
     * 
     * @example
     * import settings_manager from './settings';
     * const settingsManager = new settings_manager(DeskThingInstance);
     * 
     * settingsManager.update({
     *   mediaPlayers: {
     *     label: "Media players",
     *     description: "Which media players to use",
     *     type: "ranked",
     *     value: ["spotify.exe", "operagxwebbrowser"],
     *     options: [{
     *         label: "Spotify",
     *         value: "spotify.exe"
     *       }, {
     *         label: "Opera GX",
     *         value: "operagxwebbrowser"
     *       }
     *     ]}
     * });
     */
    update(settings: any) {
      for (const [settingKey, setting] of Object.entries(settings) as [string, any][]) {
        if (!(setting in this.settings)) {
          this.DeskThing.addSettings(setting);
        } else {
          const values = this.settings[settingKey].value;
          switch (setting.type) {
            case 'select':
              
              break;
            case 'ranked':
              this.DeskThing.updateSettings(setting);
              break;
            case 'string':
              this.DeskThing.updateSettings(setting);
              break;
            case 'number':
              this.DeskThing.updateSettings(setting);
              break;
            case 'boolean':
              this.DeskThing.updateSettings(setting);
              break;
            default:
              this.DeskThing.updateSettings(setting);
              break;
          }
        }
      }
    }
    /**
     * Deletes settings
     * 
     * @param { JSON[] } settings - Settings to delete
     * 
     * @returns void
     * 
     * @deprecated Doesn't work at the moment, will be fixed when DeskThing's settings system is stable
     * 
     * @example
     * 
     * import settings_manager from './settings';
     * const settingsManager = new settings_manager(DeskThingInstance);
     * 
     * settingsManager.delete({
     *   theme: {
     *     label: "App theme",
     *     description: "Select the theme of the app",
     *     type: "select",
     *     value: "value",
     *     options: [{
     *         label: "Light",
     *         value: "light"
     *       }, {
     *         label: "Dark",
     *         value: "dark"
     *       }
     *     ]}
     * });
     * */
    delete(settings: any) {
      throw new Error('Deleting settings is not yet supported, but will be when DeskThing\'s setting system is stable.');
    }
}

export default settingsManager;