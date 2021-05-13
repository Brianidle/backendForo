const mongoose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    // Use the Mongo driver's updated URL string parser
    mongoose.set('useNewUrlParser', true);
    // Use findOneAndUpdate() in place of findAndModify()
    mongoose.set('useFindAndModify', false);
    // Use createIndex() in place of ensureIndex()
    mongoose.set('useCreateIndex', true);
    // Use the new server discovery and monitoring engine
    mongoose.set('useUnifiedTopology', true);

    mongoose.connection.on('connecting', function () {
      console.log("trying to establish a connection to mongo");
    });

    mongoose.connection.on('connected', function () {
      console.log("connection established successfully");
    });
    // Log an error if we fail to connect
    mongoose.connection.on('error', err => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running.'
      );

      process.exit();
    });

    // Connect to the DB
    mongoose.connect(DB_HOST);

  },
  close: () => {
    mongoose.connection.close();
  }
};
