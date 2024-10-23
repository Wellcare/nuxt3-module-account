<script setup lang="ts">
import {
    computed,
    ref,
    useDayjs,
    useUploadTemporary,
    useUserProfile,
    watch,
} from '#imports'

import type { ProfileForm } from '../../../models'
import UserProfileFormView from './View.vue'

type TypeSubmit = 'update' | 'create' | 'delete' | 'emit'

interface Props {
    defaultData: ProfileForm
}

const props = withDefaults(defineProps<Props>(), {
    defaultData: () => ({}),
})

const emit = defineEmits<{
    'on:submit-form': [data: ProfileForm]
    'on:submit-error': [error: any]
    'on:submit-success': [data: any]
}>()

// Composables
const dayjs = useDayjs()
const {
    createRelationship,
    updateUser,
    deleteRelationship,
    loading: userLoading,
    error: userError,
} = useUserProfile()

const {
    upload,
    loading: uploadAvatarLoading,
    error: uploadError,
} = useUploadTemporary()

// Watch for errors from both composables and emit them
watch(
    [userError, uploadError],
    ([newUserError, newUploadError]) => {
        if (newUserError) {
            emit('on:submit-error', newUserError)
        }
        if (newUploadError) {
            emit('on:submit-error', newUploadError)
        }
    },
    { immediate: true },
)

// Reactive refs
const form = ref<ProfileForm>({})
const uploadedAvatar = ref({ _id: '', url: '', user: '' })

// Computed
const userId = computed(() => props.defaultData?._id)
const loading = computed(() => userLoading.value || uploadAvatarLoading.value)

// Methods
const getBaseParams = () => {
    const formData = { ...form.value }
    delete formData.file

    return {
        ...formData,
        dob: formData.dob ? dayjs(formData.dob).toISOString() : undefined,
        avatar: uploadedAvatar.value._id
            ? {
                  _id: uploadedAvatar.value._id,
                  url: uploadedAvatar.value.url,
              }
            : undefined,
        ...(uploadedAvatar.value.user && { _id: uploadedAvatar.value?.user }),
    }
}

const actionMap: Record<TypeSubmit, () => Promise<any>> = {
    create: () =>
        createRelationship({
            ...getBaseParams(),
        }),
    update: () => {
        if (userId.value) {
            const params = getBaseParams()
            delete params._id
            return updateUser({
                _id: userId.value,
                update: params,
            })
        }
        return Promise.resolve()
    },
    delete: () =>
        userId.value ? deleteRelationship(userId.value) : Promise.resolve(),
    emit: () => Promise.resolve(),
}

const performAction = async (type: TypeSubmit) => {
    try {
        await actionMap[type]()
    } catch (error) {
        console.error('Action failed:', error)
        emit('on:submit-error', error)
    }
}

const uploadFile = async (file: File): Promise<void> => {
    try {
        const result = await upload({ key: Date.now(), formdata: file })
        if (result) {
            uploadedAvatar.value = {
                _id: result?._id,
                url: result?.url,
                user: result?.user,
            }
        }
    } catch (error) {
        console.error('File upload failed:', error)
        emit('on:submit-error', error)
        throw error
    }
}

const submitFormDataFn = async (type: TypeSubmit) => {
    try {
        if (form.value.file) {
            await uploadFile(form.value.file)
        }
        await performAction(type)
    } catch (error) {
        console.error('Form submission failed:', error)
        emit('on:submit-error', error)
    }
}

const submit = (formData: ProfileForm) => {
    form.value = formData
    emit('on:submit-form', formData)
}

defineExpose({
    submit,
    submitFormDataFn,
    loading,
})
</script>

<template>
    <UserProfileFormView
        :loading="loading"
        v-bind="{ ...props, ...$attrs }"
        @on:submit="submit" />
</template>
