module.exports = {
    mongodb: {
      // DB to test, if it is required, run prod DB
      url: "mongodb+srv://yubiai:Proofofhumanity2021@cluster0.ckth5.mongodb.net",
      databaseName: "prepo",
      options: {
        useNewUrlParser: true
      }
    },
    migrationsDir: "migrations",
    changelogCollectionName: "changelog",
    migrationFileExtension: ".js",
    useFileHash: false,
    moduleSystem: 'commonjs'
};