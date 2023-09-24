import { computed, getCurrentInstance, type Ref } from 'vue'
import type { Getter } from '@/types'

interface Options<T> {
  setter?: (newValue: T) => T
  eventName?: string
}

export function useVModel<T>(getter: Getter<T>, options: Options<T> = {}): Ref<T> {
  const { eventName = 'update:modelValue', setter } = options
  const vm = getCurrentInstance()

  const emit = vm?.emit || (vm as any)?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)

  if (!emit) {
    throw new Error('[vex] `useVModel` Cannot find emit function on component instance.')
  }

  return computed<T>({
    get: getter,
    set: (newValue) => emit(eventName, setter ? setter(newValue) : newValue),
  })
}
