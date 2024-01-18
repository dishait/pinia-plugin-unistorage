import { copyFile } from "fs/promises";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  declaration: true,
  clean: false,
  rollup: {
    emitCJS: true,
  },
  entries: [{
    builder: "rollup",
    name: "index",
    input: "./uni_modules/pinia-plugin-unistorage/src",
  }],
  hooks: {
    "build:done"(ctx) {
      copyFile(
        "dist/index.mjs",
        "./uni_modules/pinia-plugin-unistorage/index.js",
      );
    },
  },
});
