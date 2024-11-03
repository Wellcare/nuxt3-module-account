<script setup lang="ts">
import { computed, ref, useI18n, useVModel } from '#imports'
import DatePicker from 'primevue/datepicker'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { ProfileForm } from '../../../models'

interface RelationshipOption {
    text: string
    value: string
}

interface Props {
    initForm: ProfileForm
    isReadOnly?: boolean
    loading?: boolean
    isShowRelationship?: boolean
    dobPicker?: 'date' | 'year'
    relationships?: RelationshipOption[]
    minDate?: Date
    maxDate?: Date
}

// Use withDefaults for props
const props = withDefaults(defineProps<Props>(), {
    initForm: () => ({}),
    isReadOnly: false,
    loading: false,
    isShowRelationship: false,
    showBodyIndex: false,
    dobPicker: 'date',
    relationships: () => [],
    minDate: undefined,
    maxDate: undefined,
})

const emit = defineEmits(['update:init-form'])

const { t } = useI18n()
const form = useVModel(props, 'initForm', emit)

// Format date helper function
const formatDate = (date: Date | string | null): string => {
    if (!date) return ''
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return ''

    if (props.dobPicker === 'year') {
        return d.getFullYear().toString()
    }

    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear().toString()
    return `${day}/${month}/${year}`
}

// Parse date string helper function
const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null

    if (props.dobPicker === 'year') {
        return new Date(Number.parseInt(dateStr), 0, 1)
    }

    const [day, month, year] = dateStr.split('/')
    if (!day || !month || !year) return null

    // Assume 20xx for 2-digit years less than 50, 19xx for years 50 and above
    let fullYear = Number.parseInt(year)
    if (fullYear < 100) {
        fullYear += fullYear < 50 ? 2000 : 1900
    }

    const date = new Date(
        fullYear,
        Number.parseInt(month) - 1,
        Number.parseInt(day),
    )
    return Number.isNaN(date.getTime()) ? null : date
}

// Form validation schema
const schema = yup.object({
    name: yup
        .string()
        .required(t('common.required'))
        .test(
            'fullName',
            t('user-profile-form.please-enter-fullname'),
            (value) => {
                return Boolean(value?.trim()?.split(/\s+/)?.length >= 2)
            },
        ),
    dob: yup
        .string()
        .required(t('common.required'))
        .test(
            'dateFormat',
            t('user-profile-form.invalid-date-format'),
            (value) => {
                if (!value) return true
                if (props.dobPicker === 'year') {
                    return /^\d{4}$/.test(value)
                }
                return /^\d{2}\/\d{2}\/\d{4}$/.test(value)
            },
        )
        .test('dateRange', t('date must be within allowed range'), (value) => {
            if (!value) return true
            const date = parseDate(value)
            if (!date) return false

            if (props.minDate && date < props.minDate) return false
            if (props.maxDate && date > props.maxDate) return false

            return true
        }),
    gender: yup.string().required(t('common.required')),
    relationship: props.isShowRelationship
        ? yup.string().required(t('common.required'))
        : yup.string(),
})

const {
    errors,
    defineField,
    validate: validateForm,
    setFieldValue,
} = useForm({
    validationSchema: schema,
    initialValues: {
        ...props.initForm,
        dob: props.initForm.dob ? formatDate(props.initForm.dob) : '',
    },
})

const [nameField, nameAttrs] = defineField('name')
const [dobField, dobAttrs] = defineField('dob')
const [genderField, genderAttrs] = defineField('gender')
const [relationshipField, relationshipAttrs] = defineField('relationship')

const genderOptions = ref([
    { text: t('user-profile-form.male'), value: 'M' },
    { text: t('user-profile-form.female'), value: 'F' },
])

const relationshipOptions = computed(() =>
    props.relationships.length
        ? props.relationships
        : [
              { text: t('user-profile-form.child'), value: 'child' },
              { text: t('user-profile-form.parent'), value: 'parent' },
              { text: t('user-profile-form.sibling'), value: 'sibling' },
              { text: t('user-profile-form.spouse'), value: 'spouse' },
          ],
)

const getDobLabel = computed(() => {
    const timeUnit = props.dobPicker === 'date' ? 'date' : 'year'
    return `${timeUnit}-of-birth`
})

const updateForm = async (field: keyof ProfileForm, value: any) => {
    if (field === 'dob' && value) {
        // Format the date before updating
        const formattedDate = formatDate(value)
        form.value[field] = formattedDate
        setFieldValue(field, formattedDate)
        emit('update:init-form', {
            ...form.value,
            dob: formattedDate,
        })
    } else {
        form.value[field] = value
        setFieldValue(field, value)
        emit('update:init-form', form.value)
    }
}

// Improved validation function
const validate = async (): Promise<boolean> => {
    const result = await validateForm()
    return result.valid
}

defineExpose({
    validate,
})
</script>

<template>
    <form class="space-y-4" @submit.prevent>
        <!-- Full Name -->
        <div class="space-y-2">
            <label class="block font-bold">
                {{ t('user-profile-form.fullname')
                }}<span class="text-red-500">*</span>
            </label>
            <InputText
                v-model="nameField"
                :class="['w-full rounded-lg', errors.name ? 'p-invalid' : '']"
                :placeholder="t('user-profile-form.enter-full-name')"
                :readonly="isReadOnly"
                v-bind="nameAttrs"
                @update:model-value="(v) => updateForm('name', v)" />
            <small v-if="errors.name" class="text-red-500">{{
                errors.name
            }}</small>
        </div>

        <!-- Date of Birth -->
        <div class="space-y-2">
            <label class="block font-bold">
                {{ t(`user-profile-form.${getDobLabel}`)
                }}<span class="text-red-500">*</span>
            </label>
            <div class="relative">
                <DatePicker
                    v-model="dobField"
                    v-bind="dobAttrs"
                    show-icon
                    fluid
                    :readonly="isReadOnly"
                    :view="dobPicker"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :placeholder="
                        t(`user-profile-form.enter-${dobPicker}-of-birth`)
                    "
                    :date-format="dobPicker === 'date' ? 'dd/mm/yy' : 'yy'"
                    @update:model-value="(v) => updateForm('dob', v)" />
            </div>
            <small v-if="errors.dob" class="text-red-500">{{
                errors.dob
            }}</small>
        </div>

        <!-- Gender -->
        <div class="space-y-2">
            <label class="block font-bold">
                {{ t('user-profile-form.gender')
                }}<span class="text-red-500">*</span>
            </label>
            <Dropdown
                v-model="genderField"
                v-bind="genderAttrs"
                :options="genderOptions"
                option-label="text"
                option-value="value"
                :class="['w-full', errors.gender ? 'p-invalid' : '']"
                :placeholder="t('user-profile-form.select-gender')"
                :readonly="isReadOnly"
                @update:model-value="(v) => updateForm('gender', v)" />
            <small v-if="errors.gender" class="text-red-500">{{
                errors.gender
            }}</small>
        </div>

        <!-- Relationship -->
        <div v-if="isShowRelationship" class="space-y-2">
            <label class="block font-bold">
                {{ t('user-profile-form.relationship')
                }}<span class="text-red-500">*</span>
            </label>
            <Dropdown
                v-model="relationshipField"
                v-bind="relationshipAttrs"
                :options="relationshipOptions"
                option-label="text"
                option-value="value"
                :class="['w-full', errors.relationship ? 'p-invalid' : '']"
                :placeholder="t('user-profile-form.Select relationship')"
                :readonly="isReadOnly"
                @update:model-value="(v) => updateForm('relationship', v)" />
            <small v-if="errors.relationship" class="text-red-500">{{
                errors.relationship
            }}</small>
        </div>
    </form>
</template>
