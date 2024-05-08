require("./virtual_mocks/uxp");
require("./virtual_mocks/photoshop");
const uxp = require("uxp");
const folderData = require("./data/folder");
const fileData = require("./data/file");

describe("storageManager class", () => {
  describe("initProjectFolders", () => {
    beforeEach(() => {
      fileData.reset();
      folderData.reset();
    });

    it("should allow the user to select a project folder", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      await sm.initProjectFolders();

      expect(uxp.storage.localFileSystem.getFolder).toHaveBeenCalled();
    });

    it("should throw an error if no folder was selected", () => {
      uxp.storage.localFileSystem.getFolder.mockReturnValueOnce(false);
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();

      expect(sm.initProjectFolders()).rejects.toMatch("No Folder Selected.");
    });

    it("should get the list of folders/files for the user selected directory", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      await sm.initProjectFolders();

      expect(
        uxp.storage.localFileSystem.getFolder().getEntries
      ).toHaveBeenCalled();
    });

    it("should check and return metadata/images folders inside the project folder", async () => {
      const findSpy = jest.spyOn(Array.prototype, "find");
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      await sm.initProjectFolders();

      expect(findSpy.mock.results[0].value).toStrictEqual(
        folderData.mockFolderContents[0]
      );
      expect(findSpy.mock.results[1].value).toStrictEqual(
        folderData.mockFolderContents[1]
      );
    });

    it("should create a metadata/images folder if none exist", async () => {
      uxp.storage.localFileSystem
        .getFolder()
        .getEntries.mockReturnValueOnce([]);

      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      await sm.initProjectFolders();

      expect(
        uxp.storage.localFileSystem.getFolder().createFolder
      ).toHaveBeenNthCalledWith(1, "metadata");
      expect(
        uxp.storage.localFileSystem.getFolder().createFolder
      ).toHaveBeenNthCalledWith(2, "images");
    });
  });

  describe("readJsonFile", () => {
    beforeEach(() => {
      fileData.reset();
      folderData.reset();
    });

    it("should allow user to pick only one json file", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      await sm.readJsonFile();

      expect(
        uxp.storage.localFileSystem.getFileForOpening
      ).toHaveBeenCalledWith({ allowMultiple: false, types: ["json"] });
    });

    it("should return undefined if no file selected", async () => {
      fileData.mockGetFileCanceled = true;
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();

      expect(await sm.readJsonFile()).toBeUndefined();
    });

    it("should return file content if a json file is selected", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const res = await sm.readJsonFile();

      expect(
        uxp.storage.localFileSystem.getFileForOpening().read
      ).toHaveBeenCalledWith({ format: uxp.storage.formats.json });
      expect(res).toStrictEqual(fileData.mockFileContents);
    });
  });

  describe("saveJsonFile", () => {
    beforeEach(() => {
      fileData.reset();
      folderData.reset();
    });

    it("should return invalid folder error if folder is not valid", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const tmpFolder = await (
        await uxp.storage.localFileSystem.getFolder()
      ).createFolder("tmp");
      tmpFolder.isFolder = false;

      expect(
        sm.saveJsonFile(tmpFolder, fileData.mockFileContents, "1.json")
      ).rejects.toMatch("Invalid Folder");
    });

    it("should create a json file in the metadata folder overwriting existing one", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const tmpFolder = await (
        await uxp.storage.localFileSystem.getFolder()
      ).createFolder("tmp");

      await sm.saveJsonFile(tmpFolder, fileData.mockFileContents, "1.json");

      expect(tmpFolder.createFile).toHaveBeenCalledWith("1.json", {
        overwrite: true,
      });
    });

    it("should write the passed data to the created json file", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const tmpFolder = await (
        await uxp.storage.localFileSystem.getFolder()
      ).createFolder("tmp");

      await sm.saveJsonFile(tmpFolder, fileData.mockFileContents, "1.json");

      expect((await tmpFolder.createFile()).write).toHaveBeenCalledWith(
        fileData.mockFileContents,
        {
          append: false,
          format: uxp.storage.formats.utf8,
        }
      );
    });
  });

  describe("toggleLayers", () => {
    it("should set the layers visibility to the passed state", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const mockLayers = [
        { id: 1, visible: true },
        { id: 2, visible: false },
      ];
      sm.toggleLayers(mockLayers, true);

      expect(mockLayers[0].visible).toBeTruthy();
      expect(mockLayers[1].visible).toBeTruthy();
    });
  });

  describe("createPNGImage", () => {
    it("should throw an error if images folder is not defined", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      expect(sm.createPNGImage("1.png")).rejects.toMatch(
        "Images folder is not defined"
      );
    });

    it("should create the file with the passed filename and options", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      let file = "1.png";
      let options = {
        overwrite: true,
      };
      sm.imagesFolder = await (
        await uxp.storage.localFileSystem.getFolder()
      ).createFolder("tmp");
      sm.createPNGImage(file, options);

      expect(sm.imagesFolder.createFile).toHaveBeenCalledWith(file, options);
    });

    it("should create and return a session token for the created file", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      let file = "1.png";
      let options = {
        overwrite: true,
      };
      sm.imagesFolder = await (
        await uxp.storage.localFileSystem.getFolder()
      ).createFolder("tmp");

      expect(await sm.createPNGImage(file, options)).toEqual(
        fileData.mockSessionToken
      );
      expect(uxp.storage.localFileSystem.createSessionToken).toHaveBeenCalled();
    });
  });

  describe("savePNGImage", () => {
    it("should call toggleLayers twice with passed layers array and a state of true in first call and false in the second call", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const toggleLayersSpy = jest.spyOn(sm, "toggleLayers");
      sm._savePNGImage = jest.fn();
      const mockLayers = [
        { id: 1, visible: true },
        { id: 2, visible: false },
      ];
      await sm.savePNGImage(fileData.mockSessionToken, mockLayers);
      expect(toggleLayersSpy).toHaveBeenNthCalledWith(1, mockLayers, true);
      expect(toggleLayersSpy).toHaveBeenNthCalledWith(2, mockLayers, false);
    });

    it("should call _savePNGImage with the passed session token", async () => {
      const { StorageManager } = require("../src/storageManager");
      const sm = new StorageManager();
      const _savePNGImageSpy = jest.spyOn(sm, "_savePNGImage");
      const mockLayers = [
        { id: 1, visible: true },
        { id: 2, visible: false },
      ];
      await sm.savePNGImage(fileData.mockSessionToken, mockLayers);
      expect(_savePNGImageSpy).toHaveBeenCalledWith(fileData.mockSessionToken);
    });
  });
});
