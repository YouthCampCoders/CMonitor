import { EventCallBack } from '../types'

/**
 * 首次隐藏时间
 */
let firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity

/**
 * pagehide / hidden 监听
 * */
export const onHidden = (callback: EventCallBack, once?: boolean) => {
  const handleOnHidden = (event: Event) => {
    if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
      callback(event)
      if (once) {
        removeEventListener('visibilitychange', handleOnHidden, true)
        removeEventListener('pagehide', handleOnHidden, true)
      }
    }
  }

  addEventListener('visibilitychange', handleOnHidden, true)
  addEventListener('pagehide', handleOnHidden, true)
}

/**
 * 获取首次隐藏时间
 */
export const getFirstHiddenTime = () => {
  onHidden((e: Event) => {
    firstHiddenTime = Math.min(firstHiddenTime, e.timeStamp)
  }, true)

  return {
    get now() {
      return firstHiddenTime
    }
  }
}

/**
 * pageshow 监听
 */
export const onShow = (callback: EventCallBack, once = true) => {
  addEventListener('pageshow', callback, { once, capture: true })
}
