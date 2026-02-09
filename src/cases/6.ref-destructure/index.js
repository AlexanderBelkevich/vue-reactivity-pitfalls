import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './ref-destructure.vue'

export default { ...meta, component: markRaw(Component) }
