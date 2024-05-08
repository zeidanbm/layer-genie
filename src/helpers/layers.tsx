import { app, core } from "photoshop";
import { Layer } from "photoshop/dom/Layer";

/**
 * Get layer name and weight
 * @param name The layer name
 * @returns {obj} name: the layer name, weight: the layer weight
 */
export function extractLayerInfo(name: string): [string, number] {
  if (!name.trim()) throw new Error("One of the layers does not have a name");
  const data = name.split("#");
  if (data.length < 1 || data.length > 2) {
    throw new Error(`A layer name was not set properly: ${name}.`);
  }
  return [data[0].trim(), +data[1] || 1];
}

/**
 * Toggle layer visibility
 * @param layers The layers array
 * @param state The visibility state
 * @param deep How deep to go into sub layers
 */
export async function toggleLayers(layers: Layer[], state: boolean, deep = 1) {
  layers.forEach((layer) => {
    if (deep > 1 && layer.layers) {
      layer.layers.forEach((_layer) => {
        _layer.visible = !state;
      });
    }
    layer.visible = state;
  });
}
/**
 * Resets the visibility on given layers
 */
export async function resetLayers(layers: Layer[]) {
  const executeAsModal = core.executeAsModal;
  await executeAsModal(() => toggleLayers(layers, true, 2), {
    commandName: `"Reseting layers visibility`,
  });
}

/**
 * Extract all layers
 */
export function extractLayers() {
  const result = {} as any;
  const _subLayersMap: { [key: string]: string } = {};
  const allLayers: { [key: string]: string[] } = {};
  const groupLayers: { groupName: string; rules: string[] }[] = [];
  const topGroups = app.activeDocument.layers;

  topGroups.forEach((group) => {
    groupLayers.push({
      groupName: group.name,
      rules: ["*"],
    });
    if (allLayers[group.name]) {
      throw Error(
        `Top group names must be unique.\nDuplicate group name "${group.name}"`
      );
    }
    allLayers[group.name] = [];

    if (group.layers) {
      group.layers.forEach((_layer) => {
        const [cleanLayerName, _] = extractLayerInfo(_layer.name);
        if (result[`${group.name} || ${cleanLayerName}`]) {
          throw Error(
            `Layers in the same group must have unique names.\nLayer "${cleanLayerName}" in "${group.name}" group.`
          );
        }
        if (_subLayersMap[cleanLayerName]) {
          throw Error(
            `Layers must have unique names.\nLayer "${cleanLayerName}" in "${group.name}" group already exists in another group "${_subLayersMap[cleanLayerName]}".`
          );
        }
        result[`${group.name} || ${cleanLayerName}`] = {};
        allLayers[group.name].push(cleanLayerName);
        _subLayersMap[cleanLayerName] = group.name;
      });
    }
  });

  const prevGroups: string[] = [];
  for (const key of Object.keys(result)) {
    const _name = key.split(" || ");
    prevGroups.push(_name[0]);

    const subsetGroups = groupLayers.filter(
      (el) => !prevGroups.includes(el.groupName)
    );

    result[key] = subsetGroups;
  }

  return [result, allLayers];
}

/**
 * Validates a key has a valid top layer name
 */
export function validateRuleKey(key: string, _allTopLayerNames: string[]) {
  const [key_0, _key_1] = key.split(" || ");
  const topLayerNameIndex = _allTopLayerNames.indexOf(key_0);

  if (topLayerNameIndex < 0) {
    throw new Error(
      `A top layer "${key_0}" found at "${key}", does not exist.\nMake sure the top keys are correct "group || subLayer"!`
    );
  }
  return _allTopLayerNames.slice(topLayerNameIndex + 1);
}

export function validateGroupName(
  _currentValidTopLayers: string[],
  _groupName: string
) {
  if (!_currentValidTopLayers.includes(_groupName)) {
    throw new Error(
      `A group name "${_groupName}", is not valid.\nMake sure the group names are correct and ordered properly!`
    );
  }
}

export function validateRulesArray(key: string, _rules: string[] | undefined) {
  if (!_rules || !_rules.length) {
    throw new Error(
      `Malformatted entry at "${key}".\nMake sure the format and layer names are correct!`
    );
  }
}

export function getLayerNames(layers: Layer[]) {
  return layers.map((_layer) => {
    const [name, _] = extractLayerInfo(_layer.name);
    return name;
  });
}

export function isRuleValidSubLayer(
  _rule: string,
  _currentValidSubLayerNames: string[]
) {
  if (!_currentValidSubLayerNames.includes(_rule)) {
    throw new Error(
      `"${_rule}" does not exist.\nMake sure layer names are correct!`
    );
  }
}

export function convertRule(_rule: string): [string | null, boolean] {
  if (_rule === "*") return [null, false];

  let _isIgnoreRule = false;
  if (_rule.charAt(0) === "!") {
    _isIgnoreRule = true;
    _rule = _rule.substring(1);
  }

  return [_rule, _isIgnoreRule];
}
