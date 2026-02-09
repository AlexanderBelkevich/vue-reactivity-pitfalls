import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './watch-no-deep.vue'

export default { ...meta, component: markRaw(Component) }
