// import { useClickOutside, useRemoveBodyScroll } from '@/composables'
// import type { Getter } from '@/types'
// import { useEventListener } from '@vueuse/core'
// import { computed, shallowReactive, watch } from 'vue'
// import type { getTemplateRef } from './template-ref'

// export type Layer = getTemplateRef
// export const layers = shallowReactive(new Set<Layer>())
// const bodyScroll = useRemoveBodyScroll()

// watch(
//   layers,
//   () => {
//     if (layers.size === 0) {
//       document.body.style.pointerEvents = ''
//       bodyScroll.unRemove()
//       return
//     }
//     if (layers.size === 1) {
//       document.body.style.pointerEvents = 'none'
//       bodyScroll.remove()
//       return
//     }
//   },
//   { flush: 'sync' }
// )

// interface UseLayerListeners {
//   onDismiss?: (e: Event) => void
//   onClickOutside?: (e: PointerEvent | MouseEvent) => void
//   onEscapeKey?: (e: KeyboardEvent) => void
// }

// export function useLayer(
//   LayerEl: Layer,
//   isActive: Getter<boolean>,
//   listeners: UseLayerListeners = {}
// ) {
//   watch(
//     isActive,
//     (active) => {
//       active ? layers.add(LayerEl) : layers.delete(LayerEl)
//     },
//     { immediate: true }
//   )

//   const isTopLayer = computed<boolean>(() => [...layers][layers.size - 1] === LayerEl)

//   //----------------------------------------------------------------------------------------------------

//   useClickOutside(LayerEl, (e) => {
//     if (!isTopLayer.value) return
//     listeners.onClickOutside?.(e)
//     listeners.onDismiss?.(e)
//   })

//   useEventListener('keydown', (e: KeyboardEvent) => {
//     if (e.key === 'Escape' && isTopLayer.value) {
//       e.stopImmediatePropagation()
//       listeners.onEscapeKey?.(e)
//       listeners.onDismiss?.(e)
//     }
//   })

//   return {
//     isTopLayer,
//   }
// }
export function useLayer() {}
