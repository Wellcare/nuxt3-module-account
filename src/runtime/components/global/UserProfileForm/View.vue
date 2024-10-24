<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, useI18n } from '#imports'
import Button from 'primevue/button';

import type { ProfileForm } from '../../../models'
import { Avatar, Checker, Form } from '../../internal/UserProfileForm'

// Define interfaces for props
interface Avatar {
    url?: string
}

type ProfileFormKey = keyof ProfileForm

// Define the props interface
interface Props {
    isShowRelationship?: boolean
    textBtnSubmit?: string
    dobPicker?: 'date' | 'year'
    defaultData?: ProfileForm
    isReadOnly?: boolean
    isRequireAvatar?: boolean
    loading?: boolean
    relationships?: any[]
    minDate?: Date
    maxDate?: Date
}

// Use withDefaults
const props = withDefaults(defineProps<Props>(), {
    isShowRelationship: false,
    textBtnSubmit: 'save',
    dobPicker: 'date',
    defaultData: () => ({}),
    isReadOnly: false,
    isRequireAvatar: false,
    loading: false,
    relationships: () => [],
    minDate: undefined,
    maxDate: undefined,
})

// Define emits
const emit = defineEmits<{
    'on:submit': [form: ProfileForm]
}>()

const { t } = useI18n()

const sectionAvatarRef = ref<HTMLElement | any | null>(null)
const sectionFormsRef = ref<HTMLElement | any | null>(null)
const isValid = ref<boolean>(false)

const initForm = reactive<ProfileForm>({
    file: props.defaultData.file,
    avatar: { url: props.defaultData?.avatar?.url || '' },
    name: props.defaultData?.name,
    dob: props.defaultData?.dob,
    gender: props.defaultData?.gender,
    relationship: props.defaultData?.relationship,
})

const isAvatar = computed<string>(() => props.defaultData?.avatar?.url || '')

// Helper function để type check khi access object với dynamic key
const getProfileFormValue = <K extends ProfileFormKey>(
    obj: ProfileForm,
    key: K,
): ProfileForm[K] => obj[key]

const profileForm = computed<ProfileForm>(() => {
    if (props.isRequireAvatar) {
        return initForm
    }

    return (Object.keys(initForm) as ProfileFormKey[])
        .filter((key) => key !== 'file')
        .reduce((obj, key) => {
            obj[key] = getProfileFormValue(initForm, key)
            return obj
        }, {} as ProfileForm)
})

const initRequire = () => {
    if (props.isRequireAvatar) {
        if (isAvatar.value) {
            delete initForm.file
        } else {
            delete initForm.avatar
        }
    } else {
        delete initForm.file
        if (!isAvatar.value) {
            delete initForm.avatar
        }
    }

    if (!props.isShowRelationship) {
        delete initForm.relationship
    }
}

const validAvatar = async ({ deep = false }: { deep?: boolean } = {}) => {
    if (props.isRequireAvatar) {
        const valid = isAvatar.value || profileForm.value.file
        if (!valid && !deep) {
            await sectionAvatarRef.value?.checkAvatarRequirement(
                profileForm.value?.file,
            )
        }
        return !!valid
    } else {
        return true
    }
}

const checkValidForm = (form: ProfileForm): boolean => {
    for (const key in form) {
        if (!getProfileFormValue(form, key as any)) {
            return false
        }
    }
    return true
}

const validateForm = async ({ deep = false }: { deep?: boolean } = {}) => {
    if (deep) {
        return checkValidForm(profileForm.value)
    } else {
        return await sectionFormsRef.value?.validate()
    }
}

const validDeep = async () => {
    const isValidAvatarDeep = await validAvatar({ deep: true })
    const isValidFormDeep = await validateForm({ deep: true })
    isValid.value = isValidAvatarDeep && isValidFormDeep
}

const submit = async () => {
    const isAvatarRq = await validAvatar()
    const isForm = await validateForm()
    isValid.value = isAvatarRq && isForm

    if (isValid.value) {
        emit('on:submit', initForm)
    }
}

const onChangeAvatar = (val: File) => {
    if (initForm?.avatar?.url) {
        delete initForm.avatar
    }
    initForm.file = val
    validDeep()
}

const onChangeForm = (val: ProfileForm) => {
    Object.assign(initForm, val)

    validDeep()
}

onMounted(() => {
    initRequire()
    nextTick(async () => {
        if (props.defaultData?._id) {
            await validAvatar()
            await validateForm()
        }
    })
})
</script>

<template>
    <div class="overflow-y-auto overflow-x-hidden">
        <div>
            <Avatar
                ref="sectionAvatarRef"
                :default-data="defaultData"
                :is-require-avatar="isRequireAvatar"
                @on:change="onChangeAvatar" />
            <div class="-translate-y-12 transform px-4">
                <div
                    class="my-4 rounded-2xl border bg-white p-4 dark:bg-slate-800">
                    <Form
                        ref="sectionFormsRef"
                        :init-form="initForm"
                        :is-require-avatar="isRequireAvatar"
                        :is-show-relationship="isShowRelationship"
                        :dob-picker="dobPicker"
                        :loading="loading"
                        :max-date="maxDate"
                        :min-date="minDate"
                        @update:init-form="onChangeForm" />
                </div>

                <Checker v-bind="{ ...$props }" :init-form="initForm" />
            </div>
        </div>

        <footer
            v-if="!isReadOnly"
            class="fixed bottom-0 left-0 right-0 bg-white p-4 dark:bg-slate-800">
            <Button class="w-full" @click="submit">
                {{ t(textBtnSubmit) }}
            </Button>
        </footer>
    </div>
</template>
