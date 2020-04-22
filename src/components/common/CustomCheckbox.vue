<template>
  <svg v-if="!value" @click="checkboxClickHandler" class="custom-checkbox" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" width="18" height="18">
    <path fill="#c2cfe0" d="M 16 2 V 16 H 2 V 2 H 16 Z M 16 0 H 2 C 0.9 0 0 0.9 0 2 V 16 C 0 17.1 0.9 18 2 18 H 16 C 17.1 18 18 17.1 18 16 V 2 C 18 0.9 17.1 0 16 0 Z" />
  </svg>
  <svg v-else @click="checkboxClickHandler" class="custom-checkbox" width="18" height="18" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.1111 0H1.88889C0.840556 0 0 0.85 0 1.88889V15.1111C0 16.15 0.840556 17 1.88889 17H15.1111C16.1594 17 17 16.15 17 15.1111V1.88889C17 0.85 16.1594 0 15.1111 0ZM6.61111 13.2222L1.88889 8.5L3.22056 7.16833L6.61111 10.5494L13.7794 3.38111L15.1111 4.72222L6.61111 13.2222Z" fill="#0288D1"/>
  </svg>
</template>

<script>
export default {
  name: 'CustomCheckbox',
  props: ['value'],
  methods: {
    checkboxClickHandler () {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped lang="sass">
  .custom-checkbox
    cursor: pointer
</style>
