<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
})

const { upload, loading, error } = useUploadTemporary()
const toast = useToast()

const file = ref<File | null>(null)
const response = ref<any>(null)

const handleFileUpload = (event: any) => {
    file.value = event.files[0]
}

const uploadFile = async () => {
    if (!file.value) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a file first',
            life: 3000,
        })
        return
    }

    const result = await upload({
        key: Date.now(), // Replace with actual key if needed
        formdata: file.value,
    })

    if (result) {
        response.value = result as any
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully',
            life: 3000,
        })
    } else if (error.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.value,
            life: 3000,
        })
    }
}
</script>

<template>
    <div>
        <div class="container mx-auto p-4">
            <h1 class="mb-4 text-2xl font-bold">Test Upload Temporary</h1>

            <div class="mb-4">
                <FileUpload
                    mode="basic"
                    :auto="false"
                    accept="image/*"
                    choose-label="Choose File"
                    @select="handleFileUpload" />
            </div>

            <Button
                :loading="loading"
                label="Upload"
                icon="pi pi-upload"
                class="p-button-primary"
                @click="uploadFile" />

            <ProgressSpinner v-if="loading" class="mt-4" />

            <div v-if="error" class="mt-4 rounded bg-red-100 p-4 text-red-700">
                Error: {{ error }}
            </div>

            <div v-if="response" class="mt-4">
                <h2 class="mb-2 text-xl font-semibold">Upload Response:</h2>
                <div
                    class="overflow-auto rounded bg-gray-900 p-4 dark:bg-gray-100">
                    <pre class="text-sm text-white dark:text-black">{{
                        JSON.stringify(response, null, 2)
                    }}</pre>
                </div>

                <Image
                    v-if="response?.url"
                    :key="response?.url"
                    :src="response?.url" />
            </div>
        </div>

        <Toast />
    </div>
</template>
