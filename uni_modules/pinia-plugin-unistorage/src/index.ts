import { pick } from "./filter";
import type { PiniaPlugin } from "pinia";
import { normalizeOptions } from "./normalize";
import { PersistedStateFactoryOptions } from "./types";

function passage(key: string) {
  return key;
}

export function createUnistorage(
  globalOptions: PersistedStateFactoryOptions = {},
): PiniaPlugin {
  const { key: normalizeKey = passage } = globalOptions || {};
  if (globalOptions?.key) {
    delete globalOptions.key;
  }
  return function (ctx) {
    {
      const { store, options } = ctx;
      // @ts-ignore
      let { unistorage } = options || {};

      if (!unistorage) return;

      const {
        paths = null,
        afterRestore,
        beforeRestore,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        key = store.$id,
      } = normalizeOptions(unistorage, globalOptions);

      beforeRestore?.(ctx);

      const normalizedKey = normalizeKey(key);

      try {
        // @ts-ignore
        const fromStorage = uni.getStorageSync(normalizedKey);
        if (fromStorage) {
          store.$patch(serializer.deserialize(fromStorage));
        }
      } catch (_error) {}

      afterRestore?.(ctx);

      store.$subscribe(
        (_, state) => {
          try {
            const toStore = Array.isArray(paths) ? pick(state, paths) : state;
            // @ts-ignore
            uni.setStorageSync(
              normalizedKey,
              serializer.serialize(toStore),
            );
          } catch (_error) {}
        },
        { detached: true },
      );
    }
  };
}
