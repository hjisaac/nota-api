const dev = require("./dev");
const test = require("./test");
const prod = require("./prod");

// dynamically load env configuration 
// this way is great than just .env file 
// approach within the dotenv module
const { NODE_ENV: env } = process.env;

const envs = {
    dev,
    test,
    prod
}



module.exports = { ...envs[env], env };