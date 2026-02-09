import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './computed-mutation.vue'

export default { ...meta, component: markRaw(Component) }
