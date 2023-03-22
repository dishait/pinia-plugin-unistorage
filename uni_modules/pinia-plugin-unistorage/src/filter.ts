import type { StateTree } from 'pinia'

function get(state: StateTree, path: Array<string>) {
	return path.reduce((obj, p) => {
		return obj?.[p]
	}, state)
}

function set(state: StateTree, path: Array<string>, val: unknown): StateTree {
	return (
		(path.slice(0, -1).reduce((obj, p) => {
			if (!/^(__proto__)$/.test(p))
				return (obj[p] = obj[p] || {})
			else return {}
		}, state)[path[path.length - 1]] = val),
		state
	)
}

export function pick(baseState: StateTree, paths: string[]): StateTree {
	return paths.reduce((substate, path) => {
		const pathArray = path.split('.')
		return set(
			substate,
			pathArray,
			get(baseState, pathArray)
		)
	}, {})
}
