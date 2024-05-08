require("./virtual_mocks/uxp");
require("./virtual_mocks/photoshop");
const uxp = require("uxp");
const layerData = require("./data/layers");

describe("imageGenerator class", () => {
  beforeEach(() => {
    document.getElementById("collection-size").value = 100;
    document.getElementById("collection-name").value = "test name";
    document.getElementById("collection-description").value =
      "test description";
    document.getElementById("check-dna").checked = true;

    layerData.reset();
  });

  describe("extractFormData", () => {
    it("should extract the form input data and store them on the class properties", () => {
      const { ImageGenerator } = require("../src/imageGenerator");
      const ig = new ImageGenerator();
      ig.extractFormData();

      expect(ig.collectionSize).toStrictEqual(100);
      expect(ig.collectionName).toEqual("test name");
      expect(ig.collectionDescription).toEqual("test description");
      expect(ig.checkDNA).toStrictEqual(true);
    });

    it("should not allow collection sizes less than or equal to 0", () => {
      document.getElementById("collection-size").value = 0;

      const { ImageGenerator } = require("../src/imageGenerator");
      const ig = new ImageGenerator();

      expect(() => ig.extractFormData()).toThrow(
        "Collection Size must be greater than 0"
      );
    });

    it("should not allow collection name less than 1 character long", () => {
      document.getElementById("collection-name").value = "";

      const { ImageGenerator } = require("../src/imageGenerator");
      const ig = new ImageGenerator();

      expect(() => ig.extractFormData()).toThrow(
        "Colleciton Name must be at least 1 character long"
      );
    });

    it("should trim spaces from collection name", () => {
      document.getElementById("collection-name").value = " test  ";

      const { ImageGenerator } = require("../src/imageGenerator");
      const ig = new ImageGenerator();
      ig.extractFormData();

      expect(ig.collectionName).toEqual("test");
    });
  });

  describe("_resetAllLayers", () => {
    it("should set visisbility to true on passed layers array top level", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      ig._resetAllLayers(layerData.mockLayers);

      layerData.mockLayers.forEach((layer) => {
        expect(layer.visible).toEqual(true);
      });
    });

    it("should set visisbility to false on extracted sub-layers", () => {
      const { ImageGenerator } = require("../src/imageGenerator");
      const ig = new ImageGenerator();

      ig._resetAllLayers(layerData.mockLayers);

      layerData.mockLayers.forEach((layer) => {
        if (layer.layers) {
          layer.layers.forEach((l) => {
            expect(l.visible).toEqual(false);
          });
        }
      });
    });
  });

  describe("extractLayerInfo", () => {
    it("should split the given layer name on the '#' character", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      let layerName = "test#3";

      expect(ig.extractLayerInfo(layerName)).toStrictEqual({
        name: "test",
        weight: 3,
      });
    });

    it("should not allow layer names with more than one '#' character", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();

      let layerName = "test##3";
      expect(() => ig.extractLayerInfo(layerName)).toThrow(
        `A layer name was not set properly: ${layerName}.`
      );

      layerName = "test#3#";
      expect(() => ig.extractLayerInfo(layerName)).toThrow(
        `A layer name was not set properly: ${layerName}.`
      );

      layerName = "te#st3#";
      expect(() => ig.extractLayerInfo(layerName)).toThrow(
        `A layer name was not set properly: ${layerName}.`
      );
    });

    it("should throw an error if an empty layer name was provided", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();

      let layerName = "";
      expect(() => ig.extractLayerInfo(layerName)).toThrow(
        "One of the layers does not have a name"
      );
    });

    it("should trim the spaces from the extracted layer name", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      let layerName = " test # 3 ";

      expect(ig.extractLayerInfo(layerName)).toStrictEqual({
        name: "test",
        weight: 3,
      });
    });

    it("should return weight NaN, if no weight is provided or weight is invalid", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      let layerName = "test";

      expect(ig.extractLayerInfo(layerName)).toStrictEqual({
        name: "test",
        weight: NaN,
      });

      layerName = "test#te3";

      expect(ig.extractLayerInfo(layerName)).toStrictEqual({
        name: "test",
        weight: NaN,
      });
    });
  });

  describe("pickLayerByWeight", () => {
    it("should get clean layer name and weight", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      const spy = jest.spyOn(ig, "extractLayerInfo");
      let threshold = 100;

      ig.pickLayerByWeight(layerData.mockLayers, threshold);

      expect(spy).toHaveBeenCalledTimes(layerData.mockLayers.length);
    });

    it("should pick the layer by weight distribution", () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      ig.extractLayerInfo = jest.fn().mockImplementation((value) => ({
        name: value.split("#").shift(),
        weight: +value.split("#").pop(),
      }));
      let threshold = 59;

      expect(ig.pickLayerByWeight(layerData.mockLayers, threshold)).toEqual([
        layerData.mockLayers[1],
        "test6",
      ]);

      threshold = 24;

      expect(ig.pickLayerByWeight(layerData.mockLayers, threshold)).toEqual([
        layerData.mockLayers[0],
        "test1",
      ]);

      threshold = 80;

      expect(ig.pickLayerByWeight(layerData.mockLayers, threshold)).toEqual([
        layerData.mockLayers[3],
        "test10",
      ]);
    });
  });

  describe("generateHash", () => {
    it("should generate and return a sha256 hash hex string for the provided object", async () => {
      const { ImageGenerator } = require("../src/imageGenerator");

      const ig = new ImageGenerator();
      // const spy = jest.spyOn(ig, "extractLayerInfo");
      let obj = { name: "test name", description: "test description" };

      expect(await ig.generateHash(obj)).toEqual(
        "415c45ed6b7a9a1197bda39f71fb135c79b68af07ac4516ee22c624e76f135c9"
      );
    });
  });

  // describe.only("extractLayers", () => {
  //   it("should ", async () => {
  //     const { ImageGenerator } = require("../src/imageGenerator");

  //     const ig = new ImageGenerator();
  //     // const spy = jest.spyOn(ig, "extractLayerInfo");
  //   });
  // });
});
