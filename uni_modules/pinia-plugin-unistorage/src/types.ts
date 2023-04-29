import type { PiniaPluginContext, StateTree } from 'pinia'

type Prettify<T> = { [K in keyof T]: T[K] }

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export interface Serializer {
    /**
     * Serializes state into string before storing
     * @default JSON.stringify
     */
    serialize: (value: StateTree) => string

    /**
     * Deserializes string into state before hydrating
     * @default JSON.parse
     */
    deserialize: (value: string) => StateTree
}

export interface PersistedStateOptions {
    /**
     * Storage key to use.
     * @default $store.id
     */
    key?: string

    /**
     * Dot-notation paths to partially save state. Saves everything if undefined.
     * @default undefined
     */
    paths?: Array<string>

    /**
     * Customer serializer to serialize/deserialize state.
     */
    serializer?: Serializer

    /**
     * Hook called before state is hydrated from storage.
     * @default null
     */
    beforeRestore?: (context: PiniaPluginContext) => void

    /**
     * Hook called after state is hydrated from storage.
     * @default undefined
     */
    afterRestore?: (context: PiniaPluginContext) => void
}

export type PersistedStateFactoryOptions = Prettify<Pick<
    PersistedStateOptions,
    'serializer' | 'afterRestore' | 'beforeRestore'
> & {
    /**
     * Global key generator, allows pre/postfixing store keys.
     * @default storeKey => storeKey
     */
    key?: (storeKey: string) => string
}>

declare module 'pinia' {
    export interface DefineStoreOptionsBase<S extends StateTree, Store> {
        unistorage?: boolean | PersistedStateOptions
    }
}