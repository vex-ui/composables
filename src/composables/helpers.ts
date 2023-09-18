import { EXPOSED_EL } from '@/config'
import type { NavigationKey, Orientation, KeyIntent } from '@/types'
import { useTextDirection } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 validators
//----------------------------------------------------------------------------------------------------

export const isClient = typeof window !== 'undefined'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isFunction = (value: unknown): value is Function => value instanceof Function
export const isArray = Array.isArray
export const isIOS = /*#__PURE__*/ getIsIOS()
export const dir = useTextDirection()
export const isNavigationKey = (v: string): v is NavigationKey =>
  ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(v)

//----------------------------------------------------------------------------------------------------
// 📌 getters
//----------------------------------------------------------------------------------------------------

export function getIsIOS() {
  return (
    isClient &&
    /*#__PURE__*/ window?.navigator?.userAgent &&
    /*#__PURE__*/ /iP(ad|hone|od)/.test(/*#__PURE__*/ window.navigator.userAgent)
  )
}

export function getRandomString(length: number): string {
  let result = ''
  while (result.length < length) {
    const randomSubstring = Math.random().toString(36).substring(2)
    result += randomSubstring.slice(0, length - result.length)
  }
  return result
}

export function getElementFromRef(
  vm: ComponentPublicInstance | Element | null,
  component: string
): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (EXPOSED_EL in vm && vm[EXPOSED_EL] instanceof Element) return vm[EXPOSED_EL] as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <${component}> has a non Element root child`)
}

export function getDirectionAwareKey(key: NavigationKey) {
  if (dir.value !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

export function getKeyIntent(key: NavigationKey, orientation: Orientation = 'vertical'): KeyIntent {
  switch (getDirectionAwareKey(key)) {
    case 'ArrowDown':
      if (orientation === 'vertical') return 'next'
      return 'show'

    case 'ArrowUp':
      if (orientation === 'vertical') return 'prev'
      return 'hide'

    case 'ArrowRight':
      if (orientation === 'vertical') return 'show'
      return 'next'

    case 'ArrowLeft':
      if (orientation === 'vertical') return 'hide'
      return 'prev'

    case 'End':
      return 'last'

    case 'Home':
      return 'first'
  }
}

export function getKebabCase(str = '') {
  if (getKebabCase.cache.has(str)) return getKebabCase.cache.get(str)!
  const kebab = str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
  getKebabCase.cache.set(str, kebab)
  return kebab
}
getKebabCase.cache = new Map<string, string>()

//----------------------------------------------------------------------------------------------------
// 📌 specials
//----------------------------------------------------------------------------------------------------

export const noop = () => {}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
export function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}

/**
 * removes an item from an array if it exists.
 * mutates the original array.
 */
export function remove<T>(array: T[], item: T) {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  }
}
