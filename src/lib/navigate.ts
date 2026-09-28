export function navigate(path: string) {
  const url = path.startsWith('/') ? path : `/${path}`
  if (`${window.location.pathname}${window.location.search}` === url) {
    window.dispatchEvent(new PopStateEvent('popstate'))
    return
  }
  history.pushState({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}
