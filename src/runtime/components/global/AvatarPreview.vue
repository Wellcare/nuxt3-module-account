<script setup lang="ts">
import { computed, ref } from '#imports'

interface Props {
    initialSrc?: string
    width?: string | number
    height?: string | number
    name?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialSrc: '',
    width: '6rem',
    height: '6rem',
    name: '',
})

const emit = defineEmits<{
    (e: 'on:file-selected', file: File): void
}>()

const src = ref<string>(props.initialSrc)
const fileInput = ref<HTMLInputElement | null>(null)

const initials = computed(() => {
    if (!props.name) return ''
    return props.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const containerStyle = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height:
        typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

function triggerFileInput() {
    fileInput.value?.click()
}

function onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        handleFile(file)
        emit('on:file-selected', file)
    }
}

function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
        src.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

defineExpose({
    triggerFileInput,
})
</script>

<template>
    <div class="cursor-pointer flex-col">
        <div
            class="relative cursor-pointer overflow-hidden rounded-full border-2"
            :style="containerStyle"
            @click="triggerFileInput">
            <img
                v-if="src"
                :src="src"
                alt="Uploaded Image"
                class="h-full w-full object-cover" />
            <span
                v-else-if="name"
                class="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-semibold text-gray-600">
                {{ initials }}
            </span>
            <span
                v-else
                class="flex h-full w-full items-center justify-center text-gray-400">
                <i class="pi pi-user text-5xl" />
            </span>
            <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                <i class="pi pi-camera text-3xl text-white" />
            </div>
        </div>
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelect" />
    </div>
</template>
