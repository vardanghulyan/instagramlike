const dotenv = require('dotenv');
const ig = require('./instagram');

dotenv.config();

(async () => {

    await ig.initialize();

    await ig.login(process.env.USERNAME, process.env.PASSWORD);

    await ig.likeTagsProcess(['cars', 'newyork']);

})();