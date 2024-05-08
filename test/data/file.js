const fileData = {
  mockFileContents: { a: 123 },
  mockFileExists: true,
  mockGetFileCanceled: false,
  mockSessionToken: "session-token",
  reset: function () {
    this.mockFileContents = { a: 123 };
    this.mockFileExists = true;
    this.mockGetFileCanceled = false;
  },
};

module.exports = fileData;
