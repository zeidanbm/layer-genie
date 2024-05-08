import {
  Heading,
  Button,
  Slider,
  Label,
  Detail,
  Textfield,
} from "react-uxp-spectrum";
import { useContext, useEffect, useState } from "react";
import { app, core } from "photoshop";
import { extractLayerInfo } from "../helpers/layers";
import { ActionTypes } from "../constants";
import { StoreContext } from "../store";

const LayersWeight = () => {
  const { dispatch } = useContext(StoreContext);
  const [groupLayers, setGroupLayers] = useState<
    { name: string; weight: number }[]
  >([]);
  const [currentGroup, setCurrentGroup] = useState<{
    name: string;
    index: number;
  }>({ name: "", index: -1 });
  const [groupsLen, setGroupsLen] = useState(0);

  const getGroupLayers = (_index: number) => {
    const layers = app.activeDocument.layers;
    const _groupLayers: typeof groupLayers = [];

    const _group = layers[_index];
    if (_group && _group.layers) {
      setCurrentGroup({ name: _group.name, index: _index });
      _group.layers.forEach((_layer) => {
        const [name, weight] = extractLayerInfo(_layer.name);
        _groupLayers.push({ name, weight });
      });
    }

    setGroupLayers(_groupLayers);
  };

  useEffect(() => {
    setGroupsLen(app.activeDocument.layers.length);
  }, []);

  const setLayerWeights = async () => {
    if (!groupLayers.length) return;

    await core.executeAsModal(
      async () => {
        const layers = app.activeDocument.layers;
        const group = layers.getByName(currentGroup.name);
        if (group.layers) {
          group.layers.forEach((_layer, i) => {
            _layer.name = `${groupLayers[i].name}#${groupLayers[i].weight}`;
            _layer.visible = false;
          });
        }
      },
      {
        commandName: "Updating Layer Weights",
      }
    );
    dispatch({
      type: ActionTypes.SET_MODAL,
      payload: {
        isModalOpen: true,
        modal: {
          title: "Success",
          message: "Layer weights updated.",
          type: "success",
        },
      },
    });
  };

  return (
    <>
      <Heading size="S" className="pb-2">
        Weight Setup
      </Heading>
      <div>
        {currentGroup.name ? (
          <Heading size="XS" className="text-purple-200 m-0">
            {currentGroup.name}
          </Heading>
        ) : null}

        {groupLayers.map((layer, i) => {
          return (
            <div key={layer.name + i} className="flex space-x-8">
              <Detail size="L" className="self-end">
                {layer.name}
              </Detail>
              <Slider
                className="self-start"
                min={1}
                max={100}
                value={layer.weight}
                onChange={(e) => {
                  const _groupLayers = [...groupLayers];
                  _groupLayers[i].weight = Number(e.target?.value) || 1;
                  setGroupLayers(_groupLayers);
                }}
              >
                <Label slot="label"></Label>
              </Slider>
              <Textfield
                className="max-w-[3rem] self-end pl-4"
                value={layer.weight.toString()}
                onChange={(e) => {
                  const _groupLayers = [...groupLayers];
                  _groupLayers[i].weight = Number(e.target?.value) || 1;
                  setGroupLayers(_groupLayers);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col space-y-2.5 space-x-0 xs:flex-row xs:space-x-4 xs:space-y-0 mt-4 ">
        {currentGroup.index == -1 ? (
          <Button
            onClick={() => getGroupLayers(currentGroup.index + 1)}
            className="max-w-[10rem] cursor-pointer"
            variant="secondary"
          >
            Get Group Layers
          </Button>
        ) : (
          <>
            <Button
              onClick={() => getGroupLayers(currentGroup.index - 1)}
              className="max-w-[10rem] cursor-pointer"
              variant="secondary"
              disabled={currentGroup.index <= 0}
            >
              Prev
            </Button>
            <Button
              onClick={() => getGroupLayers(currentGroup.index + 1)}
              className="max-w-[10rem] cursor-pointer"
              variant="secondary"
              disabled={currentGroup.index + 1 >= groupsLen}
            >
              Next
            </Button>
          </>
        )}
        <Button
          onClick={setLayerWeights}
          className="max-w-[10rem] cursor-pointer"
          variant="primary"
        >
          Apply
        </Button>
      </div>
    </>
  );
};

export default LayersWeight;
