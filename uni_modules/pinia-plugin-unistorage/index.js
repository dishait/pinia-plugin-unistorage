import { pick } from './shared/filter'
import { normalizeOptions } from './shared/normalize'

export function createUnistorage(globalOptions = {}) {
	return function (ctx) {
		{
			const { store, options } = ctx
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
				const fromStorage = uni.getStorageSync(store.$id)
				if (fromStorage)
					store.$patch(serializer.deserialize(fromStorage))
			} catch (_error) {}

			afterRestore?.(ctx)

			store.$subscribe(
				(_, state) => {
					try {
						const toStore = Array.isArray(paths)
							? pick(state, paths)
							: state
						uni.setStorageSync(
							key,
							serializer.serialize(toStore)
						)
					} catch (_error) {}
				},
				{ detached: true }
			)
		}
	}
}
