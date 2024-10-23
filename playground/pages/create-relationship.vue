<script setup lang="ts">
import type { ProfileForm } from '../../src/runtime/models'

const dayjs = useDayjs()

const profileForm = ref()
const key = ref(0)
const visible = ref(false)

const refresh = () => {
    key.value = Date.now()
}

// Mock data để test các trường hợp khác nhau
const testCases = ref([
    {
        name: 'Create New Profile',
        data: {
            _id: '7698d7594350688df964a817',
            name: 'Johnny Ke',
            dob: '1990-01-01',
            email: 'john@example.com',
            gender: 'M',
            avatar: {
                _id: 'avatar-123',
                // url: 'https://picsum.photos/200/300',
            },
        },
    },
    {
        name: 'Update Existing Profile',
        data: {
            _id: '6698d7594350688df964a812',
            name: 'Kao Naomi',
            dob: '2021-05-18T17:00:00.000Z',
            gender: 'M',
            avatar: {
                _id: '6698d75928ac4d69ac53f861',
                url: 'https://storage.googleapis.com/emr-sandbox/6698d7594350688df964a812/pomelo-from-hoang-phat-fruit.jpg',
            },
        },
    },
    {
        name: 'Empty Profile',
        data: {},
    },
])

const currentTestCase = ref(testCases.value[0])

// Compute max date (16 years ago from today)
const maxDate = computed(() => {
    return dayjs().subtract(16, 'years').toDate()
})

// Handlers
const handleSubmitForm = (data: ProfileForm) => {
    console.log('Form submitted with data:', data)
}

const handleSubmitError = (error: any) => {
    console.error('Form submission error:', error)
}

const handleSubmitSuccess = (data: any) => {
    console.log('Form submission success:', data)
}

const testCreate = async () => {
    if (profileForm.value) {
        await profileForm.value.submitFormDataFn('create')
    }
}

const testUpdate = async () => {
    if (profileForm.value) {
        await profileForm.value.submitFormDataFn('update')
    }
}

const testDelete = async () => {
    if (profileForm.value) {
        await profileForm.value.submitFormDataFn('delete')
    }
}

const switchTestCase = (index: number) => {
    currentTestCase.value = testCases.value[index]
    refresh()
}
</script>

<template>
    <div class="p-6">
        <h1 class="mb-6 text-2xl font-bold">User Profile Form Test Page</h1>

        <!-- Test Case Selector -->
        <div class="mb-6">
            <h2 class="mb-3 text-lg font-semibold">Select Test Case:</h2>
            <div class="flex gap-3">
                <button
                    v-for="(test, index) in testCases"
                    :key="index"
                    class="rounded-md px-4 py-2"
                    :class="{
                        'bg-blue-500 text-white':
                            currentTestCase.name === test.name,
                        'bg-gray-200': currentTestCase.name !== test.name,
                    }"
                    @click="switchTestCase(index)">
                    {{ test.name }}
                </button>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mb-6 flex gap-3">
            <Button severity="success" @click="testCreate">
                Test Create
            </Button>
            <Button severity="danger" @click="testUpdate"> Test Update </Button>
            <Button severity="info" @click="testDelete"> Test Delete </Button>
        </div>

        <!-- Current Test Case Info -->
        <div class="mb-6 rounded-md bg-gray-900 p-4">
            <h3 class="mb-2 font-semibold">Current Test Case Data:</h3>
            <pre class="whitespace-pre-wrap">{{
                JSON.stringify(currentTestCase, null, 2)
            }}</pre>
        </div>

        <!-- Form Component -->
        <!-- <div class="rounded-lg border p-6">
            <WUserProfileFormContainer
                ref="profileForm"
                :key="key"
                :default-data="currentTestCase.data"
                :max-date="maxDate"
                is-require-avatar
                @on:submit-form="handleSubmitForm"
                @on:submit-error="handleSubmitError"
                @on:submit-success="handleSubmitSuccess" />
        </div> -->

        <!-- Debug Console -->
        <div class="mt-6 rounded-md bg-gray-900 p-4">
            <h3 class="mb-2 font-semibold">Debug Console:</h3>
            <p>Check browser console for detailed logs</p>
            <p v-if="profileForm?.loading" class="text-blue-500">
                Loading... Please wait
            </p>
        </div>

        <Button
            label="Show"
            icon="pi pi-external-link"
            @click="visible = true" />

        <Drawer v-model:visible="visible" header="Drawer" position="full">
            <WUserProfileFormContainer
                ref="profileForm"
                :key="key"
                :default-data="currentTestCase.data"
                :max-date="maxDate"
                is-require-avatar
                is-show-relationship
                @on:submit-form="handleSubmitForm"
                @on:submit-error="handleSubmitError"
                @on:submit-success="handleSubmitSuccess" />
        </Drawer>
    </div>
</template>
