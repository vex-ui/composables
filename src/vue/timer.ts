import { onScopeDispose, readonly, ref } from 'vue'

/**
 * Custom hook to create a timer with the given duration and callback.
 * @param duration - The duration of the timer in milliseconds.
 * @param cb - The callback function to be executed when the timer ends.
 */
export function useTimer(duration: number, cb: () => void) {
  let startTime = 0
  let remainingTime = duration
  let timeoutID: ReturnType<typeof setTimeout>
  const isRunning = ref(false)

  const start = () => {
    isRunning.value = true
    startTime = Date.now()

    timeoutID = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)
  }

  const stop = () => {
    clearTimeout(timeoutID)
    isRunning.value = false
    remainingTime = 0
  }

  const pause = () => {
    if (remainingTime === 0 || !isRunning.value) return

    isRunning.value = false
    clearTimeout(timeoutID)
    remainingTime -= Date.now() - startTime
  }

  const resume = () => {
    if (remainingTime === 0 || isRunning.value) return
    start()
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
