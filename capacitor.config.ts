import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hkrestaurant.lottery',
  appName: 'HK Restaurant Lottery',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
