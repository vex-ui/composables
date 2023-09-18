import type { Signal } from '@/types'
import { shallowRef, type Ref } from 'vue'
import { isFunction } from './helpers'

export function useSignal<T>(initial: T): Signal<T> {
  const r = shallowRef(initial)

  return toSignal(r)
}

export function toSignal<T>(v: Ref<T>): Signal<T> {
  return [
    function getter<U>(fn?: (v: T) => U): T | U {
      return isFunction(fn) ? fn(v.value) : v.value
    },
    function setter(fn: ((v: T) => T) | T): void {
      v.value = isFunction(fn) ? fn(v.value) : fn
    },
  ]
}
