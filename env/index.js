const dev = require("./dev");
const test = require("./test");
const prod = require("./prod");
const dump = require("../src/util/dump");

// dynamically load env configuration 
// this way is great than just .env file 
// approach within the dotenv module
const { NODE_ENV: env } = process.env;

const envs = {
    dev,
    test,
    prod
}


// const tmp = envs[env];
// dump(tmp)

// module.exports = { ...envs[env], env }
module.exports = envs[env];