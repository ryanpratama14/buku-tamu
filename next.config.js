await import("./src/env.js");

/** @type {import("next").NextConfig} */
import withPWA from "next-pwa";

const config = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
};

export default config;
