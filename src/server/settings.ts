class settingsManager {
    private DeskThing: any;
    public settings: {};
    constructor(DeskThing) {
      this.DeskThing = DeskThing;
    }

    /**
     * 
     * @param settings Settings to add
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
      for (const setting of settings) {
        if (!(setting in this.settings)) {
          this.DeskThing.addSettings(setting);
        } else {
          this.update(setting);
        }
      }
    }

    /**
     * 
     * Updates settings, adds them if they don't exist
     * 
     * @param settings Settings to update
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
}

export default settingsManager;