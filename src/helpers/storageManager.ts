// bring application forward for double-click events
import { storage } from "uxp";
import { action } from "photoshop";
import { Layer } from "photoshop/dom/Layer";
import { SAVE_PNG_ACTION } from "../constants";
import { LocalFileSystemProvider } from "../types";

export default class StorageManager {
  static async getFolder() {
    const tmpFolder = await storage.localFileSystem.getFolder({});
    if (!tmpFolder) throw new Error("No folder selected");

    return tmpFolder;
  }

  static async createChildFolder(parentFolder: storage.Folder, name: string) {
    const entries = await parentFolder.getEntries();
    let childFolder = entries.find((entry: any) => entry.name.includes(name));

    if (!childFolder) {
      childFolder = await parentFolder.createFolder(name);
    }
    return childFolder;
  }
  /**
   * Import json file
   * @returns undefined if no file and file content if file exists
   */
  static async readJsonFile() {
    const dataFile = (await storage.localFileSystem.getFileForOpening({
      allowMultiple: false,
      types: ["json"],
    })) as storage.File;

    if (!dataFile) {
      // file picker dialog was canceled
      return;
    }

    return JSON.parse(
      (await dataFile.read({ format: storage.formats.utf8 })).toString()
    );
  }

  /**
   * Saves key-value data into a json file on the storage.
   * @param folder The folder to save in
   * @param data The data to be saved
   * @param filename The json filename
   * @return resolved if write is succefull and unresolved if write failed
   */
  static async saveJsonFile(
    folder: any,
    data: any,
    filename: string
  ): Promise<void> {
    if (!folder.isFolder) throw new Error("Invalid Folder");
    const newFile = await folder.createFile(filename, {
      overwrite: true,
    });
    return newFile.write(JSON.stringify(data), {
      append: false,
      format: storage.formats.utf8,
    });
  }

  /**
   * Create png file and return a token suitable for use with certain host-specific APIs.
   * @param folder The folder to create file in
   * @param filename The json filename
   * @param options The save optons
   * @return A token suitable for use with certain host-specific APIs.
   */
  static async createPNGImage(folder: any, filename: string, options: any) {
    if (!folder.isFolder) throw new Error("Images folder is not defined");

    const saveFile = await folder.createFile(filename, options);
    return (
      storage.localFileSystem as LocalFileSystemProvider
    ).createSessionToken(saveFile);
  }

  /**
   * Save as the png image.
   * @param saveFileToken The file reference token
   */
  static async savePNGImage(saveFileToken: any) {
    await action.batchPlay(SAVE_PNG_ACTION(saveFileToken), {
      modalBehavior: "execute",
    });
  }
}
