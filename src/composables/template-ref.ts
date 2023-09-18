import type { ComponentPublicInstance } from 'vue'
import { useSignal } from '.'
import { getElementFromRef } from './helpers'
import type { ComputableGetter } from '@/types'

export type getTemplateRef = ComputableGetter<HTMLElement | null>
export type setTemplateRef = (vm: HTMLElement | ComponentPublicInstance | null) => void
export type TemplateRef = [getTemplateRef, setTemplateRef]

/**
 * normalizes getting and setting template refs for components and elements.
 *
 * @param component its used to log errors to the console
 */
export function useTemplateRef(component: string): TemplateRef {
  const [templateRef, setTemplateRef] = useSignal<HTMLElement | null>(null)

  const setter = (vm: HTMLElement | ComponentPublicInstance | null) =>
    setTemplateRef(getElementFromRef(vm, component))

  return [templateRef, setter]
}
