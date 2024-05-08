import { app, core } from "photoshop";
import { Layer } from "photoshop/dom/Layer";
import { useContext, useState } from "react";
import {
  Checkbox,
  Textfield,
  Textarea,
  Heading,
  Button,
  Label,
} from "react-uxp-spectrum";
import { Group, Metadata } from "../types";
import StorageManager from "../helpers/storageManager";
import { StoreContext } from "../store";
import { resetLayers, toggleLayers } from "../helpers/layers";
import { generateHash } from "../helpers/general";
import { selectLayers } from "../helpers/generator";
import { ActionTypes, AppState } from "../constants";

const generateCollection = () => {
  const [collectionSize, setCollectionSize] = useState<number>(10);
  const [startsAt, setStartsAt] = useState<number>(1);
  const [name, setName] = useState<string>("Cyber Genie NFTs");
  const [description, setDescription] = useState<string>("");
  const [useRules, setUseRules] = useState(false);
  const [skipLayerReset, setSkipLayerReset] = useState(false);
  const [useGroups, setUseGroups] = useState(false);
  const { state, dispatch } = useContext(StoreContext);

  const handleGenerateCollection = async () => {
    try {
      dispatch({ type: ActionTypes.SET_APP_STATE, payload: AppState.WAITING });
      const projectFolder = await StorageManager.getFolder();
      const metadataFolder = await StorageManager.createChildFolder(
        projectFolder,
        "metadata"
      );
      const imagesFolder = await StorageManager.createChildFolder(
        projectFolder,
        "images"
      );
      const shouldUseGroups = useGroups && state.groups.length > 0;
      // check if we should skip reseting layers
      if (!skipLayerReset) {
        await resetLayers(app.activeDocument.layers);
      }

      let len;
      let currentTopLayers: Layer[];
      let promises: Promise<void>[] = [];
      let g = 0; // groups counter
      const executeAsModal = core.executeAsModal;

      // if we are using groups then filter selected groups
      if (shouldUseGroups) {
        len = (state.groups.at(-1) as Group).supply + startsAt;
        currentTopLayers = getCurrentTopLayers(g);
      } else {
        currentTopLayers = app.activeDocument.layers;
        len = collectionSize + startsAt;
      }
      for (let i = startsAt; i < len; i++) {
        const meta = createMetadata(i);
        const [selectedLayers, attributes] = await selectLayers(
          currentTopLayers,
          useRules,
          state.rules
        );
        meta.attributes = attributes;
        meta.dna = await generateHash(meta);

        await StorageManager.saveJsonFile(metadataFolder, meta, `${i}.json`);
        const saveFileToken = await StorageManager.createPNGImage(
          imagesFolder,
          `${i}.png`,
          {
            overwrite: true,
          }
        );

        promises.push(
          executeAsModal(
            async () => {
              toggleLayers(selectedLayers, true);
              await StorageManager.savePNGImage(saveFileToken);
              toggleLayers(selectedLayers, false);
            },
            {
              commandName: `Saving Images ${i} to ${i + 9}`,
            }
          )
        );
        // fulfill promises every 10 iters or at final iter
        if (i % 10 === 0 || i + 1 === len) {
          await Promise.all(promises);
          promises = [];
        }
        // when current group max supply is reached => move to next group
        if (
          shouldUseGroups &&
          i % (state.groups[g].supply + startsAt) === 0 &&
          i + 1 !== len
        ) {
          g++;
          toggleLayers(currentTopLayers, false);
          currentTopLayers = getCurrentTopLayers(g);
          toggleLayers(currentTopLayers, true);
        }
      }
      dispatch({
        type: ActionTypes.SET_MODAL,
        payload: {
          isModalOpen: true,
          modal: {
            title: "Success",
            message: "Collection generation completed.",
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

  const getCurrentTopLayers = (index: number) => {
    console.log(state.groups);
    console.log(index);
    return app.activeDocument.layers.filter((_group) =>
      state.groups[index].groups.includes(_group.name)
    );
  };

  const createMetadata = (id: number): Metadata => ({
    name: name + " #" + id,
    description: description,
    image: "To be replaced",
    edition: id,
    attributes: [],
  });

  return (
    <>
      <Heading className="pb-2" size="S">
        Collection Settings
      </Heading>
      <div className="flex flex-col max-w-sm space-y-2">
        <Textfield
          className="max-w-[5rem]"
          type="number"
          placeholder="Starting index"
          value={startsAt.toString()}
          onChange={(e) => setStartsAt(Number(e.target?.value) || 0)}
        >
          <Label slot="label" isRequired>
            Starting Index
          </Label>
        </Textfield>
        <Textfield
          className="max-w-[5rem]"
          type="number"
          placeholder="Size"
          value={collectionSize.toString()}
          onChange={(e) => setCollectionSize(Number(e.target?.value) || 0)}
          disabled={useGroups}
        >
          <Label slot="label" isRequired>
            Collection Size
          </Label>
        </Textfield>
        <Textfield
          placeholder="Collection Name"
          value={name}
          onChange={(e) => setName(e.target?.value || "")}
        >
          <Label slot="label" isRequired>
            Collection Name
          </Label>
        </Textfield>
        <Textarea
          placeholder="Collection Description"
          value={description}
          onChange={(e) => setDescription(e.target?.value || "")}
        >
          <Label slot="label" isRequired>
            Collection Description
          </Label>
        </Textarea>
        <div className="flex flex-col">
          <Checkbox
            checked={useRules}
            onChange={(e) => setUseRules(!!e.target?.checked)}
          >
            Use Rules
          </Checkbox>
          <Checkbox
            checked={useGroups}
            onChange={(e) => setUseGroups(!!e.target?.checked)}
          >
            Use Groups
          </Checkbox>
          <Checkbox
            checked={skipLayerReset}
            onChange={(e) => setSkipLayerReset(!!e.target?.checked)}
          >
            Skip Layer Reset
          </Checkbox>
        </div>
      </div>
      <div className="flex flex-wrap space-x-4 mt-4">
        <Button
          className="max-w-[10rem] cursor-pointer"
          variant="cta"
          onClick={handleGenerateCollection}
          disabled={state.appState === AppState.WAITING}
        >
          Generate Collection
        </Button>
      </div>
    </>
  );
};

export default generateCollection;
