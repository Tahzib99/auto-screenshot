const puppeteer = require('puppeteer');
const devices = puppeteer.devices;
const fs = require('fs');

const {host, routes} = require('./config');
let browser;


const init = async () => {
  browser = await puppeteer.launch({ headless: false, timeout: 100000 });
};

const capturePage = async (filename = 'screenshot', route = '/', authorizationRequired = false) => {
  const url = host + route;
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  // if we have to authenticate, save some time to login 
  if(authorizationRequired){
    await page.waitFor(50000);
  }
  // take visible and full-page screenshot on desktop
  await takeScreenshot({
    page,
    width: 1920,
    height: 1080,
    filename,
    screenSize: 'Desktop'
  });
  // take visible and full-page screenshot on mobile
  await takeScreenshot({
    page,
    width: 768,
    height: 1000,
    filename,
    screenSize: 'Mobile'
  });
  page.close();
}
async function takeScreenshot(options) {
  const {page, width, height, filename, screenSize} = options;
  fs.mkdirSync(`../screenshots/${filename}/`, { recursive: true });

  if(screenSize === 'Mobile'){
    await page.emulate(devices['iPhone X']);
  } else {
    page.setViewport({ width, height });
  }

  await page.screenshot({ path: `../screenshots/${filename}/${filename}_${screenSize}.png` });

  //changes the footer styles for full page screenshot
  // these are hacky ways to prevent the footer on trulicity from getting in the way
  // if you are not capturing the trulicity site, then remove the page.evaluate functions below
  if(screenSize === 'Desktop'){
    await page.evaluate(() => {
      let footer = document.querySelector('.lds-isi');
      footer.style.width = "100%";
      footer.style.position = "relative";
      footer.style.top = null;
      // scroll down and up the page so footer content is displayed properly
      window.scrollBy(0,window.document.body.scrollHeight);
      window.scrollBy(0, -window.document.body.scrollHeight);
    });
  } else {
    await page.evaluate(() => {
      let footer = document.querySelector('.lds-isi');
      footer.style.width = "100%";
      footer.style.position = "relative";
      footer.style.top = null;
      // scroll down and up the page so footer content is displayed properly
      window.scrollBy(0,window.document.body.scrollHeight);
    });  
  }

  await page.screenshot({ path: `../screenshots/${filename}/${filename}_${screenSize}_Scroll.png`, fullPage: true });
}

const captureAllRoutes = async () => {
  // some sites require us to login before we can access them
  // by setting this variable to true, on the first page request it will give us time to login
  let authorizationRequired = false;
  for (const [pageName, pageURL] of Object.entries(routes)) {
    await capturePage(pageName, pageURL, authorizationRequired);
    authorizationRequired = false;
  }
}

const cleanup = () => {
  browser.close();
}

async function main() {
  await init();
  await captureAllRoutes();
  cleanup();
}
main();