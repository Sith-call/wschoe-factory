import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.plzsurvive.dadjokemachine",
  appName: "\uC544\uC7AC\uAC1C\uADF8 \uC790\uD310\uAE30",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1000,
      backgroundColor: "#FBF7F0",
    },
  },
};

export default config;
