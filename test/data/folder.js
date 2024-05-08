const folderData = {
  mockFolderContents: [
    {
      name: "metadata",
    },
    {
      name: "images",
    },
  ],
  mockFolderExists: true,
  mockGetFolderCanceled: false,
  reset: function () {
    this.mockFolderContents = [
      {
        name: "metadata",
      },
      {
        name: "images",
      },
    ];
    this.mockFolderExists = true;
    this.mockGetFolderCanceled = false;
  },
};

module.exports = folderData;
