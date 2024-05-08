import { Layer } from "photoshop/dom/Layer";
import { LayerRules } from "src/types";
import { extractLayerInfo } from "./layers";

/**
 * Choose layer by weight
 * @param layers
 * @param threshold
 * @returns [selected layer, layer cleaned name]
 */
export function pickLayerByWeight(
  layers: Layer[],
  threshold: number
): [Layer, string] | [undefined, undefined] {
  for (const layer of layers) {
    const [cleanLayerName, weight] = extractLayerInfo(layer.name);
    // Add the weight to our running total.
    threshold = threshold - weight;
    // If this value falls within the threshold, we're done!
    if (threshold < 0) {
      return [layer, cleanLayerName];
    }
  }

  return [undefined, undefined];
}

/**
 * Select the layers for the current itteration
 * @param topLayers The top layers
 */
export async function selectLayers(
  topLayers: Layer[],
  useRules: boolean,
  rules: LayerRules | null
): Promise<[Layer[], { trait_type: string; value: string }[]]> {
  const selectedLayers: Layer[] = [];
  let _currentRules: Set<string> = new Set();
  const attributes: { trait_type: string; value: string }[] = [];
  for (const topLayer of topLayers) {
    let groupWeight = 0;
    let subLayers: Layer[] | null = topLayer.layers;
    if (!subLayers) {
      continue;
    }

    subLayers = subLayers.filter((layer: Layer) => {
      const [cleanLayerName, layerWeight] = extractLayerInfo(layer.name);
      if (_currentRules.size > 0 && _currentRules.has(cleanLayerName)) {
        return false;
      } else {
        groupWeight += layerWeight;
        return true;
      }
    });

    if (!subLayers.length) {
      throw new Error(
        `Could not select any layers from the "${topLayer.name}" group.\nPlease, verify all related rules used for this group.`
      );
    }

    const threshold = Math.floor(
      Math.random() * (groupWeight || subLayers.length)
    );

    const [selectedLayer, selectedCleanLayerName] = pickLayerByWeight(
      subLayers,
      threshold
    );
    if (!selectedLayer) {
      throw new Error(
        `Could not select any layers from the "${topLayer.name}" group.\nPlease, verify all related rules used for this group.`
      );
    }

    if (
      useRules &&
      rules &&
      rules[`${topLayer.name} || ${selectedCleanLayerName}`]
    ) {
      _currentRules = new Set([
        ...rules[`${topLayer.name} || ${selectedCleanLayerName}`],
        ..._currentRules,
      ]);
    }

    const [cleanGroupName, _] = extractLayerInfo(topLayer.name);
    selectedLayers.push(selectedLayer);
    attributes.push({
      trait_type: cleanGroupName,
      value: selectedCleanLayerName,
    });
  }

  return [selectedLayers, attributes];
}
