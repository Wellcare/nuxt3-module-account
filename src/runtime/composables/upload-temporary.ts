import { computed,  } from '#imports'


export const useUploadTemporary = () => {
  

    const baseUrlUpload = 

    const {
        response,
        loading: loadingUpload,
        onSuccess: onUploadSuccess,
        onError: onUploadError,
        execute: executeUpload,
    } = useRepository<IResponse<any>>({
        fetcher: (formData: FormData) =>
            formData &&
            post({
                baseURL: baseUrlUpload,
                url: '/file-management/project/profile/upload',
                data: formData,
                timeout: 5000,
            }),
        useFetch: false,
        toastOnError: true,
    })

    const loading = computed<boolean>(
        () => loadingGetUserId.value || loadingUpload.value,
    )

    const upload = async ({
        key,
        formdata: file,
    }: {
        key: number
        formdata: File
    }) => {
        try {
            const userId = await getUserId(key)
            if (!userId) return null

            const formData = createFormData(file, userId)
            await executeUpload(formData)
            return response.value
        } catch (error) {
            handleErrorMessage(error)
            return null
        }
    }

    const getUserId = async (key: number): Promise<string | null> => {
        const res = await executeGetUserId({ key })
        if (res.code === 200 || res.code === 201) {
            return res.results as unknown as string
        }
        handleErrorMessage(res)
        return null
    }

    const createFormData = (file: File, userId: string): FormData => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('labels', 'tobeArchived:true')
        formData.append('user', userId)
        return formData
    }

    onUploadError(handleErrorMessage)

    return { upload, loading, onUploadSuccess, onUploadError, response }
}
