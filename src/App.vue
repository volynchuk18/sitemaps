<template>
  <div id="app">
    <SubmittedSitemaps />
  </div>
</template>

<script>
import SubmittedSitemaps from './components/SubmittedSitemaps'

export default {
  name: 'App',
  components: { SubmittedSitemaps }
}
</script>

<style lang="sass">
  #app
    max-width: 920px
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    margin: 100px auto
    font-size: 14px

  *
    box-sizing: border-box
    font-family: 'Roboto', sans-serif
</style>
