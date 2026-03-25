import { defineConfig, devices } from '@playwright/test';

const target = process.env.E2E_TARGET ?? 'all';

const demoWebProject = {
  name: 'demo-web',
  testMatch: /demo-web\.spec\.ts/,
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:4100',
  },
};

const expoRouterProject = {
  name: 'expo-router-web',
  testMatch: /expo-router-web\.spec\.ts/,
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:4103',
  },
};

const expoNavigationProject = {
  name: 'expo-navigation-web',
  testMatch: /expo-navigation-web\.spec\.ts/,
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:4104',
  },
};

const demoWebServer = {
  command: 'npm run dev -- --host 127.0.0.1 --port 4100',
  cwd: 'packages/demo-web',
  url: 'http://127.0.0.1:4100',
  reuseExistingServer: !process.env.CI,
  timeout: 180_000,
};

const expoRouterServer = {
  command:
    'CI=1 EXPO_NO_TELEMETRY=1 npx expo --web --host localhost --port 4103',
  cwd: 'packages/demo-rn-expo',
  url: 'http://127.0.0.1:4103',
  reuseExistingServer: !process.env.CI,
  timeout: 180_000,
};

const expoNavigationServer = {
  command:
    'CI=1 EXPO_NO_TELEMETRY=1 npx expo --web --host localhost --port 4104',
  cwd: 'packages/demo-rn-navigation',
  url: 'http://127.0.0.1:4104',
  reuseExistingServer: !process.env.CI,
  timeout: 180_000,
};

const projects =
  target === 'web'
    ? [demoWebProject]
    : target === 'expo'
      ? [expoRouterProject, expoNavigationProject]
      : [demoWebProject, expoRouterProject, expoNavigationProject];

const webServer =
  target === 'web'
    ? [demoWebServer]
    : target === 'expo'
      ? [expoRouterServer, expoNavigationServer]
      : [demoWebServer, expoRouterServer, expoNavigationServer];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects,
  webServer,
});
