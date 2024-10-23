import { defineNuxtConfig } from 'nuxt/config'
import {
    app,
    googleFont,
    i18n,
    module,
    nitro,
    primevue,
    runtimeConfig,
    tailwindcss,
    vite,
} from './configs'

export default defineNuxtConfig({
    ssr: false,

    runtimeConfig,

    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },

    colorMode: {
        classPrefix: 'p-',
        classSuffix: '',
    },

    css: ['~/assets/css/index.css', 'primeicons/primeicons.css'],

    modules: [
        '@vee-validate/nuxt',
        '@wellcare/nuxt3-module-data-layer',
        '@wellcare/muot-ui',
        '@vueuse/nuxt',
        'dayjs-nuxt',
        '@nuxt/test-utils/module',
        ['@nuxtjs/google-fonts', googleFont],
        ['../src/module', module],
        '@nuxtjs/i18n',
        '@primevue/nuxt-module',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@vueuse/nuxt',
        '@pinia/nuxt',
    ],

    veeValidate: {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
            Form: 'VeeForm',
            Field: 'VeeField',
            FieldArray: 'VeeFieldArray',
            ErrorMessage: 'VeeErrorMessage',
        },
    },

    i18n,

    app,

    nitro,

    tailwindcss,

    primevue,

    vite,

    compatibilityDate: '2024-09-25',
})
