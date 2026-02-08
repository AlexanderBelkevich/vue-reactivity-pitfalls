import destructureReactive from './destructure-reactive.js'
import toRefToRefs from './toref-torefs.js'
import watchNoDeep from './watch-no-deep.js'
import watchEffectCase from './watch-effect.js'
import computedMutation from './computed-mutation.js'
import refDestructure from './ref-destructure.js'
import shallowRefCase from './shallow-ref.js'
import markRawCase from './mark-raw.js'

export const cases = [
  destructureReactive,
  toRefToRefs,
  watchNoDeep,
  watchEffectCase,
  computedMutation,
  refDestructure,
  shallowRefCase,
  markRawCase,
]