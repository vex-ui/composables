import { isClient, noop } from '@/utils'
import { createSharedComposable } from '@vueuse/core'
import { customRef, onScopeDispose, ref } from 'vue'
import type { Fn } from './types'

export type Dir = 'ltr' | 'rtl' | 'auto' | undefined

export const useTextDirection = createSharedComposable(() => {
  if (!isClient) return ref<Dir>()

  let dir = getDir()
  let trigger: Fn = noop
  const updateDir = () => {
    dir = getDir()
    trigger()
  }

  let observer: MutationObserver | null = new MutationObserver(updateDir)

  observer.observe(document.querySelector('html')!, {
    attributes: true,
    attributeFilter: ['dir'],
  })

  document.addEventListener('DOMContentLoaded', updateDir, { once: true })

  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
  })

  return customRef<Dir>((_track, _trigger) => {
    trigger = _trigger
    return {
      get() {
        _track()
        return dir
      },
      set(v) {
        dir = v
        if (document) {
          setDir(dir)
          _trigger()
        }
      },
    }
  })
})

function getDir(): Dir {
  return document?.querySelector('html')?.getAttribute('dir') as Dir
}

function setDir(dir: Dir): void {
  if (dir) {
    document?.querySelector('html')?.setAttribute('dir', dir)
  } else {
    document?.querySelector('html')?.removeAttribute('dir')
  }
}
