import { onScopeDispose, readonly, ref } from 'vue'

/**
 * Custom hook to create a timer with the given duration and callback.
 * @param duration - The duration of the timer in milliseconds.
 * @param cb - The callback function to be executed when the timer ends.
 */
export function useTimer(duration: number, cb: () => void) {
  let startTime = 0
  let remainingTime = 0
  let timeoutID: ReturnType<typeof setTimeout>
  const isRunning = ref(false)

  const start = () => {
    if (isRunning.value) {
      if (import.meta.env.DEV) {
        console.warn('[vex] timer is already running, make sure to `stop` it first')
      }
      return
    }

    startTime = Date.now()
    remainingTime = duration

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)

    isRunning.value = true
  }

  const stop = () => {
    clearTimeout(timeoutID)
    remainingTime = 0
    isRunning.value = false
  }

  const pause = () => {
    if (remainingTime === 0 || !isRunning.value) return

    clearTimeout(timeoutID)
    remainingTime -= Date.now() - startTime
    isRunning.value = false
  }

  const resume = () => {
    if (remainingTime === 0 || isRunning.value) return
    startTime = Date.now()

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)

    isRunning.value = true
  }

  onScopeDispose(stop)

  return {
    stop,
    start,
    pause,
    resume,
    isRunning: readonly(isRunning),
  }
}
