const mongoose = require("mongoose");

module.exports = {
    connect: DB_STRING => {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.connect(DB_STRING);
        mongoose.connection.on(
            ("error"),
            (err) => {
                console.error(err);
                console.log("DB connection failed; make sure mongod.service is up");
                process.exit();
            }
        );
    },
    close: () => {
        mongoose.connection.close();
    }
}