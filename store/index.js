import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/api/'

// state
export const state = () => ({
  user: '',
  loggedIn: false,
  token: null,
  headers: [],
  slugs: [],
  categories: []
})

// getters
export const getters = {
  // Do getters here
  isAuthenticated: state => state.auth.loggedIn,
  loggedInUser: state => state.user,
  isLoggedIn: state => state.loggedIn,
  token: state => state.token,
  getHeaders: state => state.headers,
  getSlugs: state => state.slugs,
  getCategories: state => state.categories
}

// actions
export const actions = {
  // Do actions here
  fetchItems: async ({ state, commit }, filterparams) => {
    try {
      const response = await axios.get('items', { headers: { Authorization: `Bearer ${state.token}` } })
      const payload = {
        filters: filterparams,
        data: response.data
      }
      commit('fillItems', payload)
    } catch (error) {
      alert('Unable to fetch items. Please log out and login again.')
    }
  }
}

// mutations
export const mutations = {
  // Do mutations here
  clearData: (state) => { state.slugs = [] },
  loginSuccess: (state, data) => {
    state.loggedIn = true
    state.token = data.plainTextToken
  },
  fillItems: (state, payload) => {
    const data = payload.data
    const filter = payload.filters
    state.headers = [{
      text: '',
      sortable: false,
      align: 'center',
      value: 'handle',
      class: 'light-blue--text text--darken-3'
    }] // initial value
    state.slugs = []
    state.categories = []
    
    let fillHeadersOnce = false
    let index = 1
    data.forEach((item) => {
      if (!fillHeadersOnce) {
        fillHeadersOnce = true
        
        for (const [key] of Object.entries(item)) {
          if (key === 'avatar' || key === 'slug') {
            continue
          }
          const label = {
            text: key,
            sortable: false,
            align: 'center',
            value: key
          }
          state.headers.push(label)
        }
      }

      // Fill up categories
      const category = { text: item.category, value: item.category }
      state.categories.push(category)

      if (filter) {
        filter.forEach((category) => {
          if (category === item.category) {
            item[index] = index
            state.slugs.push(item)
            index++
          }
        })
      } else {
        item[index] = index
        state.slugs.push(item)
        index++
      }
    })
  }
}
