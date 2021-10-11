const data = {
  channels: [
    {
      id: "1",
      name: "Channel 1",
    },
    {
      id: "2",
      name: "Channel 2",
    },
    {
      id: "3",
      name: "Channel 3",
    },
  ],
};

module.exports = {
  list: () => {
    return data.channels;
  },
  get: (i) => {
    return data.channels[i].name;
  },
};
