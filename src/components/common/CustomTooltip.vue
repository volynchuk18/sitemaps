<template lang="pug">
  span.tooltip
    slot
</template>

<script>
export default {
  name: 'CustomTooltip',
  props: ['text']
}
</script>

<style scoped lang="sass">
  @import "../../styles/variables.sass"

  .tooltip
    font-size: 14px
    position: fixed
    transform: translate(-50%, 100%)
    z-index: 999
    background: $color-limed-spruce
    color: #FAFAFA
    padding: 8px 10px
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.18)
    border-radius: 5px
    white-space: nowrap
    right: 0
</style>
