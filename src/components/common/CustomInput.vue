<template lang="pug">
  .custom-input-container(
    v-on-clickaway="closeModalHandler"
    :class="{'active': dropdownStatus}"
  )
    input.custom-input(
      :placeholder="placeholder"
      @submit="$emit('submit')"
      @input="handleInput"
      :value="value"
      :disabled="disabled"
    )
    .arrow-container(v-if="arrow" @click="$emit('click')")
      IconArrow(:active="dropdownStatus")
    div.drop-down
      slot(name="dropdown")
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import IconArrow from '../icons/IconArrow'

export default {
  name: 'CustomInput',
  components: { IconArrow },
  mixins: [clickaway],
  props: ['placeholder', 'value', 'disabled', 'dropdownStatus', 'arrow'],
  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value)
    },
    closeModalHandler () {
      this.$emit('close-dropdown')
    }
  }
}
</script>

<style scoped lang="sass">
  @import "../../styles/variables.sass"
  .custom-input-container
    position: relative

  .custom-input
    border-radius: 5px
    padding: 7px 0 7px 10px
    border: 1px solid $color-botticelli
    color: $color-pickled-bluewood
    cursor: pointer
    outline: unset
    &::placeholder
      color: $color-casper
    &:disabled
      color: currentColor
      cursor: pointer
      background-color: white
  .active
    input
      border: 1px solid $color-blue
    .arrow-container
      border-left: 1px solid $color-blue

  .drop-down
    position: absolute
    z-index: 999
    top: calc(100% + 1px)

  .arrow-container
    cursor: pointer
    width: 30px
    height: 100%
    position: absolute
    border-left: 1px solid $color-botticelli
    top: 0
    right: 0
    display: flex
    justify-content: center
    align-items: center
</style>
