// 全集语料懒加载：3165 篇 JSON 约 1.8MB，只在诗词编年页/全集详情需要时拉取，
// 避免被打进首屏主包。多次调用共享同一个 import promise。
let promise = null

export function loadCorpus() {
  if (!promise) promise = import('./poems-full.json')
  return promise
}
