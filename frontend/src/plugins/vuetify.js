/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// import DayJsAdapter from '@date-io/dayjs'
// import LuxonAdapter from "@date-io/luxon"

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // date: {
  //   adapter: DayJsAdapter,
  // },
  theme: {
    defaultTheme: 'light',
  },
})
