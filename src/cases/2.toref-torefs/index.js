import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './toref-torefs.vue'

export default { ...meta, component: markRaw(Component) }
