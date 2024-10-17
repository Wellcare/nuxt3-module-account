<script setup lang="ts">
import { ref, useI18n, useVModel, type PropType } from '#imports'
import type { Relationship } from '../../../models'

const props = defineProps({
    initForm: {
        type: Object as PropType<Relationship>,
        default: () => ({}) as Relationship,
    },
    isReadOnly: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:initForm'])

const { t } = useI18n()

const form = useVModel(props, 'initForm', emit)
const vFormRef = ref<HTMLFormElement | null>(null)

const validate = async (): Promise<boolean> => {
    return await vFormRef.value?.validate()
}
</script>

<template>
    <form ref="vFormRef" class="space-y-6" @submit.prevent="validate">
        <div class="space-y-2">
            <label for="fullname" class="block font-bold">
                {{ t('Họ và tên') }}
            </label>
            <InputText
                id="fullname"
                v-model="form.name"
                :class="{ 'p-invalid': !form.name }"
                :placeholder="t('Nhập họ và tên')"
                :readonly="isReadOnly"
                class="w-full" />
            <small v-if="!form.name" class="text-red-500">
                {{ t('Vui lòng nhập họ và tên') }}
            </small>
        </div>

        <div class="space-y-2">
            <label for="dob" class="block font-bold">
                {{ t('Ngày sinh') }}
            </label>
            <DatePicker
                v-model="form.dob"
                input-id="dob"
                :placeholder="t('Chọn ngày sinh')"
                show-icon
                fluid
                icon-display="input"
                date-format="dd/mm/yy"
                :disabled="isReadOnly"
                class="w-full" />
        </div>

        <div class="space-y-2">
            <label class="block font-bold">
                {{ t('Giới tính') }}
            </label>
            <div class="flex space-x-4">
                <div
                    class="flex w-1/2 items-center rounded-lg border-2 bg-white p-2 dark:border-[#3f3f46] dark:bg-black">
                    <RadioButton
                        v-model="form.gender"
                        input-id="gender-male"
                        name="gender"
                        value="M"
                        :disabled="isReadOnly" />
                    <label for="gender-male" class="ml-2">{{ t('Nam') }}</label>
                </div>
                <div
                    class="flex w-1/2 items-center rounded-lg border-2 bg-white p-2 dark:border-[#3f3f46] dark:bg-black">
                    <RadioButton
                        v-model="form.gender"
                        input-id="gender-female"
                        name="gender"
                        value="F"
                        :disabled="isReadOnly" />
                    <label for="gender-female" class="ml-2">{{
                        t('Nữ')
                    }}</label>
                </div>
            </div>
        </div>
    </form>
</template>
