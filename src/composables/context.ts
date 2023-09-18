import { inject, type InjectionKey } from 'vue'

export function useContext<T>(context: InjectionKey<T>, parent: string, child: string) {
  const ctx = inject(context, null)
  if (ctx === null) {
    throw new Error(`[vex] <${child}> is missing a <${parent}> parent component.`)
  }
  return ctx
}
