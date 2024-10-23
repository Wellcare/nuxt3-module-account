import { computed, ref, useAsyncData, useNuxtApp, type Ref } from '#imports'

import type { Response } from '../../models'
import { useUserProfile } from './user'

interface UploadParams {
    key: number
    formdata: File
}

interface UploadResult {
    url: string
    fileName: string
    fileSize: number
    mimeType: string
    _id: string
    user: string
}

interface UseUploadTemporaryReturn {
    upload: (params: UploadParams) => Promise<UploadResult | null>
    loading: Ref<boolean>
    error: Ref<Error | null>
}

export const useUploadTemporary = (): UseUploadTemporaryReturn => {
    const { $fetchWellcare } = useNuxtApp()
    const { getUserId } = useUserProfile()

    const baseUrlUpload = 'https://upload.mhealthvn.com/'
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const upload = async ({
        key,
        formdata: file,
    }: UploadParams): Promise<UploadResult | null> => {
        loading.value = true
        error.value = null

        try {
            const res = await getUserId({ key })
            const userId = res?.results
            if (!userId) {
                throw new Error('Failed to get user ID')
            }

            const formData = createFormData(file, userId)

            const { data, error: fetchError } = await useAsyncData<
                Response<UploadResult>
            >(() =>
                $fetchWellcare('/file-management/project/profile/upload', {
                    baseURL: baseUrlUpload,
                    method: 'POST',
                    body: formData,
                    timeout: 5000,
                }),
            )

            if (fetchError.value) {
                throw fetchError.value
            }

            return data.value?.results || null
        } catch (err) {
            error.value =
                err instanceof Error ? err : new Error('Unknown error occurred')
            console.error('Upload error:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    const createFormData = (file: File, userId: string): FormData => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('labels', 'tobeArchived:true')
        formData.append('user', userId)
        return formData
    }

    return {
        upload,
        loading: computed(() => loading.value),
        error: computed(() => error.value),
    }
}
