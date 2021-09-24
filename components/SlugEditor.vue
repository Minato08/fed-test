<template>
  <v-container>
    <v-card class="pb-2">
      <v-card-title>
        <div class="flex-row">
          <v-btn id="btnSave" @click="swapMode">
            <v-icon>mdi-floppy</v-icon>
            <span>{{ editMode ? 'Save' : 'Edit' }}</span>
          </v-btn>
          <v-btn id="btnDel" @click="deleteMode">
            <v-icon>{{ editMode ? 'mdi-cancel' : 'mdi-delete-empty' }}</v-icon>
            <span>{{ editMode ? 'Cancel' : 'Delete' }}</span>
          </v-btn>
          <v-btn id="btnClose" class="align-self-end" @click="closeWindow">
            <v-icon class="close">mdi-window-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <!-- ITEM DISPLAY -->
      <v-card flat>
        <v-card flat class="ml-4">
          <v-row lg="2" class="mb-2" no-gutters>
            <v-col class="mr-4">
              <v-card outlined class="d-flex">
                <v-img
                  :src="`${$axios.defaults.baseURL}/${itemData.avatar}`"
                />
              </v-card>
            </v-col>
            <v-col lg="8">
              <v-card flat>
                <v-row class="d-flex">
                  <v-col cols="6" md="5"><v-text-field v-model="itemData.name" label="Name" dense filled /></v-col>
                  <v-col cols="6" md="5"><v-text-field v-model="itemData.category" label="Category" dense filled /></v-col>
                </v-row>
                <v-row class="d-flex">
                  <v-col cols="6" md="5"><v-text-field v-model="itemData.license" label="License" dense filled /></v-col>
                  <v-col cols="4" md="2"><v-text-field v-model="itemData.vertices" label="Vertices" dense filled /></v-col>
                  <v-col cols="4" md="3"><v-text-field v-model="itemData.downloads" label="Downloads" dense filled /></v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="mx-4" dense>
          <v-card flat>
            <v-subheader>Description</v-subheader>
            <v-text-field
              v-model="itemData.description" 
              style="border: none;"
              dense no-resize flat
              class="mx-4"
            />
          </v-card>
        </v-card>
      </v-card>
    </v-card>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm deletion?</v-card-title>
        <v-card-text>
            Are you sure you want to delete this Item?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1"
            text
            @click="deleteData()"
          >
            Confirm
          </v-btn>
          <v-btn color="red darken-1"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading-overlay v-if="processing" />
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import LoadingOverlay from './LoadingOverlay.vue'

function defaultItemModel () {
  return {
    slug: '',
    avatar: '',
    category: '',
    description: '',
    downloads: 0,
    license: '',
    name: '',
    vertices: 0
  }
}

export default {
  name: 'SlugEditor',
  components: { LoadingOverlay },
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      itemData: defaultItemModel(),
      editMode: false,
      savedSuccessfully: false,
      processing: false,
      deleteDialog: false
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {
    item: {
      deep: true,
      handler (val) {
        Object.assign(this.itemData, val)
      }
    }
  },
  methods: {
    swapMode () {
      // this.$emit('save')
      if (this.editMode) {
        // saving
        this.saveData()
      }
      this.editMode = !this.editMode
    },
    async saveData () {
      try {
        this.processing = true
        await axios.patch(`${axios.defaults.baseURL}items/${this.itemData.slug}`, this.itemData, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.savedSuccessfully = true
        this.processing = false
      } catch (error) {
        alert('an error occured while saving')
        this.processing = false
      }
    },
    async deleteData () {
      this.deleteDialog = false
      try {
        this.processing = true
        await axios.delete(`${axios.defaults.baseURL}items/${this.itemData.slug}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.$emit('deleteItem')
        this.processing = false
      } catch (error) {
        alert('an error occured while deleting')
        this.processing = false
      }
    },
    deleteMode () {
      if (this.editMode) {
        this.editMode = false
      } else {
        this.deleteDialog = true
      }
    },
    closeWindow () {
      this.$emit('cancel', this.savedSuccessfully)
      this.editMode = false
      this.savedSuccessfully = false
      this.processing = false
      this.itemData = defaultItemModel()
    }
  }
}
</script>
