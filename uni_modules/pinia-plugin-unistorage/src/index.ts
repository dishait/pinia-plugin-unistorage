import { pick } from './filter'
import type { PiniaPlugin } from "pinia"
import { normalizeOptions } from './normalize'
import { PersistedStateFactoryOptions } from "./types"

export function createUnistorage(globalOptions: PersistedStateFactoryOptions = {}): PiniaPlugin {
	return function (ctx) {
		{
			const { store, options } = ctx
			// @ts-ignore
			let { unistorage } = options || {}

			if (!unistorage) return

			const {
				paths = null,
				afterRestore,
				beforeRestore,
				serializer = {
					serialize: JSON.stringify,
					deserialize: JSON.parse
				},
				key = store.$id
			} = normalizeOptions(unistorage, globalOptions)

			beforeRestore?.(ctx)

			try {
				// @ts-ignore
				const fromStorage = uni.getStorageSync(store.$id)
				if (fromStorage)
					store.$patch(serializer.deserialize(fromStorage))
			} catch (_error) { }

			afterRestore?.(ctx)

			store.$subscribe(
				(_, state) => {
					try {
						const toStore = Array.isArray(paths)
							? pick(state, paths)
							: state
						// @ts-ignore
						uni.setStorageSync(
							key,
							serializer.serialize(toStore)
						)
					} catch (_error) { }
				},
				{ detached: true }
			)
		}
	}
}
