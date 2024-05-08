const fileData = require("../data/file");
const folderData = require("../data/folder");
const {
  mockFolderContents,
  mockFolderExists,
  mockGetFolderCanceled,
} = require("../data/folder");

const mockWriteFile = jest.fn().mockImplementation((contents) => {
  fileData.mockFileContents = contents;
});

const mockCreateFolder = jest.fn().mockImplementation(async () => {
  return await {
    read: () => {
      return mockFolderContents;
    },
    write: (contents) => {
      folderData.mockFolderContents = contents;
    },
    createFile: mockCreateFile,
    isFolder: () => true,
  };
});

const mockCreateFile = jest.fn().mockImplementation(async () => {
  return await {
    read: () => {
      return fileData.mockFileContents;
    },
    write: mockWriteFile,
    isFile: () => true,
  };
});

const mockGetEntries = jest.fn().mockImplementation(async () => {
  return (await mockFolderExists) ? mockFolderContents : null;
});

const mockGetFolder = jest.fn().mockImplementation(() => {
  return mockGetFolderCanceled
    ? null
    : {
        createFolder: mockCreateFolder,
        createFile: mockCreateFile,
        getEntries: mockGetEntries,
      };
});

const mockReadFile = jest
  .fn()
  .mockImplementation(() => fileData.mockFileContents);

const mockGetFileForOpening = jest.fn().mockImplementation(() => {
  return fileData.mockGetFileCanceled
    ? null
    : {
        read: mockReadFile,
      };
});

const mockCreateSessionToken = jest.fn().mockImplementation(() => {
  return fileData.mockSessionToken;
});

const uxpMock = jest.mock(
  "uxp",
  () => {
    return {
      storage: {
        formats: {
          utf8: "utf8",
          json: "json",
        },
        localFileSystem: {
          getFolder: mockGetFolder,
          getFileForOpening: mockGetFileForOpening,
          createSessionToken: mockCreateSessionToken,
        },
      },
    };
  },
  {
    virtual: true,
  }
);

module.exports = uxpMock;
