<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Relationship } from '../../../models'

// Props
const props = defineProps({
    initForm: {
        type: Object as PropType<Relationship>,
        default: () => ({}) as Relationship,
    },
})

// i18n
const { t } = useI18n()

// Computed data
const checkerFormData = computed(() => {
    return Object.keys(props.initForm).reduce(
        (acc, curr) => {
            acc.push({
                label: t(
                    `field ${curr === 'avatar' || curr === 'file' ? 'avatar' : curr}`,
                ),
                value:
                    curr === 'avatar'
                        ? !!props.initForm[curr]?.url
                        : !!props.initForm[curr],
            })
            return acc
        },
        [] as { label: string; value: boolean }[],
    )
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
                    item.value ? 'text-blue-500' : 'text-gray-300',
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
