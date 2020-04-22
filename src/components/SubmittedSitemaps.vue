<template lang="pug">
  .sitemaps-container
    .sitemaps-header
      .sitemaps-title Submitted sitemaps
        InfoCircle
      .sitemaps-header-info
        .sitemaps-header-selected-sitemaps(v-if="selectedSitemaps")
          | Selected sitemaps:
          span(style="font-weight: bold")  {{ selectedSitemaps }}
        .sitemaps-header-actions(:class="{'sitemaps-header-actions-inactive': !selectedSitemaps}")
          span(:class="{'pointer': selectedSitemaps}").header-recrawl-sitemap Recrawl sitemap
          span(:class="{'pointer': selectedSitemaps}" @click="removeSelectedSitemaps").header-remove-sitemap Remove sitemap
    .sitemaps-filters
      .sitemaps-filters-title Filters:
      .sitemaps-filters-inputs
        CustomInput(
          v-model="urlFilterValue"
          @click.native="showUrlFilterDropdown = true"
          placeholder="URL or its part"
          @close-dropdown="showUrlFilterDropdown = false"
          :dropdownStatus="showUrlFilterDropdown"
        )
          template(v-slot:dropdown)
            .url-filter-dropdown(v-if="showUrlFilterDropdown")
              .url-filter-dropdown-actions
                div(@click="urlFilterSelectHandler('contain')")
                  SelectCircle(v-model="urlFilters.contain")
                  | Sitemap contains
                div(@click="urlFilterSelectHandler('doesntContain')")
                  SelectCircle(v-model="urlFilters.doesntContain")
                  | Sitemap doesn't contain
                div(@click="urlFilterSelectHandler('exact')")
                  SelectCircle(v-model="urlFilters.exact")
                  | Exact match
              .url-filter-dropdown-buttons
                .error.pointer(@click.stop="resetUrlFilters") Reset
                .action.pointer(@click.stop="applyUrlFilters") Apply
        CustomInput(placeholder="All types" arrow="true")
        CustomInput(placeholder="Submitted" arrow="true")
        CustomInput(placeholder="Date" arrow="true")
        CustomInput(
          v-model="statusFilterValue"
          placeholder="All sitemaps"
          @click.native="showStatusFilterDropdown = !showStatusFilterDropdown"
          @close-dropdown="closeStatusFilterDropdownHandler"
          disabled
          arrow="true"
          :dropdownStatus="showStatusFilterDropdown"
        )
          template(v-slot:dropdown)
            .status-filter-dropdown(v-if="showStatusFilterDropdown")
              .status-filter-dropdown-actions
                div(@click.stop="statusFilterSelectHandler('Success')") Success
                div(@click.stop="statusFilterSelectHandler(`Couldn't fetch`)") Couldn't fetch
                div(@click.stop="statusFilterSelectHandler('Errors')") Errors
    .sitemaps-table
      .sitemaps-table-header
        CustomCheckbox(v-model="allChecked")
        div Sitemap {{ sitemaps && `(${filteredSitemaps.length})` }}
        div Type
        div Submitted
        div Last check
        div Status
        div URLs
        div Recrawl sitemap
        div Remove sitemap
      .sitemaps-table-item(v-for="(item, index) in filteredSitemaps" :class="{'row-active': item.checked}")
        CustomCheckbox(v-model="item.checked")
        div /sitemap.xml
        div Sitemap index
        div {{ item.lastSubmitted | moment("MMM D, YYYY") }}
        div {{ item.lastCheck | moment("MMM D, YYYY") }}
        div(v-html="getStatusText(item.errors)")
        div {{ item.urls }}
        div
          CustomButton(@click="clickHandler") Recrewl
        div
          IconBasket(@click="deleteSitemap(index)")
            CustomTooltip Remove from Search Console
</template>

<script>
import InfoCircle from './icons/InfoCircle'
import axios from 'axios'
import IconBasket from './icons/IconBasket'
import CustomButton from './common/CustomButton'
import CustomInput from './common/CustomInput'
import CustomCheckbox from './common/CustomCheckbox'
import Vue from 'vue'
import SelectCircle from './common/SelectCircle'
import IconArrow from './icons/IconArrow'
import CustomTooltip from './common/CustomTooltip'

export default {
  name: 'SubmittedSitemaps',
  components: { CustomTooltip, IconArrow, SelectCircle, CustomCheckbox, CustomInput, CustomButton, IconBasket, InfoCircle },
  data () {
    return {
      urlFilterValue: null,
      statusFilterValue: null,
      testData: null,
      allChecked: false,
      showUrlFilterDropdown: false,
      showStatusFilterDropdown: false,
      urlFilterType: null,
      filteredSitemaps: null,
      urlFilters: {
        contain: false,
        doesntContain: false,
        exact: false
      }
    }
  },
  watch: {
    allChecked: {
      handler (to) {
        // eslint-disable-next-line no-unused-expressions
        this.testData?.result.sitemap.forEach(sitemap => {
          sitemap.checked = to
        })
      }
    }
  },
  mounted () {
    axios.get('api/dev/api/v1/example/test/')
      .then(res => {
        this.testData = res.data
        this.testData.result.sitemap.forEach(sitemap => Vue.set(sitemap, 'checked', false))
        this.filteredSitemaps = this.testData.result.sitemap
      })
      .catch(err => {
        throw err
      })
  },
  computed: {
    sitemaps: {
      get () {
        return this.testData?.result.sitemap
      },
      set (value) {
        this.testData.result.sitemap = value
      }
    },
    selectedSitemaps () {
      return this.sitemaps?.filter(sitemap => sitemap.checked).length || 0
    }
  },
  methods: {
    urlFilterSelectHandler (filter) {
      this.urlFilterType = filter
      Object.keys(this.urlFilters).forEach(key => {
        this.urlFilters[key] = key === filter
      })
    },
    statusFilterSelectHandler (filter) {
      this.statusFilterValue = filter
      this.showStatusFilterDropdown = false
      switch (this.statusFilterValue) {
        case 'Success':
          this.filteredSitemaps = this.sitemaps?.filter(sitemap => {
            if (sitemap.errors === 0) {
              return true
            } else {
              sitemap.checked = false
              return false
            }
          })
          break
        case 'Errors':
          this.filteredSitemaps = this.sitemaps?.filter(sitemap => {
            if (sitemap.errors !== 0) {
              return true
            } else {
              sitemap.checked = false
              return false
            }
          })
          break
        case 'Couldn\'t fetch':
          this.filteredSitemaps = this.sitemaps
          break
        default:
          return this.sitemaps
      }
    },
    closeStatusFilterDropdownHandler () {
      this.statusFilterValue = null
      this.filteredSitemaps = this.sitemaps
      this.showStatusFilterDropdown = false
    },
    resetUrlFilters () {
      this.urlFilterValue = null
      this.urlFilterType = null
      this.filteredSitemaps = this.sitemaps
      Object.keys(this.urlFilters).forEach(key => {
        this.urlFilters[key] = false
      })
      this.showUrlFilterDropdown = false
    },
    applyUrlFilters () {
      this.showUrlFilterDropdown = false
      if (!this.urlFilterValue || this.urlFilterValue.length < 4) {
        return
      }
      switch (this.urlFilterType) {
        case 'contain':
          this.filteredSitemaps = this.sitemaps?.filter(sitemap => {
            if (sitemap.path.indexOf(this.urlFilterValue) !== -1) {
              return true
            } else {
              sitemap.checked = false
              return false
            }
          })
          break
        case 'doesntContain':
          this.filteredSitemaps = this.sitemaps?.filter(sitemap => {
            if (sitemap.path.indexOf(this.urlFilterValue) === -1) {
              return true
            } else {
              sitemap.checked = false
              return false
            }
          })
          break
        case 'exact':
          this.filteredSitemaps = this.sitemaps?.filter(sitemap => {
            if (sitemap.path === this.urlFilterValue) {
              return true
            } else {
              sitemap.checked = false
              return false
            }
          })
          break
        default:
          return this.sitemaps
      }
    },
    getStatusText (errors) {
      return errors === 0
        ? '<span class="success">Success</span>'
        : `<span class="error">${errors} error${errors !== 1 ? 's' : ''}</span>`
    },
    clickHandler () {
      console.log(1)
    },
    deleteSitemap (index) {
      this.sitemaps.splice(index, 1)
      this.filteredSitemaps = this.sitemaps
    },
    removeSelectedSitemaps () {
      if (!this.sitemaps) {
        return
      }
      this.sitemaps = this.sitemaps?.filter(sitemap => !sitemap.checked)
      this.filteredSitemaps = this.sitemaps
    }
  }
}
</script>

<style scoped lang="sass">
  @import '../styles/variables.sass'
  @import '../styles/classes.sass'

  .sitemaps-container
    min-width: 825px
    min-height: 400px
    border: 1px solid $color-botticelli
    border-radius: 5px
    max-height: 1000px
    overflow: auto

  .sitemaps-header
    display: flex
    align-items: center
    padding: 22px 24px

  .sitemaps-header-info
    display: flex
    margin-left: auto

  .sitemaps-header-actions
    & > *
      &:first-child
        margin: 0 30px

  .header-recrawl-sitemap
    color: $color-blue
  .header-remove-sitemap
    color: $color-red

  .sitemaps-header-actions-inactive
    & > *
      color: $color-botticelli

  .sitemaps-title
    display: grid
    grid-gap: 9px
    grid-template-columns: auto auto
    font-size: 20px
    font-weight: bold

  .sitemaps-filters
    overflow: auto
    background: $color-catskill-white
    padding: 11px 21px

  .sitemaps-table
    max-height: 600px
    overflow: auto
    > *
      position: relative
      display: grid
      grid-template-columns: 18px repeat(8, calc(12.5% - 2px))
      padding: 16px 25px
      > *
        margin: 0 10px
        &:first-child
          margin: auto
        display: flex
        align-items: center
        justify-content: center
      &::after
        content: ""
        position: absolute
        bottom: 0
        height: 1px
        background: $color-white-lilac
        width: 100%
    &-header
      color: $color-pickled-bluewood
      font-weight: bold
      font-size: 14px
      background: $color-selago
      position: sticky
      top: 0
      z-index: 1

  .sitemaps-filters-title
    color: $color-limed-spruce
    text-align: left
    font-weight: 500
    font-size: 14px
    margin-bottom: 5px

  .sitemaps-filters-inputs
    display: flex
    justify-content: space-between

  .row-active
    background: $color-solitude

  .url-filter-dropdown
    background: white
    border: 1px solid $color-pigeon-post
    box-shadow: 0 2px 8px rgba(162, 164, 169, 0.46)
    border-radius: 5px
    width: 275px

  .url-filter-dropdown-actions
    color: $color-limed-spruce
    display: flex
    flex-direction: column
    padding: 18px 23px
    position: relative
    > *
      display: flex
      align-items: center
      cursor: pointer
      &:not(:last-child)
        margin-bottom: 24px
      > *
        &:first-child
          margin-right: 23px
    &::after
      content: ""
      position: absolute
      bottom: 0
      left: 5px
      height: 1px
      background: $color-white-lilac
      width: calc(100% - 10px)

  .url-filter-dropdown-buttons
    display: flex
    justify-content: space-between
    padding: 12px 18px

  .status-filter-dropdown
    width: 183px
    background: white
    border: 1px solid $color-botticelli
    box-shadow: 0 4px 8px rgba(199, 203, 210, 0.6)
    border-radius: 5px

  .status-filter-dropdown-actions
    > *
      text-align: left
      display: flex
      flex-direction: column
      padding: 9px 18px
      cursor: pointer
      &:hover
        background: $color-link-water

</style>
