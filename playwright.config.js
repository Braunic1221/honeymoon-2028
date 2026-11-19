import { defineConfig, devices } from '@playwright/test';

const chromium = process.env.STUDIO_CHROMIUM ? {executablePath:process.env.STUDIO_CHROMIUM} : {};

export default defineConfig({
  testDir:'./tests',
  testMatch:'*.spec.js',
  retries:0,
  use:{baseURL:'http://127.0.0.1:4173/honeymoon-2028/',trace:'retain-on-failure'},
  webServer:{command:'npm run dev',url:'http://127.0.0.1:4173/honeymoon-2028/',reuseExistingServer:!process.env.CI},
  projects:[
    {name:'Desktop Chromium',use:{...devices['Desktop Chrome'],launchOptions:chromium}},
    {name:'Mobile Chromium',use:{...devices['Pixel 7'],launchOptions:chromium}},
    {name:'iPhone Safari (WebKit)',use:{...devices['iPhone 13'],browserName:'webkit'}},
  ],
});
