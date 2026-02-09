import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './shallow-ref.vue'

export default { ...meta, component: markRaw(Component) }
