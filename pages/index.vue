<template>
  <v-container>
    <v-card outlined color="blue-grey darken-2">
      <v-toolbar color="blue-grey darken-2" dense dark>
        Options
      </v-toolbar>
      <!-- FILTER OPTIONS --> 
      <v-card fluid class="d-flex justify-center mb-2">
        <v-card dense flat class="pa-2">
          <v-row>
            <v-col cols="12" sm="6" class="d-flex">
              <v-select
                v-model="categorySelected"
                placeholder="Select Category"
                :items="getCategories"
                :items-per-page="10"
                outlined dense
                background-color="blue-grey darken-4"
                multiple
              >
                <template #selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (+{{ categorySelected.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex">
              <v-form>
                <v-btn class="px-10" color="primary" dark @click.prevent="callSearch">
                  Search
                </v-btn>
              </v-form>
              <!-- <v-text-field
                v-model="filterResults"
                label="Filter"
                outlined
                dense
              /> -->
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-card>
    <!-- DATA AND PAGINATION -->
    <v-card outlined color="blue-grey darken-2" class="mt-4">
      <v-data-table
        :headers="getHeaders"
        :items="getSlugs"
        :loading="loading"
        :search="search"
        :server-items-length="getSlugs.length"
        hide-default-footer
        outlined
      >
        <template #top>
          <v-toolbar color="blue-grey darken-2" dense dark>
            Data
          </v-toolbar>
        </template>

        <template #[`item.handle`]="{ item }">
          <a @click="selectItem(item)"><v-icon size="32px">mdi-eye</v-icon></a>
        </template>

        <!-- 
        <template v-slot:[`item.data.enabled`]="{ item }">
          <span :class="item.data.enabled===true ? 'colorGreen': 'colorRed'">
            {{ item.data.enabled === true ? 'Yes' : 'No' }}
          </span>
        </template>

        <template v-slot:[`item.data.maintained`]="{ item }">
          <v-switch
            v-model="item.data.maintained"
            :disabled="item.data.enabled === false"
            @change="updateTable(item.data.id, item.data.maintained)"
            style="margin: 0 30% 0 30%"
          />
        </template> -->
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="900">
      <slug-editor 
        :item="selectedItem"
        @cancel="closeDialog" @deleteItem="deleteItem"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SlugEditor from '@/components/SlugEditor'

const headers = []

export default ({
  components: { SlugEditor },
  data () {
    return {
      headers,
      title: 'Home',
      loading: true,
      categorySelected: [],
      filterResults: '',
      search: '',
      selectedItem: [],
      dialog: false
    }
  },
  computed: {
    ...mapGetters(['getHeaders', 'getCategories', 'getSlugs'])
  },
  created () {
    this.$nuxt.$emit('show-loading')
    this.$store.dispatch('fetchItems').then((response) => {
      this.loading = false
      this.$nuxt.$emit('hide-loading')
    }).catch((error) => {
      this.$nuxt.$emit('hide-loading')
      alert(error.response.data.message)
    })
  },
  methods: {
    ...mapActions(['fetchItems']),
    callSearch () {
      this.$nuxt.$emit('show-loading')
      const params = this.categorySelected.length > 0 ? this.categorySelected : null
      this.loading = true
      this.$store.commit('clearData')
      this.fetchItems(params).then((response) => {
        this.$nuxt.$emit('hide-loading')
        this.loading = false
      })
    },
    selectItem (item) {
      this.selectedItem = item
      this.dialog = true
    },
    deleteItem () {
      this.dialog = false
      this.callSearch()
    },
    closeDialog (savedSuccessfully) {
      this.dialog = false
      if (savedSuccessfully) {
        this.callSearch()
      }
    }
  }
})
</script>
