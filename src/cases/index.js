import DestructureReactive from './DestructureReactive.vue'
import destructureReactiveMeta from './destructure-reactive.meta.js'
import ToRefToRefs from './ToRefToRefs.vue'
import torefTorefsMeta from './toref-torefs.meta.js'
import WatchNoDeep from './WatchNoDeep.vue'
import watchNoDeepMeta from './watch-no-deep.meta.js'
import WatchEffect from './WatchEffect.vue'
import watchEffectMeta from './watch-effect.meta.js'
import ComputedMutation from './ComputedMutation.vue'
import computedMutationMeta from './computed-mutation.meta.js'
import RefDestructure from './RefDestructure.vue'
import refDestructureMeta from './ref-destructure.meta.js'
import ShallowRef from './ShallowRef.vue'
import shallowRefMeta from './shallow-ref.meta.js'
import MarkRaw from './MarkRaw.vue'
import markRawMeta from './mark-raw.meta.js'

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
