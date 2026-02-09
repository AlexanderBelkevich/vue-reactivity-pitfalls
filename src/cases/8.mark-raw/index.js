import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './mark-raw.vue'

export default { ...meta, component: markRaw(Component) }
