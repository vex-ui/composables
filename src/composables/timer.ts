import { onUnmounted, readonly, ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Custom hook to create a timer with the given duration and callback.
 * @function
 * @param duration - The duration of the timer in milliseconds.
 * @param cb - The callback function to be executed when the timer ends.
 * @returns An object containing the timer control methods.
 */
export function useTimer(duration: number, cb: () => void): TimerControls {
  let startTime = 0
  let remainingTime = duration
  let timeoutId: ReturnType<typeof setTimeout>
  const isRunning = ref(false)

  function start() {
    isRunning.value = true
    startTime = Date.now()

    timeoutId = setTimeout(() => {
      stop()
      cb()
    }, remainingTime)
  }

  function stop() {
    isRunning.value = false
    remainingTime = 0
    clearTimeout(timeoutId)
  }

  function pause() {
    if (remainingTime === 0 || !isRunning.value) return

    isRunning.value = false
    clearTimeout(timeoutId)
    remainingTime -= Date.now() - startTime
  }

  function resume() {
    if (remainingTime === 0 || isRunning.value) return
    start()
  }

  onUnmounted(stop)

  return {
    start,
    stop,
    pause,
    resume,
    isRunning: readonly(isRunning),
  }
}

/**
 * provides methods to control a timer.
 * @interface
 */
interface TimerControls {
  /**
   * Start the timer.
   */
  start: () => void

  /**
   * Stop the timer and clear it.
   */
  stop: () => void

  /**
   * Pause the timer and update the remaining time.
   */
  pause: () => void

  /**
   * Resume the timer if there is remaining time.
   */
  resume: () => void

  /**
   * Whether the timer is currently running.
   *
   * @readonly
   */
  readonly isRunning: Readonly<Ref<boolean>>
}
