module.exports = {
  mongodb: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/lunchsync',
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
};
