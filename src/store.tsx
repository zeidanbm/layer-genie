import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { ActionTypes, AppState } from "./constants";
import { LayerRules, Group } from "./types";

interface IState {
  rules: LayerRules | null;
  groups: Group[];
  appState: AppState;
  isModalOpen: boolean;
  progress: number;
  modal: {
    title?: string;
    message?: string;
    type: "info" | "success" | "error";
  } | null;
  dialog: any;
}

type StateActions = {
  type: ActionTypes;
  payload?: any;
};

const initialState: IState = {
  rules: null,
  groups: [],
  appState: AppState.IDLE,
  isModalOpen: false,
  modal: null,
  dialog: null,
  progress: 0,
};

const Reducer = (state: IState, action: StateActions) => {
  switch (action.type) {
    case "SET_RULES":
      return { ...state, rules: action.payload };
    case "SET_GROUPS":
      return { ...state, groups: action.payload };
    case "SET_APP_STATE":
      return { ...state, appState: action.payload };
    case "SET_MODAL":
      return {
        ...state,
        isModalOpen: action.payload.isModalOpen,
        modal: action.payload.modal,
      };
    case "SET_DIALOG":
      return { ...state, dialog: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "INC_PROGRESS":
      return { ...state, progress: state.progress + action.payload };
    case "PURGE_STATE":
      return initialState;
    default:
      return state;
  }
};

export const StoreContext = createContext<{
  state: IState;
  dispatch: Dispatch<StateActions>;
}>({ state: initialState, dispatch: () => null });

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
