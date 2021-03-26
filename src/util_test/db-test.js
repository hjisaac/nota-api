const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();


module.exports = {
    connect: async () => {
		mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        const uri = await mongoServer.getUri();
		console.log(uri);
        mongoose.connect(uri);
        mongoose.connection.on(
            ("error"),
            (err) => {
                console.error(err);
                console.log("MemoryMongoDB connection failed");
                process.exit();
            }
        );
    },
    close: async () => {
        await mongoose.connection.dropDatabase();
  		await mongoose.connection.close();
  		await mongoServer.stop();
    }
}