const layerData = {
  mockLayers: [],
  reset: function () {
    this.mockLayers = [
      {
        id: 1,
        name: "test1#25",
        visible: true,
        layers: [
          { _id: 2, name: "test1_2", visible: true, layers: null },
          {
            _id: 3,
            visible: false,
            name: "test1_3",
            layers: [
              { _id: 4, name: "test1_3_4", visible: true, layers: null },
            ],
          },
          { _id: 5, name: "test1_5", visible: false, layers: null },
        ],
      },
      {
        id: 6,
        visible: false,
        name: "test6#35",
        layers: [
          { _id: 7, name: "test6_7", visible: true, layers: null },
          { _id: 8, name: "test6_8", visible: false, layers: null },
        ],
      },
      {
        _id: 9,
        name: "test9#10",
        visible: false,
        layers: null,
      },
      {
        _id: 10,
        name: "test10#50",
        visible: false,
        layers: null,
      },
    ];
  },
};

module.exports = layerData;
