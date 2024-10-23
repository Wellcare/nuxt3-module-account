<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto">
            <label for="buttondisplay" class="mb-2 block font-bold">
                Button
            </label>
            <DatePicker
                v-model="buttondisplay"
                show-icon
                fluid
                :show-on-focus="false"
                input-id="buttondisplay" />
        </div>
        <div class="flex-auto">
            <label for="icondisplay" class="mb-2 block font-bold">
                Default Icon
            </label>
            <DatePicker
                v-model="icondisplay"
                show-icon
                fluid
                icon-display="input"
                input-id="icondisplay" />
        </div>
        <div class="flex-auto">
            <label for="templatedisplay" class="mb-2 block font-bold">
                Custom Icon
            </label>
            <DatePicker
                v-model="templatedisplay"
                show-icon
                fluid
                icon-display="input"
                time-only
                input-id="templatedisplay">
                <template #inputicon="slotProps">
                    <i class="pi pi-clock" @click="slotProps.clickCallback" />
                </template>
            </DatePicker>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const buttondisplay = ref()
const icondisplay = ref()
const templatedisplay = ref()
</script>
