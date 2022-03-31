This script can be used to take screenshots of different pages on any site. It will take Desktop screenshots(visible and full-page) as well as mobile screenshots(visible and full-page) for all the routes given in the config.js file.

# Getting Started
Clone the repo and run npm install
Then run the app with `cd src` and `node screenshot.js`

The app should open a window in the chromium browser,
After The app runs it should create a 

> /screenshots/

folder containing all the screenshots from each route

# Config
The config is contained in the config.js file. The app needs the host url and an object containing the routes to navigate to.

There is a variable in the screenshot.js file called

>  authorizationRequired

If you are using a site that requires you to login before accessing it, set this value to true. This way it gives a 50000ms delay so that you have time to authenticate.

