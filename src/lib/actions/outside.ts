export function clickOutside(node: Element, callback: Function) {

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target && node && !node.contains(target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('clickOutside', event)
      )
    }
  }

  const listenerOutSideEvent = () => {
    if (callback) {
      callback()
    }
  }

  document.addEventListener('click', handleClick, true);
  node.addEventListener('clickOutside', listenerOutSideEvent);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
      node.removeEventListener('clickOutside', listenerOutSideEvent);
    }
  }
}