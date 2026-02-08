import DestructureReactive from './destructure-reactive/destructure-reactive.vue'
import destructureReactiveMeta from './destructure-reactive/meta.js'
import ToRefToRefs from './toref-torefs/toref-torefs.vue'
import torefTorefsMeta from './toref-torefs/meta.js'
import WatchNoDeep from './watch-no-deep/watch-no-deep.vue'
import watchNoDeepMeta from './watch-no-deep/meta.js'
import WatchEffect from './watch-effect/watch-effect.vue'
import watchEffectMeta from './watch-effect/meta.js'
import ComputedMutation from './computed-mutation/computed-mutation.vue'
import computedMutationMeta from './computed-mutation/meta.js'
import RefDestructure from './ref-destructure/ref-destructure.vue'
import refDestructureMeta from './ref-destructure/meta.js'
import ShallowRef from './shallow-ref/shallow-ref.vue'
import shallowRefMeta from './shallow-ref/meta.js'
import MarkRaw from './mark-raw/mark-raw.vue'
import markRawMeta from './mark-raw/meta.js'

export const cases = [
  { ...destructureReactiveMeta, component: DestructureReactive },
  { ...torefTorefsMeta, component: ToRefToRefs },
  { ...watchNoDeepMeta, component: WatchNoDeep },
  { ...watchEffectMeta, component: WatchEffect },
  { ...computedMutationMeta, component: ComputedMutation },
  { ...refDestructureMeta, component: RefDestructure },
  { ...shallowRefMeta, component: ShallowRef },
  { ...markRawMeta, component: MarkRaw },
]
