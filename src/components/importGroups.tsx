import { app } from "photoshop";
import { useContext } from "react";
import { Button } from "react-uxp-spectrum";
import { StoreContext } from "../store";
import StorageManager from "../helpers/storageManager";
import { ActionTypes, AppState } from "../constants";

const ImportGroups = () => {
  const { state, dispatch } = useContext(StoreContext);

  const handleImportGroups = async () => {
    try {
      dispatch({ type: ActionTypes.SET_APP_STATE, payload: AppState.WAITING });
      dispatch({ type: ActionTypes.SET_GROUPS, payload: [] });

      const groups = await StorageManager.readJsonFile();
      if (!groups) throw new Error("No file selected");

      dispatch({ type: ActionTypes.SET_GROUPS, payload: groups });
      dispatch({
        type: ActionTypes.SET_MODAL,
        payload: {
          isModalOpen: true,
          modal: {
            title: "Success",
            message: "Import done.",
            type: "success",
          },
        },
      });
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        dispatch({
          type: ActionTypes.SET_MODAL,
          payload: {
            isModalOpen: true,
            modal: {
              title: "Error",
              message: err.message || err.toString(),
              type: "error",
            },
          },
        });
      }
    } finally {
      dispatch({ type: ActionTypes.SET_APP_STATE, payload: AppState.DONE });
    }
  };

  return (
    <>
      <Button
        className="max-w-[10rem] cursor-pointer"
        variant="primary"
        onClick={handleImportGroups}
        disabled={state.appState === AppState.WAITING}
      >
        Import Groups
      </Button>
    </>
  );
};

export default ImportGroups;
