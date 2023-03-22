import type {
	PersistedStateFactoryOptions,
	PersistedStateOptions,
} from './types'

const isObject = (v: unknown): v is Object => typeof v === 'object' && v !== null

export const normalizeOptions = (
	options: boolean | PersistedStateOptions | undefined,
	globalOptions: PersistedStateFactoryOptions,
): PersistedStateOptions => {
	options = isObject(options)
		? options
		: Object.create(null)

	return new Proxy(options as object, {
		get(t, p, r) {
			return (
				Reflect.get(t, p, r) ||
				Reflect.get(globalOptions, p, r)
			)
		}
	})
}
