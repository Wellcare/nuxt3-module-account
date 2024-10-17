<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
})

const { user } = await useUserInfo({
    scope: '_id',
})

const { upload, loading, progress } = useUpload({
    user: user.value._id || '',
    labels: `avatar:${user.value._id}`,
    project: 'profile',
})

const error = ref<string | null>(null)
const uploadedFile = ref<any>(null)

const onFileSelect = async (event: any) => {
    const file = event.files[0]
    error.value = null
    uploadedFile.value = null

    try {
        const response = await upload(file)
        uploadedFile.value = response.results
    } catch (err: any) {
        error.value = err.message || 'An error occurred during upload'
    }
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    )
}
</script>

<template>
    <div class="container mx-auto p-6">
        <h1 class="mb-6 text-3xl font-bold">File Upload Test</h1>

        <div class="mb-4">
            <FileUpload
                mode="basic"
                :custom-upload="true"
                accept="image/*"
                :auto="true"
                :disabled="loading"
                @select="onFileSelect" />
        </div>

        <div v-if="loading" class="mb-4">
            <ProgressBar :value="progress" :show-value="true" class="h-6" />
        </div>

        <div v-if="error" class="mb-4 text-red-500">
            {{ error }}
        </div>

        <div
            v-if="uploadedFile"
            class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            <p class="font-bold">File uploaded successfully!</p>
            <p>Name: {{ uploadedFile.name }}</p>
            <p>Size: {{ formatFileSize(uploadedFile.size) }}</p>
        </div>
    </div>
</template>
