import type { Ref } from 'vue'

export type Fn = () => void

// reactivity types
export type Getter<T> = () => T
export type Setter<T> = (value: T) => void
export type MaybeRef<T> = Ref<T> | T
export type MaybeGetter<T> = Getter<T> | T
export type RefOrGetter<T> = Ref<T> | Getter<T>
export type MaybeRefOrGetter<T> = RefOrGetter<T> | T

// utils
export type Orientation = 'vertical' | 'horizontal'
export type NavigationKey = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End'
export type KeyIntent = 'next' | 'prev' | 'last' | 'first' | 'show' | 'hide'
export type TemplateRef<T extends HTMLElement = HTMLElement> = Ref<T | null>
