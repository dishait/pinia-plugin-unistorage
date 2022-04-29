const isObject = v => typeof v === 'object' && v !== null

export const normalizeOptions = (
	options,
	globalOptions
) => {
	options = isObject(options)
		? options
		: Object.create(null)

	return new Proxy(options, {
		get(t, p, r) {
			return (
				Reflect.get(t, p, r) ||
				Reflect.get(globalOptions, p, r)
			)
		}
	})
}
