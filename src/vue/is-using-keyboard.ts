import { isClient } from '@/utils'
import { ref } from 'vue'

export const isUsingKeyboard = ref(false)

function onKeydown() {
  isUsingKeyboard.value = true
  document.addEventListener('pointerdown', onPointer, { capture: true, once: true })
}

function onPointer() {
  isUsingKeyboard.value = false
  document.addEventListener('keydown', onKeydown, { capture: true, once: true })
}

if (isClient) {
  onPointer()
}
