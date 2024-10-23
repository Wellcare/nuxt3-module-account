<script setup lang="ts">
import type { PropType } from '#imports'
import { computed, useI18n } from '#imports'

import type { ProfileForm } from '../../../models'

// Props
const props = defineProps({
    initForm: {
        type: Object as PropType<ProfileForm>,
        required: true,
    },
})

// i18n
const { t } = useI18n()

// Helper type guard
function isKeyOfProfileForm(key: string): key is keyof ProfileForm {
    return key in props.initForm
}

// Computed data
const checkerFormData = computed(() => {
    return Object.keys(props.initForm).reduce<
        Array<{ label: string; value: boolean }>
    >((acc, curr) => {
        if (isKeyOfProfileForm(curr)) {
            const formValue = props.initForm[curr]
            acc.push({
                label: t(
                    `user-profile-form.field-${curr === 'avatar' || curr === 'file' ? 'avatar' : curr}`,
                ),
                value:
                    curr === 'avatar'
                        ? !!(formValue as { url?: string })?.url
                        : !!formValue,
            })
        }
        return acc
    }, [])
})
</script>

<template>
    <div class="flex flex-wrap p-2">
        <div
            v-for="(item, i) in checkerFormData"
            :key="i"
            class="flex items-center"
            :style="{ flex: '0 0 50%', padding: '1px 2px' }">
            <i
                :class="[
                    'pi',
                    item.value ? 'pi-check-circle' : 'pi-circle-off',
                    item.value ? 'text-primary' : 'text-gray-300',
                    { 'icon-active': item.value },
                ]"
                style="font-size: 17px" />
            <span class="ml-2 text-opacity-70">{{ item.label }}</span>
        </div>
    </div>
</template>

<style scoped>
.icon-active {
    animation: scale-animation 0.3s ease;
}

@keyframes scale-animation {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0;
        transform: scale(0);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
