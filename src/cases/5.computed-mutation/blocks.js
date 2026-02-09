import { toValue } from 'vue'
import CaseActions from '../../components/case-detail/case-actions.vue'
import CaseState from '../../components/case-detail/case-state.vue'

/**
 * Только интерактивные блоки. code, steps, notes, terms — в самом MD (## Код, ## Как тестировать и т.д.).
 */
export default {
  actions: {
    component: CaseActions,
    getProps: (ctx) => ({
      title: toValue(ctx.t)('case.actionsTitle'),
      actions: toValue(ctx.actions) ?? [],
    }),
  },
  state: {
    component: CaseState,
    getProps: (ctx) => ({
      title: toValue(ctx.t)('case.stateTitle'),
      viewItems: toValue(ctx.view) ?? [],
      arrayTotalLabel: toValue(ctx.t)('common.arrayTotal'),
    }),
  },
}
