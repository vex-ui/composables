import { useSignal } from './signal'

const [isUsingKeyboard, setIsUsingKeyboard] = useSignal(false)

function onKeydown() {
  setIsUsingKeyboard(true)
  document.addEventListener('pointerdown', onPointer, { capture: true, once: true })
}

function onPointer() {
  setIsUsingKeyboard(false)
  document.addEventListener('keydown', onKeydown, { capture: true, once: true })
}
onPointer()

export { isUsingKeyboard }
