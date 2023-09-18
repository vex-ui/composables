import type { ComponentPublicInstance, VNode, VNodeTypes } from 'vue'
import { Comment, Fragment, Text, cloneVNode } from 'vue'

const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

export function useInjectRef(
  setTemplateRef: (vm: HTMLElement | ComponentPublicInstance | null) => void,
  slot: () => VNode[] | undefined,
  component: string
) {
  const Trigger = () => {
    const vNodes = slot()
    if (!vNodes || vNodes.length !== 1 || INVALID_VNODE_TYPES.includes(vNodes[0].type)) {
      throw new Error(`[vex] <${component}> requires exactly a single root child at all times`)
    }
    return cloneVNode(
      vNodes[0],
      {
        ref: setTemplateRef,
      },
      true
    )
  }

  Trigger.inheritAttrs = true
  Trigger.props = [] as any
  return Trigger
}

// function getValidVNode(vnode: VNode | null){
//   if(vnode == null) return vnode
//   if(typeof vnode.type === 'string' && vnode.type !== 'template') return vnode

//   if(vnode.type === 'template'){
//     return getValidVNode(vnode.children)
//   }
// }
