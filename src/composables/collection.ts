import type { Getter, TemplateRef } from '@/types'
import { computed, shallowReactive } from 'vue'

export type Item<T extends HTMLElement> = {
  id: string
  templateRef: TemplateRef<T>
  disabled?: Getter<boolean>
}

export class Collection<T extends HTMLElement = HTMLElement> {
  #id: string
  #count: number = 0
  #collection = shallowReactive<Map<TemplateRef<T>, Item<T>>>(new Map())

  items = computed(() => [...this.#collection.values()])
  elements = computed(() =>
    [...this.#collection.keys()].reduce<T[]>((arr, ref) => {
      const el = ref.value
      el != null && arr.push(el)
      return arr
    }, [])
  )

  constructor(id: string) {
    this.#id = id
  }

  private generateID(): string {
    return `${this.#id}-${this.#count++}`
  }

  add(templateRef: TemplateRef<T>, disabled?: Getter<boolean>): Item<T> {
    const id = this.generateID()
    const item = { id, templateRef, disabled }
    this.#collection.set(templateRef, item)
    return item
  }

  remove(templateRef: TemplateRef<T>): void {
    this.#collection.delete(templateRef)
  }
}

// FIXME: remove this
export const createCollection = () => {}
export const useCollection = () => {}
