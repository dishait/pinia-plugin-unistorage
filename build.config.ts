import { copyFile, readFile, writeFile } from "fs/promises";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  failOnWarn: false,
  declaration: false,
  clean: false,
  rollup: {
    emitCJS: false,
  },
  entries: [{
    builder: "rollup",
    name: "index",
    input: "./uni_modules/pinia-plugin-unistorage/src",
  }],
  hooks: {
    async "build:done"(ctx) {
      copyFile(
        "dist/index.mjs",
        "./uni_modules/pinia-plugin-unistorage/index.js",
      );

      const dts = await readFile(
        "node_modules/pinia-plugin-persistedstate/dist/index.d.mts",
        "utf-8",
      );

      let newDts = dts + `
/**
 * Creates a pinia persistence plugin with uniapp
 * @param factoryOptions global persistence options
 * @returns pinia plugin
 */
declare function createUnistorage(factoryOptions?: PersistedStateFactoryOptions): PiniaPlugin;
      `;

      newDts = newDts.replace(
        "persist?: boolean | PersistedStateOptions | PersistedStateOptions[];",
        "persist?: boolean | PersistedStateOptions | PersistedStateOptions[];\n        unistorage?: boolean | PersistedStateOptions | PersistedStateOptions[];",
      ).replace(
        "_default as default",
        "_default as default, createUnistorage",
      );

      await writeFile(
        "./uni_modules/pinia-plugin-unistorage/index.d.ts",
        newDts,
      );

      await writeFile(
        "./dist/index.d.ts",
        newDts,
      );
    },
  },
});
