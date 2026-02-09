import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './watch-effect.vue'

export default { ...meta, component: markRaw(Component) }
