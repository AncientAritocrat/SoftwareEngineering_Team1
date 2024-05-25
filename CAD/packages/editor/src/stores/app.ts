import { defineStore } from 'pinia'

export const defaultServiceUrl = 'https://vjmap.com/server/api/v1';
export const defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MiwiVXNlcm5hbWUiOiJhZG1pbjEiLCJOaWNrTmFtZSI6ImFkbWluMSIsIkF1dGhvcml0eUlkIjoiYWRtaW4iLCJCdWZmZXJUaW1lIjo4NjQwMCwiZXhwIjo0ODEzMjY3NjM3LCJpc3MiOiJ2am1hcCIsIm5iZiI6MTY1OTY2NjYzN30.cDXCH2ElTzU2sQU36SNHWoTYTAc4wEkVIXmBAIzWh6M';

// 如果已经私有化部署，用下面的地址，填入token; 再把router/index.ts中的createWebHashHistory('')改成createWebHashHistory('/_cloud');编译后放demo/cloud目录下面即可
// export const defaultServiceUrl = location.protocol + "//" + location.hostname  + ":27660/api/v1";
// export const defaultAccessToken = 'xxxxxx';

export const APP_ID_KEY = "vapp";
export const APP_VISUAL_KEY = "data_visual_"
export const useAppStore = defineStore(APP_ID_KEY, {
  state: () => {
    return {
      serviceUrl: defaultServiceUrl, 
      accessToken: defaultAccessToken,
      lightTheme: false,
      editorSiderLeftWidth: 450,
      previewHideControl: false,
      projectSortOrder: "",
      projectSortType: "",
      projectDataType: "",
      projectPageSize: 0
    }
  },
  actions: {
    setTheme (light: boolean) {
      this.lightTheme = light
    },
  }, 

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['serviceUrl', 'accessToken', 'lightTheme', 'projectPageSize', 'projectSortOrder', 'projectSortType', 'projectDataType', 'editorSiderLeftWidth', 'previewHideControl']
      }
    ]
  }
})
