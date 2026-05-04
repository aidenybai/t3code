import { contextBridge, ipcRenderer } from "electron";
import type { DesktopBridge, DesktopPreviewTabState } from "@t3tools/contracts";

const PICK_FOLDER_CHANNEL = "desktop:pick-folder";
const CONFIRM_CHANNEL = "desktop:confirm";
const SET_THEME_CHANNEL = "desktop:set-theme";
const CONTEXT_MENU_CHANNEL = "desktop:context-menu";
const OPEN_EXTERNAL_CHANNEL = "desktop:open-external";
const MENU_ACTION_CHANNEL = "desktop:menu-action";
const UPDATE_STATE_CHANNEL = "desktop:update-state";
const UPDATE_GET_STATE_CHANNEL = "desktop:update-get-state";
const UPDATE_SET_CHANNEL_CHANNEL = "desktop:update-set-channel";
const UPDATE_CHECK_CHANNEL = "desktop:update-check";
const UPDATE_DOWNLOAD_CHANNEL = "desktop:update-download";
const UPDATE_INSTALL_CHANNEL = "desktop:update-install";
const GET_APP_BRANDING_CHANNEL = "desktop:get-app-branding";
const GET_LOCAL_ENVIRONMENT_BOOTSTRAP_CHANNEL = "desktop:get-local-environment-bootstrap";
const GET_CLIENT_SETTINGS_CHANNEL = "desktop:get-client-settings";
const SET_CLIENT_SETTINGS_CHANNEL = "desktop:set-client-settings";
const GET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL = "desktop:get-saved-environment-registry";
const SET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL = "desktop:set-saved-environment-registry";
const GET_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:get-saved-environment-secret";
const SET_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:set-saved-environment-secret";
const REMOVE_SAVED_ENVIRONMENT_SECRET_CHANNEL = "desktop:remove-saved-environment-secret";
const GET_SERVER_EXPOSURE_STATE_CHANNEL = "desktop:get-server-exposure-state";
const SET_SERVER_EXPOSURE_MODE_CHANNEL = "desktop:set-server-exposure-mode";
const PREVIEW_CREATE_TAB_CHANNEL = "desktop:preview-create-tab";
const PREVIEW_CLOSE_TAB_CHANNEL = "desktop:preview-close-tab";
const PREVIEW_REGISTER_WEBVIEW_CHANNEL = "desktop:preview-register-webview";
const PREVIEW_NAVIGATE_CHANNEL = "desktop:preview-navigate";
const PREVIEW_GO_BACK_CHANNEL = "desktop:preview-go-back";
const PREVIEW_GO_FORWARD_CHANNEL = "desktop:preview-go-forward";
const PREVIEW_REFRESH_CHANNEL = "desktop:preview-refresh";
const PREVIEW_ZOOM_IN_CHANNEL = "desktop:preview-zoom-in";
const PREVIEW_ZOOM_OUT_CHANNEL = "desktop:preview-zoom-out";
const PREVIEW_RESET_ZOOM_CHANNEL = "desktop:preview-reset-zoom";
const PREVIEW_HARD_RELOAD_CHANNEL = "desktop:preview-hard-reload";
const PREVIEW_OPEN_DEVTOOLS_CHANNEL = "desktop:preview-open-devtools";
const PREVIEW_CLEAR_COOKIES_CHANNEL = "desktop:preview-clear-cookies";
const PREVIEW_CLEAR_CACHE_CHANNEL = "desktop:preview-clear-cache";
const PREVIEW_GET_PREVIEW_CONFIG_CHANNEL = "desktop:preview-get-preview-config";
const PREVIEW_PICK_ELEMENT_CHANNEL = "desktop:preview-pick-element";
const PREVIEW_CANCEL_PICK_ELEMENT_CHANNEL = "desktop:preview-cancel-pick-element";
const PREVIEW_STATE_CHANGE_CHANNEL = "desktop:preview-state-change";

contextBridge.exposeInMainWorld("desktopBridge", {
  getAppBranding: () => {
    const result = ipcRenderer.sendSync(GET_APP_BRANDING_CHANNEL);
    if (typeof result !== "object" || result === null) {
      return null;
    }
    return result as ReturnType<DesktopBridge["getAppBranding"]>;
  },
  getLocalEnvironmentBootstrap: () => {
    const result = ipcRenderer.sendSync(GET_LOCAL_ENVIRONMENT_BOOTSTRAP_CHANNEL);
    if (typeof result !== "object" || result === null) {
      return null;
    }
    return result as ReturnType<DesktopBridge["getLocalEnvironmentBootstrap"]>;
  },
  getClientSettings: () => ipcRenderer.invoke(GET_CLIENT_SETTINGS_CHANNEL),
  setClientSettings: (settings) => ipcRenderer.invoke(SET_CLIENT_SETTINGS_CHANNEL, settings),
  getSavedEnvironmentRegistry: () => ipcRenderer.invoke(GET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL),
  setSavedEnvironmentRegistry: (records) =>
    ipcRenderer.invoke(SET_SAVED_ENVIRONMENT_REGISTRY_CHANNEL, records),
  getSavedEnvironmentSecret: (environmentId) =>
    ipcRenderer.invoke(GET_SAVED_ENVIRONMENT_SECRET_CHANNEL, environmentId),
  setSavedEnvironmentSecret: (environmentId, secret) =>
    ipcRenderer.invoke(SET_SAVED_ENVIRONMENT_SECRET_CHANNEL, environmentId, secret),
  removeSavedEnvironmentSecret: (environmentId) =>
    ipcRenderer.invoke(REMOVE_SAVED_ENVIRONMENT_SECRET_CHANNEL, environmentId),
  getServerExposureState: () => ipcRenderer.invoke(GET_SERVER_EXPOSURE_STATE_CHANNEL),
  setServerExposureMode: (mode) => ipcRenderer.invoke(SET_SERVER_EXPOSURE_MODE_CHANNEL, mode),
  pickFolder: (options) => ipcRenderer.invoke(PICK_FOLDER_CHANNEL, options),
  confirm: (message) => ipcRenderer.invoke(CONFIRM_CHANNEL, message),
  setTheme: (theme) => ipcRenderer.invoke(SET_THEME_CHANNEL, theme),
  showContextMenu: (items, position) => ipcRenderer.invoke(CONTEXT_MENU_CHANNEL, items, position),
  openExternal: (url: string) => ipcRenderer.invoke(OPEN_EXTERNAL_CHANNEL, url),
  onMenuAction: (listener) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, action: unknown) => {
      if (typeof action !== "string") return;
      listener(action);
    };

    ipcRenderer.on(MENU_ACTION_CHANNEL, wrappedListener);
    return () => {
      ipcRenderer.removeListener(MENU_ACTION_CHANNEL, wrappedListener);
    };
  },
  getUpdateState: () => ipcRenderer.invoke(UPDATE_GET_STATE_CHANNEL),
  setUpdateChannel: (channel) => ipcRenderer.invoke(UPDATE_SET_CHANNEL_CHANNEL, channel),
  checkForUpdate: () => ipcRenderer.invoke(UPDATE_CHECK_CHANNEL),
  downloadUpdate: () => ipcRenderer.invoke(UPDATE_DOWNLOAD_CHANNEL),
  installUpdate: () => ipcRenderer.invoke(UPDATE_INSTALL_CHANNEL),
  onUpdateState: (listener) => {
    const wrappedListener = (_event: Electron.IpcRendererEvent, state: unknown) => {
      if (typeof state !== "object" || state === null) return;
      listener(state as Parameters<typeof listener>[0]);
    };

    ipcRenderer.on(UPDATE_STATE_CHANNEL, wrappedListener);
    return () => {
      ipcRenderer.removeListener(UPDATE_STATE_CHANNEL, wrappedListener);
    };
  },
  preview: {
    createTab: (tabId) => ipcRenderer.invoke(PREVIEW_CREATE_TAB_CHANNEL, tabId),
    closeTab: (tabId) => ipcRenderer.invoke(PREVIEW_CLOSE_TAB_CHANNEL, tabId),
    registerWebview: (tabId, webContentsId) =>
      ipcRenderer.invoke(PREVIEW_REGISTER_WEBVIEW_CHANNEL, tabId, webContentsId),
    navigate: (tabId, url) => ipcRenderer.invoke(PREVIEW_NAVIGATE_CHANNEL, tabId, url),
    goBack: (tabId) => ipcRenderer.invoke(PREVIEW_GO_BACK_CHANNEL, tabId),
    goForward: (tabId) => ipcRenderer.invoke(PREVIEW_GO_FORWARD_CHANNEL, tabId),
    refresh: (tabId) => ipcRenderer.invoke(PREVIEW_REFRESH_CHANNEL, tabId),
    zoomIn: (tabId) => ipcRenderer.invoke(PREVIEW_ZOOM_IN_CHANNEL, tabId),
    zoomOut: (tabId) => ipcRenderer.invoke(PREVIEW_ZOOM_OUT_CHANNEL, tabId),
    resetZoom: (tabId) => ipcRenderer.invoke(PREVIEW_RESET_ZOOM_CHANNEL, tabId),
    hardReload: (tabId) => ipcRenderer.invoke(PREVIEW_HARD_RELOAD_CHANNEL, tabId),
    openDevTools: (tabId) => ipcRenderer.invoke(PREVIEW_OPEN_DEVTOOLS_CHANNEL, tabId),
    clearCookies: () => ipcRenderer.invoke(PREVIEW_CLEAR_COOKIES_CHANNEL),
    clearCache: () => ipcRenderer.invoke(PREVIEW_CLEAR_CACHE_CHANNEL),
    getPreviewConfig: () => ipcRenderer.invoke(PREVIEW_GET_PREVIEW_CONFIG_CHANNEL),
    pickElement: (tabId) => ipcRenderer.invoke(PREVIEW_PICK_ELEMENT_CHANNEL, tabId),
    cancelPickElement: (tabId) => ipcRenderer.invoke(PREVIEW_CANCEL_PICK_ELEMENT_CHANNEL, tabId),
    onStateChange: (listener) => {
      const wrappedListener = (
        _event: Electron.IpcRendererEvent,
        tabId: unknown,
        state: unknown,
      ) => {
        if (typeof tabId !== "string") return;
        if (typeof state !== "object" || state === null) return;
        listener(tabId, state as DesktopPreviewTabState);
      };
      ipcRenderer.on(PREVIEW_STATE_CHANGE_CHANNEL, wrappedListener);
      return () => {
        ipcRenderer.removeListener(PREVIEW_STATE_CHANGE_CHANNEL, wrappedListener);
      };
    },
  },
} satisfies DesktopBridge);
