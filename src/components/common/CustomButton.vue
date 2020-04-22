<template lang="pug">
  button(@click="$emit('click')").custom-button
    slot
</template>

<script>
export default {
  name: 'CustomButton'
}
</script>

<style scoped lang="sass">
  @import "../../styles/variables.sass"

  .custom-button
    padding: 5px 13px
    cursor: pointer
    color: $color-blue
    border: 1px solid $color-blue
    border-radius: 5px
    font-weight: 500
    font-size: 13px
    background: none
    &:hover
      background: $color-onahau

</style>
