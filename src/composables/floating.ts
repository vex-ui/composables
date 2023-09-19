// import type {
//   Middleware,
//   MiddlewareData,
//   MiddlewareState,
//   Padding,
//   Placement,
//   Strategy,
// } from '@floating-ui/vue'
// import { arrow, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/vue'
// import {
//   type StyleValue,
//   onScopeDispose,
//   ref,
//   shallowReadonly,
//   shallowRef,
//   toRef,
//   toValue,
//   watch,
// } from 'vue'
// import { useMemo } from '.'
// import type { MaybeRefOrGetter } from '@/types'

// export interface FloatingStyles {
//   position: Strategy
//   top: string
//   left: string
//   transform?: string
//   'will-change'?: 'transform'
// }

// export interface UseFloatingOptions {
//   /**
//    * Where to place the floating element relative to its reference element.
//    * @default 'bottom-start'
//    */
//   placement?: MaybeRefOrGetter<Placement | undefined>

//   /**
//    * The type of CSS position property to use.
//    * @default 'absolute'
//    */
//   strategy?: MaybeRefOrGetter<Strategy | undefined>

//   /**
//    * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
//    *  DO NOT USE SIZE MIDDLEWARE HERE*, use the autoMinWidth option.
//    */
//   middleware?: MaybeRefOrGetter<Middleware[]>

//   /**
//    * Whether to auto set the floatingEl min-width to the width of the referenceEl
//    */
//   autoMinWidth?: MaybeRefOrGetter<boolean | undefined>

//   /**
//    * The distance between the referenceEl and the floatingEl
//    */
//   offset?: number
// }

// export function useFloating(
//   reference: MaybeRefOrGetter<HTMLElement | null>,
//   floating: MaybeRefOrGetter<HTMLElement | null>,
//   visible: MaybeRefOrGetter<boolean>,
//   options: UseFloatingOptions = {
//     middleware: [],
//     placement: 'bottom-start',
//     strategy: 'absolute',
//     offset: 4,
//   },
// ) {
//   // ----------------------------------------------------------------------------------------------------

//   const FloatingEl = toRef(floating)
//   const ReferenceEl = toRef(reference)
//   const isFloatingElVisible = toRef(visible)

//   const strategy = toRef(options.strategy)
//   const placement = toRef(options.placement)
//   const middleware = toRef(options.middleware)

//   const x = ref(0)
//   const y = ref(0)

//   const newStrategy = ref(toValue(options.strategy) || 'absolute')
//   const newPlacement = ref(toValue(options.placement) || 'bottom-start')

//   const middlewareData = shallowRef<MiddlewareData>({})
//   const isPositioned = ref(false)

//   // ----------------------------------------------------------------------------------------------------
//   // 📌 middleware
//   // TODO: maybe default middleware could be abstracted into a separate module?
//   // ----------------------------------------------------------------------------------------------------

//   const _middleware = useMemo(() => {
//     const mw = [offset(toValue(options.offset) || 4), flip(), shift({ padding: 8 })]

//     // size middleware needs to be towards the start according to the docs
//     if (toValue(options.autoMinWidth)) {
//       mw.unshift(
//         size({
//           apply({ rects, elements }) {
//             elements.floating.style.setProperty(
//               '--vex-auto-min-width',
//               `${Math.round(rects.reference.width)}px`,
//             )
//           },
//         }),
//       )
//     }

//     if (middleware.value)
//       mw.push(...middleware.value)

//     return mw
//   })

//   // ----------------------------------------------------------------------------------------------------
//   // 📌 floating styles
//   // ----------------------------------------------------------------------------------------------------

//   const floatingStyles = useMemo(getFloatingStyles, [x, y], {
//     flush: 'pre',
//   })

//   function getFloatingStyles() {
//     const initialStyles = {
//       position: newStrategy.value,
//       left: '0',
//       top: '0',
//     }

//     if (!isFloatingElVisible.value || !FloatingEl.value)
//       return initialStyles

//     const xVal = roundByDPR(FloatingEl.value, x.value)
//     const yVal = roundByDPR(FloatingEl.value, y.value)

//     return {
//       ...initialStyles,
//       // left: `${xVal ?? 0}px`,
//       // top: `${yVal ?? 0}px`,
//       transform: `translate(${xVal}px, ${yVal}px)`,
//       ...(getDPR(FloatingEl.value) >= 1.5 && {
//         willChange: 'transform',
//       }),
//     }
//   }

//   // ----------------------------------------------------------------------------------------------------
//   // 📌 update
//   // ----------------------------------------------------------------------------------------------------

//   function update() {
//     if (!isFloatingElVisible.value || !FloatingEl.value || !ReferenceEl.value)
//       return

//     computePosition(ReferenceEl.value, FloatingEl.value, {
//       middleware: _middleware(),
//       placement: placement.value || 'bottom-start',
//       strategy: strategy.value || 'absolute',
//     }).then((position) => {
//       x.value = position.x
//       y.value = position.y
//       newPlacement.value = position.placement
//       newStrategy.value = position.strategy
//       middlewareData.value = position.middlewareData
//       isPositioned.value = true
//     })
//   }

//   watch([middleware, placement, strategy], update)

//   // ----------------------------------------------------------------------------------------------------
//   // 📌 attach
//   // ----------------------------------------------------------------------------------------------------

//   let autoUpdateCleanup: (() => void) | undefined

//   watch([ReferenceEl, FloatingEl, isFloatingElVisible], ([reference, floating, visible]) => {
//     autoUpdateCleanup?.()
//     autoUpdateCleanup = undefined

//     if (!visible || !floating || !reference)
//       return
//     autoUpdateCleanup = autoUpdate(reference, floating, update)
//   })

//   onScopeDispose(() => autoUpdateCleanup?.())

//   // ----------------------------------------------------------------------------------------------------

//   watch(isFloatingElVisible, (visible) => {
//     if (!visible)
//       isPositioned.value = false
//   })

//   return {
//     x: shallowReadonly(x),
//     y: shallowReadonly(y),
//     strategy: shallowReadonly(newStrategy),
//     placement: shallowReadonly(newPlacement),
//     middlewareData: shallowReadonly(middlewareData),
//     isPositioned: shallowReadonly(isPositioned),
//     floatingStyles,
//     update,
//   }
// }

// // ----------------------------------------------------------------------------------------------------
// // 📌 arrow
// // ----------------------------------------------------------------------------------------------------

// interface ArrowOptions {
//   element: MaybeRefOrGetter<HTMLElement | null>
//   padding?: Padding
// }

// /**
//  * Positions an inner element of the floating element such that it is centered to the reference element.
//  * @param arrowEl The arrow.
//  * @param padding The padding.
//  * @see https://floating-ui.com/docs/arrow
//  */
// export function arrowMiddleware(
//   arrowEl: MaybeRefOrGetter<HTMLElement | null>,
//   padding: Padding = 0,
// ) {
//   return {
//     name: 'arrow',
//     options: {},
//     fn(args: MiddlewareState) {
//       const element = toValue(arrowEl)
//       if (!element)
//         return {}

//       return arrow({
//         element,
//         padding,
//       }).fn(args)
//     },
//   }
// }

// export function useArrow(
//   middlewareData: MaybeRefOrGetter<MiddlewareData>,
//   placement: MaybeRefOrGetter<Placement>,
// ) {
//   const _placement = toRef(placement)
//   const _middlewareData = toRef(middlewareData)

//   const styles = useMemo<StyleValue>(() => {
//     const x = _middlewareData.value.arrow?.x ?? null
//     const y = _middlewareData.value.arrow?.y ?? null

//     const side = _placement.value.split('-')[0]
//     const staticSide
//       = {
//         top: 'bottom',
//         right: 'left',
//         bottom: 'top',
//         left: 'right',
//       }[side] ?? 'bottom'

//     // TODO: what's this `-2px` value?
//     return {
//       position: 'absolute',
//       left: x ? `${x}px` : '',
//       top: y ? `${y}px` : '',
//       [staticSide]: '-1px',
//     }
//   })

//   return styles
// }

// // ----------------------------------------------------------------------------------------------------
// // 📌 utils
// // ----------------------------------------------------------------------------------------------------

// // DPR = device pixel ratio
// function getDPR(el: HTMLElement) {
//   if (typeof window === 'undefined')
//     return 1

//   const win = el.ownerDocument.defaultView || window
//   return win.devicePixelRatio || 1
// }

// function roundByDPR(el: HTMLElement, value: number) {
//   const dpr = getDPR(el)
//   return Math.round(value * dpr) / dpr
// }
