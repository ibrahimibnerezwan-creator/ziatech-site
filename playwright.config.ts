import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',workers:1,fullyParallel:false,timeout:45000,
 use:{baseURL:'http://127.0.0.1:3187',viewport:{width:1366,height:900},trace:'retain-on-failure',launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH}},
 outputDir:'.audit/browser-results',
 reporter:[['list'],['json',{outputFile:'.audit/browser-results.json'}]],
 webServer:{command:'npm run dev -- --hostname 127.0.0.1 --port 3187',url:'http://127.0.0.1:3187',reuseExistingServer:false,timeout:60000}
});
