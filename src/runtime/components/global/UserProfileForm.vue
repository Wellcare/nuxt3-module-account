<script setup lang="ts">
import {
    computed,
    nextTick,
    onMounted,
    reactive,
    ref,
    type PropType,
} from 'vue'
import type { Relationship } from '../../models'
import { Avatar, Checker, Form } from '../internal/UserProfileForm'

const props = defineProps({
    textNote: { type: String, default: '' },
    showRelationship: { type: Boolean, default: false },
    showBodyIndex: { type: Boolean, default: false },
    showTitle: { type: Boolean, default: false },
    btnSubmit: { type: Object, default: () => ({ text: 'next' }) },
    title: { type: String, default: 'register information' },
    dobPicker: { type: String, default: 'date' },
    backgroundColor: { type: String, default: 'transparent' },
    defaultData: {
        type: Object as PropType<Relationship>,
        default: () => ({}),
    },
    isReadOnly: { type: Boolean, default: false },
    wAttrsDateField: { type: [Object, Array], default: () => ({}) },
    ruleDateField: { type: Array, default: () => [] },
    ruleNameField: { type: Array, default: () => [] },
    ruleYearField: { type: Array, default: () => [] },
    ruleGenderField: { type: Array, default: () => [] },
    ruleRelationshipField: { type: Array, default: () => [] },
    ruleAvatarField: { type: Array, default: () => [] },
    onAttrsAvatar: { type: Object, default: () => ({}) },
    requireAvatar: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    relationships: { type: Array, default: () => [] },
})

const sectionAvatarRef = ref<HTMLElement | any | null>(null)
const sectionFormsRef = ref<HTMLElement | any | null>(null)
const isValid = ref<boolean>(false)

const initForm = reactive<Relationship>({
    avatar: { url: props.defaultData?.avatar?.url },
    name: props.defaultData?.name,
    dob: props.defaultData?.dob,
    gender: props.defaultData?.gender,
    relationship: props.defaultData?.relationship,
})

const isAvatar = computed<string>(() => props.defaultData?.avatar?.url || '')

const profileForm = computed<Relationship | any>(() => {
    return props.requireAvatar
        ? initForm
        : Object.keys(initForm)
              .filter((i) => i !== 'file')
              .reduce((obj, key) => {
                  obj[key] = initForm[key]
                  return obj
              }, {} as Relationship)
})

const initRequire = () => {
    if (!props.showRelationship) {
        delete initForm.relationship
    }
}

const validAvatar = async ({ deep = false }: { deep?: boolean } = {}) => {
    if (props.requireAvatar) {
        const valid = isAvatar.value || profileForm.value.file
        if (!valid && !deep) {
            await sectionAvatarRef.value?.checkIsRequireAvatar(
                profileForm.value?.file,
            )
        }
        return !!valid
    } else {
        return true
    }
}

const validateForm = async ({ deep = false }: { deep?: boolean } = {}) => {
    if (deep) {
        return sectionFormsRef.value?.checkValidForm(profileForm.value)
    } else {
        return await sectionFormsRef.value?.validate(profileForm.value)
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
        emit('user-profile-data', initForm)
    }
    emit('on:submit')
}

const uploadAvatar = (userId: string) => {
    sectionAvatarRef.value?.uploadAvatar(userId)
}

const onChangeAvatar = (val: File) => {
    if (initForm?.avatar?.url) {
        delete initForm.avatar
    }
    initForm.file = val
    validDeep()
}

const onChangeForm = (val: Relationship) => {
    Object.assign(initForm, val)
    validDeep()
}

onMounted(() => {
    initRequire()
    nextTick(async () => {
        if (props.defaultData?.userId || props.defaultData?._id) {
            await validAvatar()
            await validateForm()
        }
    })
})
</script>

<template>
    <div class="overflow-y-auto overflow-x-hidden">
        <div v-if="showTitle" class="title text-center font-medium">
            <h3>{{ title }}</h3>
        </div>

        <div>
            <Avatar
                ref="sectionAvatarRef"
                v-bind="{ ...$props }"
                @on:change="onChangeAvatar" />
            <div class="-translate-y-12 transform">
                <div
                    class="my-4 rounded-lg border-2 bg-white p-4 dark:bg-slate-800">
                    <Form
                        ref="sectionFormsRef"
                        v-bind="{ ...$props }"
                        :init-form="initForm"
                        @update:init-form="onChangeForm" />
                </div>

                <Checker v-bind="{ ...$props }" :init-form="initForm" />
            </div>
        </div>

        <footer
            v-if="!isReadOnly"
            class="fixed bottom-0 left-0 right-0 bg-white p-4 dark:bg-slate-800">
            <button
                :class="[
                    'w-full rounded-lg py-2 text-white',
                    isValid ? 'bg-primary-500' : 'bg-gray-300',
                ]"
                :disabled="loading"
                @click="submit">
                {{ btnSubmit.text }}
            </button>
        </footer>
    </div>
</template>
