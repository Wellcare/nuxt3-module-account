<script setup lang="ts">
const user = ref({
    // name: 'John Doe',
    // dob: '2000-01-01',
    // avatar: {
    //     url: 'https://picsum.photos/200/300',
    // },
    // gender: 'M',
    // relationship: 'child',
})

const onSubmit = (data: any) => {
    console.log(data)
}
</script>

<template>
    <WUserProfileFormView
        show-relationship
        is-require-avatar
        :default-data="user"
        is-hidden-submit
        @on:submit="onSubmit" />
</template>
