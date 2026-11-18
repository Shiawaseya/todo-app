import type { CapacitorConfig } from '@capacitor/cli';
import { icons } from 'lucide-react';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'dist',
plugins: {
    Keyboard: {
      resize: 'none', 
      scroll: 'none',
    },
    assets: {
      icons: "icon.png",
      splash: "splash.png"
    },
  },
};

export default config;
