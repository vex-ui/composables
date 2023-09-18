import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating as useFloatingUi,
  type UseFloatingReturn,
} from '@floating-ui/vue'
import type { Middleware, Placement } from '@floating-ui/vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { computed, onScopeDispose, toRef } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref, StyleValue } from 'vue'

export interface UseFloatingOptions {
  /**
   * the space between triggerEl and floatingEl.
   */
  offset?: number

  /**
   * the floatingEl placement relative to triggerEl.
   */
  placement?: Placement

  /**
   * whether to toggle visibility on `hover` or `click`
   */
  toggleAction?: 'click' | 'hover'

  /**
   * sets floatingEl `min-width `to the `width` of triggerEl,
   */
  autoMinWidth?: boolean

  /**
   * specifies the distance between the edge of the arrow and the edge of floatingEl,
   * positive values will add more distance and shows more of the arrow.
   */
  arrowPadding?: number

  /**
   * whether to hide the floatingEl when its clicked
   */
  hideOnClick?: boolean
}

/**
 * a wrapper composable around `useFloating` from `floating-ui`
 *
 * overload 1: without arrow
 *
 * @param isFloatingElVisible whether the floating element is visible
 * @param Trigger floating-ui reference element
 * @param floating floating-ui floating element
 * @param opt options object, it can be `Reactive` or plain
 */
export function useFloating(
  isFloatingElVisible: Ref<boolean>,
  Trigger: MaybeRefOrGetter<HTMLElement | null>,
  floating: MaybeRefOrGetter<HTMLElement | null>,
  opt: UseFloatingOptions
): UseFloatingReturn

/**
 * a wrapper composable around `useFloating` from `floating-ui`
 *
 * overload 2: with arrow
 *
 * @param isFloatingElVisible whether the floating element is visible
 * @param Trigger floating-ui reference element
 * @param floating floating-ui floating element
 * @param opt options object, it can be `Reactive` or plain
 * @param arrow floating-ui arrow element
 */
export function useFloating(
  isFloatingElVisible: Ref<boolean>,
  Trigger: MaybeRefOrGetter<HTMLElement | null>,
  floating: MaybeRefOrGetter<HTMLElement | null>,
  opt: UseFloatingOptions,
  arrow: MaybeRefOrGetter<HTMLElement | null>
): UseFloatingReturn & { arrowStyles: ComputedRef<StyleValue> }

export function useFloating(
  isFloatingElVisible: Ref<boolean>,
  Trigger: MaybeRefOrGetter<HTMLElement | null>,
  floating: MaybeRefOrGetter<HTMLElement | null>,
  opt: UseFloatingOptions,
  arrow?: MaybeRefOrGetter<HTMLElement | null>
): UseFloatingReturn & { arrowStyles?: ComputedRef<StyleValue> } {
  //----------------------------------------------------------------------------------------------------

  const TriggerEl = toRef(Trigger)
  const FloatingEl = toRef(floating)
  const ArrowEl = arrow ? toRef(arrow) : null

  //----------------------------------------------------------------------------------------------------
  // 📌 visibility
  //----------------------------------------------------------------------------------------------------

  // TODO: move this functionality out
  useEventListener(FloatingEl, 'click', () => {
    if (opt.hideOnClick) {
      isFloatingElVisible.value = false
    }
  })

  if (opt.toggleAction === 'click') {
    useEventListener(TriggerEl, 'click', () => {
      isFloatingElVisible.value = !isFloatingElVisible.value
    })

    onClickOutside(
      FloatingEl,
      () => {
        isFloatingElVisible.value = false
      },
      { ignore: [TriggerEl] }
    )
  }

  if (opt.toggleAction === 'hover') {
    let timeoutId: number

    function setInvisible(e: Event) {
      timeoutId = setTimeout(() => (isFloatingElVisible.value = false), 100)
    }

    function setVisible(e: Event) {
      clearTimeout(timeoutId)
      isFloatingElVisible.value = true
    }

    useEventListener(TriggerEl, 'mouseenter', setVisible)
    useEventListener(TriggerEl, 'mouseleave', setInvisible)

    useEventListener(FloatingEl, 'mouseenter', setVisible)
    useEventListener(FloatingEl, 'mouseleave', setInvisible)

    onScopeDispose(() => {
      clearTimeout(timeoutId)
    })
  }

  //----------------------------------------------------------------------------------------------------
  // 📌 middleware
  //----------------------------------------------------------------------------------------------------

  const middleware = computed<Middleware[]>(() => {
    const mw = [offset(opt.offset), flip(), shift({ padding: 8 })]

    if (opt.autoMinWidth) {
      mw.unshift(
        size({
          apply({ rects, elements }) {
            elements.floating.style.minWidth = `${Math.round(rects.reference.width)}px`
          },
        })
      )
    }

    if (ArrowEl) {
      mw.push(arrowMiddleware({ element: ArrowEl, padding: opt.arrowPadding }))
    }

    return mw
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 floating-ui
  //----------------------------------------------------------------------------------------------------

  const data = useFloatingUi(TriggerEl, FloatingEl, {
    placement: opt.placement,
    whileElementsMounted: autoUpdate,
    middleware,
    open: isFloatingElVisible,
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 arrow
  //----------------------------------------------------------------------------------------------------

  let arrowStyles: ComputedRef<StyleValue> | null = null

  if (ArrowEl) {
    const arrowX = computed(() => data.middlewareData.value.arrow?.x ?? null)
    const arrowY = computed(() => data.middlewareData.value.arrow?.y ?? null)

    arrowStyles = computed<StyleValue>(() => {
      const side = data.placement.value.split('-')[0]
      const staticSide =
        {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[side] ?? 'bottom'

      return {
        position: 'absolute',
        left: arrowX.value != null ? `${arrowX.value}px` : '',
        top: arrowY.value != null ? `${arrowY.value}px` : '',
        [staticSide]: `-2px`,
      }
    })
  }

  //----------------------------------------------------------------------------------------------------

  if (arrowStyles) {
    return {
      arrowStyles,
      ...data,
    }
  } else {
    return {
      ...data,
    }
  }
}
