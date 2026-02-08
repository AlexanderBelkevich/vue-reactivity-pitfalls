export default {
  id: 'computed-mutation',
  short: {
    ru: 'sort() меняет источник',
    en: 'sort() mutates source',
  },
  text: {
    ru: {
      title: 'computed с мутирующей логикой',
      summary: 'Если в computed есть мутации, ты меняешь исходные данные.',
      plain: 'computed должен быть "чистым", а sort() меняет исходный массив.',
      steps: [
        'Сразу после открытия list уже отсортирован — computed его "потрогал".',
        'Нажми "Перемешать", чтобы обновить list.',
        'Смотри, как sorted меняет исходный list (mutates).',
      ],
      expected: 'Мутирующие методы в computed меняют исходные данные даже при чтении.',
      checklist: [
        'Используешь sort/reverse/splice внутри computed.',
        'Не создаешь копию массива перед сортировкой.',
      ],
      notes: [
        'sort, reverse, splice — мутирующие методы.',
        'Используй копию массива: [...list].sort()',
        'Чтение computed может менять list, если внутри есть мутации.',
      ],
    },
    en: {
      title: 'computed with mutations',
      summary: 'If computed mutates data, you change the source itself.',
      plain: 'computed should be pure, but sort() mutates the original array.',
      steps: [
        'Right after opening, list is already sorted — computed touched it.',
        'Click "Shuffle", then watch the list change.',
        'Notice sorted mutates the original list.',
      ],
      expected: 'Mutating methods inside computed change source data even on read.',
      checklist: [
        'Using sort/reverse/splice inside computed.',
        'Not copying arrays before sorting.',
      ],
      notes: [
        'sort, reverse, splice are mutating methods.',
        'Use a copy: [...list].sort()',
        'Reading computed can change list if it mutates inside.',
      ],
    },
  },
  ui: {
    ru: {
      addFour: 'Добавить 4',
      shuffle: 'Перемешать',
      logPush: 'list.push(4)',
      logReplace: 'list заменен',
      logList: 'list изменен: {{value}}',
    },
    en: {
      addFour: 'Add 4',
      shuffle: 'Shuffle',
      logPush: 'list.push(4)',
      logReplace: 'list replaced',
      logList: 'list changed: {{value}}',
    },
  },
  code: `
import { computed } from 'vue'

const list = reactive([3, 1, 2])
const sorted = computed(() => list.sort())
// sort mutates list in-place
`,
  terms: [
    {
      name: 'computed()',
      desc: {
        ru: 'Кэшируемое значение, пересчитывается при изменении зависимостей.',
        en: 'A cached value recomputed when dependencies change.',
      },
      link: 'https://vuejs.org/api/reactivity-core.html#computed',
    },
    {
      name: 'reactive()',
      desc: {
        ru: 'Делает объект реактивным (deep proxy).',
        en: 'Makes an object reactive (deep proxy).',
      },
      link: 'https://vuejs.org/api/reactivity-core.html#reactive',
    },
  ],
}
