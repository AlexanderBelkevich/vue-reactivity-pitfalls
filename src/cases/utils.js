export const makeView = (items) =>
  items.map((item) => ({ label: item.label, get: item.get }))
