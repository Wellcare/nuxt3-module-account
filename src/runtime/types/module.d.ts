/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BaseRuntimeConfig {}
export interface BasePublicRuntimeConfig {
    socketEndPoint: string
}

declare module 'nuxt/schema' {
    interface RuntimeConfig {
        // Define properties specific to RuntimeConfig here
        'nuxt3-module-account': BaseRuntimeConfig
    }

    interface PublicRuntimeConfig {
        // Define properties specific to PublicRuntimeConfig here
        'nuxt3-module-account': BasePublicRuntimeConfig
    }
}

