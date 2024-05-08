import { app } from "photoshop";
import { useContext } from "react";
import { Button } from "react-uxp-spectrum";
import StorageManager from "../helpers/storageManager";
import {
  convertRule,
  getLayerNames,
  isRuleValidSubLayer,
  validateGroupName,
  validateRuleKey,
  validateRulesArray,
} from "../helpers/layers";
import { StoreContext } from "../store";
import { ActionTypes, AppState } from "../constants";
import { LayerRules } from "../types";
import { pause } from "../helpers/general";

const ImportRules = () => {
  const { state, dispatch } = useContext(StoreContext);

  const handleImportRules = async () => {
    try {
      dispatch({ type: ActionTypes.SET_APP_STATE, payload: AppState.WAITING });
      dispatch({ type: ActionTypes.SET_RULES, payload: null });
      dispatch({
        type: ActionTypes.INC_PROGRESS,
        payload: 1,
      });

      const rawRules = await StorageManager.readJsonFile();
      if (!rawRules) throw new Error("No file selected");

      const keys = Object.keys(rawRules);
      const len = keys.length;
      const progressIncrement = Math.floor(len / 10) || 1;
      const allTopLayers = app.activeDocument.layers;
      const allTopLayerNames = allTopLayers.map((_layer) => _layer.name);
      const rules: LayerRules = {};

      for (let i = 0; i < len; i++) {
        rules[keys[i]] = new Set();
        const currentValidTopLayers = validateRuleKey(
          keys[i],
          allTopLayerNames
        );

        for (const condition of rawRules[keys[i]]) {
          validateGroupName(currentValidTopLayers, condition.groupName);
          const currentTopLayer = allTopLayers.getByName(condition.groupName);
          if (!currentTopLayer.layers) continue;
          validateRulesArray(keys[i], condition.rules);
          const currentValidSubLayerNames = getLayerNames(
            currentTopLayer.layers
          );
          const acceptedLayers: string[] = [];
          for (const rule of condition.rules) {
            const [_rule, isIgnoreRule] = convertRule(rule);
            if (!_rule) continue;
            isRuleValidSubLayer(_rule, currentValidSubLayerNames);
            if (isIgnoreRule) {
              rules[keys[i]].add(_rule);
            } else {
              acceptedLayers.push(_rule);
            }
          }

          if (acceptedLayers.length > 0) {
            currentValidSubLayerNames.forEach((x) => {
              if (!acceptedLayers.includes(x)) {
                rules[keys[i]].add(x);
              }
            });
          }
        }
        if (i % progressIncrement === 0) {
          await pause();
          dispatch({
            type: ActionTypes.INC_PROGRESS,
            payload: 10,
          });
        }
      }

      dispatch({ type: ActionTypes.SET_RULES, payload: rules });
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
      dispatch({ type: ActionTypes.SET_PROGRESS, payload: 0 });
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        className="max-w-[10rem] w-full cursor-pointer"
        variant="primary"
        onClick={handleImportRules}
        disabled={state.appState === AppState.WAITING}
      >
        Import Rules
      </Button>
    </div>
  );
};

export default ImportRules;
