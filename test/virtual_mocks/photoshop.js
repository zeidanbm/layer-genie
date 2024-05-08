const photoshopMock = jest.mock(
  "photoshop",
  () => {
    return {
      action: {
        batchPlay: () => {
          return true;
        },
      },
    };
  },
  { virtual: true }
);

module.exports = photoshopMock;
