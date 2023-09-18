import type { Getter } from '@/types'
import { getCurrentInstance, shallowRef, type Ref } from 'vue'
import { getKebabCase } from './helpers'
import { useVModel } from './v-model'

interface Options<T> {
  propName?: string
  setter?: (newValue: T) => T
}

export function useControllableState<T>(getter: Getter<T>, options: Options<T> = {}): Ref<T> {
  const { propName = 'modelValue', setter } = options
  const isControlled = hasVModelBound(propName)

  return isControlled
    ? useVModel(getter, { eventName: `update:${propName}`, setter })
    : shallowRef(getter())
}

function hasVModelBound(propName: string) {
  const vm = getCurrentInstance()
  const kebabPropName = getKebabCase(propName)

  return (
    (vm?.vnode.props?.hasOwnProperty(propName) || vm?.vnode.props?.hasOwnProperty(kebabPropName)) &&
    (vm.vnode.props?.hasOwnProperty(`onUpdate:${propName}`) ||
      vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabPropName}`))
  )
}
