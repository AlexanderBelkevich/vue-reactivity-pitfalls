import { markRaw } from 'vue'
import meta from './meta.js'
import Component from './destructure-reactive.vue'

export default { ...meta, component: markRaw(Component) }
