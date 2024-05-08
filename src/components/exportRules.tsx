import { app } from "photoshop";
import { useContext } from "react";
import { Button } from "react-uxp-spectrum";
import StorageManager from "../helpers/storageManager";
import { extractLayers } from "../helpers/layers";
import { StoreContext } from "../store";
import { ActionTypes, AppState } from "../constants";

const ExportRules = () => {
  const { state, dispatch } = useContext(StoreContext);

  const handleExportRules = async () => {
    try {
      dispatch({ type: ActionTypes.SET_APP_STATE, payload: AppState.WAITING });
      const tmpFolder = await StorageManager.getFolder();
      const [rules, allLayers] = extractLayers();
      await StorageManager.saveJsonFile(tmpFolder, rules, "conditions.json");
      await StorageManager.saveJsonFile(tmpFolder, allLayers, "allLayers.json");
      dispatch({
        type: ActionTypes.SET_MODAL,
        payload: {
          isModalOpen: true,
          modal: {
            title: "Success",
            message: "Export done.",
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
        onClick={handleExportRules}
        disabled={state.appState === AppState.WAITING}
      >
        Export Rules
      </Button>
    </>
  );
};

export default ExportRules;
