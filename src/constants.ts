import { ActionDescriptor } from "photoshop/dom/CoreModules";

export const SAVE_PNG_ACTION = (_sessionToken: any): ActionDescriptor[] => [
  {
    _obj: "save",
    as: {
      _obj: "PNGFormat",
      method: {
        _enum: "PNGMethod",
        _value: "quick",
      },
      PNGInterlaceType: {
        _enum: "PNGInterlaceType",
        _value: "PNGInterlaceNone",
      },
      PNGFilter: {
        _enum: "PNGFilter",
        _value: "PNGFilterAdaptive",
      },
      compression: 6,
      embedIccProfileLastState: {
        _enum: "embedOff",
        _value: "embedOff",
      },
    },
    in: {
      _path: _sessionToken,
      _kind: "local",
    },
    copy: true,
    lowerCase: true,
    saveStage: {
      _enum: "saveStageType",
      _value: "saveBegin",
    },
    _options: {
      dialogOptions: "dontDisplay",
    },
  },
];

export enum AppState {
  IDLE = "IDLE",
  WAITING = "WAITING",
  ERROR = "ERROR",
  DONE = "DONE",
}

export enum ActionTypes {
  SET_RULES = "SET_RULES",
  SET_GROUPS = "SET_GROUPS",
  SET_APP_STATE = "SET_APP_STATE",
  SET_MODAL = "SET_MODAL",
  SET_DIALOG = "SET_DIALOG",
  SET_PROGRESS = "SET_PROGRESS",
  INC_PROGRESS = "INC_PROGRESS",
  PURGE_STATE = "PURGE_STATE",
}
