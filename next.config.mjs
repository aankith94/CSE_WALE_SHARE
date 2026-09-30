import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default {
  webpack(config) {
    config.resolve.alias["@"] = root;
    return config;
  },
};
