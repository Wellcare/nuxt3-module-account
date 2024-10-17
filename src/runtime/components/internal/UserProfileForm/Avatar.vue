<script setup lang="ts">
import { computed, ref, useI18n } from '#imports'

import AvatarPreview from '../AvatarPreview.vue'

interface Avatar {
    url: string
}

interface ProfileForm {
    avatar: Avatar
    userId?: string
    name?: string
    file?: File
}

interface Props {
    defaultData: ProfileForm
    isReadOnly?: boolean
    requireAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    defaultData: () => ({ avatar: { url: '' } }),
    isReadOnly: false,
    requireAvatar: false,
})

const emit = defineEmits<{
    (e: 'on:change', file: File): void
    (e: 'on:require-avatar', isRequired: boolean): void
}>()

const { t } = useI18n()

const urlBase64 = ref('')
const isRequireAvatar = ref(false)
const isRunning = ref(false)

const form = computed(() => ({
    avatar: { url: props.defaultData.avatar?.url || '' },
    userId: props.defaultData.userId,
    name: props.defaultData.name,
    file: props.defaultData.file,
}))

const backgroundImage = computed(() => urlBase64.value || form.value.avatar.url)

const checkAvatarRequirement = (file: File | undefined) => {
    const isRequired = props.requireAvatar && !file
    isRequireAvatar.value = isRequired
    emit('on:require-avatar', isRequired)
}

const onFileSelected = (file: File) => {
    checkAvatarRequirement(file)
    isRunning.value = true

    const reader = new FileReader()
    reader.onload = (e) => {
        urlBase64.value = e.target?.result as string
        isRunning.value = false
        emit('on:change', file)
    }
    reader.readAsDataURL(file)
}
</script>

<template>
    <div
        class="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-lg text-center shadow-md">
        <transition name="fade">
            <img
                v-if="backgroundImage"
                :key="backgroundImage"
                :src="backgroundImage"
                alt="Background"
                class="absolute inset-0 h-full w-full object-cover blur-[10px] filter" />
        </transition>
        <div
            class="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <AvatarPreview
                :initial-src="form.avatar.url"
                :name="form.name"
                @on:file-selected="onFileSelected" />
            <transition name="slide-y">
                <span
                    v-if="isRequireAvatar"
                    class="mt-2 text-sm font-medium text-red-500"
                    :class="{ 'animate-pulse': isRunning }">
                    {{ t('require avatar') }}
                </span>
            </transition>
        </div>
        <div
            v-if="!backgroundImage"
            class="absolute inset-0 flex items-center justify-center bg-slate-200" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-y-enter-active,
.slide-y-leave-active {
    transition:
        transform 0.3s ease,
        opacity 0.3s ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
