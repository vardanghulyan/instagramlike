const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram = {

    browser: null,
    page: null,

    initialize: async () => {

        instagram.browser = await puppeteer.launch({
            headless: false
        });

        instagram.page = await instagram.browser.newPage();

    },

    login: async (username, password) => {

        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2'}); // wait until page fully loads

        let loginButton = await instagram.page.$x('//a[contains(text(), "Log in")]');

        if(loginButton.length > 0) {
            /* Click on the login url button */
            await loginButton[0].click();
            //await instagram.page.waitForNavigation({ waitUntil: 'networkidle2'});
        }

        await instagram.page.waitFor(1000);

        /* Writing the username and password */
        //document.querySelector('input[name="username"]')
        await instagram.page.type('input[name="username"]', username, { delay: 50 });
        await instagram.page.type('input[name="password"]', password, { delay: 50 });

        /* Clicking on the login button */
        loginButton = await instagram.page.$x('//button[contains(text(), "Log In")]');
        if(loginButton.length > 0) {
            await loginButton[0].click();
        }
        
        /* Continue if we logged in - check if user's Profile exist */
        await instagram.page.waitFor(10000); // wait for 10 seconds
        await instagram.page.waitFor('a > span[aria-label="Profile"]');
    },

    /* Specify multiple tags, wait for a tag, like the most recent iamge and then continue */
    likeTagsProcess : async (tags = []) => {

        for(let tag of tags) {
            /* Go to the tag page */
            await instagram.page.goto(TAB_URL(tag), { waitUntil: 'networkidle2 '});
            await instagram.page.waitFor(1000);

            /* Fetch the 'Most Recent' articles/posts */
            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');

            /* Only get the three posts */
            for(let i = 0; i < 3; i++) {
                let post = posts[i];

                /* Click on the post */
                await post.click();

                /* Wait for the modal to open */
                await instagram.page.waitFor('span[id="react-root"][aria-hidden="true"]');
                await instagram.page.waitFor(1000);

                /* Check if the like button exist */
                let isLikeable = await instagram.page.$('span[aria-label="Like"]');

                if(isLikeable) {
                    /* Click on like button */
                    await instagram.page.click('span[aria-label="Like]');
                }

                await instagram.page.waitFor(3000);

                /* Close the modal */
                let closeModalButton = await isntagram.page.$x('//button[contains(text(), "Close")]');
                await closeModalButton[0].page.click('//button[contains(text(), "Close")]');

                await instagram.page.waitFor(1000);
            }

            await instagram.page.waitFor(15000);

        }
    }

};

module.exports = instagram;