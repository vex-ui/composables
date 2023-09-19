import { watchDebounced } from '@vueuse/core'
import { type Ref, readonly, ref } from 'vue'
import { isFunction } from '@/utils'

interface Options {
  search?: (data: Suggestion[], query: string, limit: number) => Suggestion[]
  debounce: () => number
  onCleanup?: () => void
  onAfterSearch?: () => void
  onBeforeSearch?: () => void
  maxDisplayedSuggestions: () => number
}

interface Suggestion {
  label: string
  value: string
}

export function useInputSearch(
  query: Ref<string | undefined>,
  suggestions: Suggestion[] | ((query: string, limit: number) => Promise<Suggestion[]>),
  options: Options
) {
  const result = ref<Suggestion[]>([])
  const isSearching = ref(false)
  const { search, debounce, onCleanup, onAfterSearch, onBeforeSearch, maxDisplayedSuggestions } =
    options

  watchDebounced(
    query,
    async (query, _, cleanup) => {
      if (!query) return

      onBeforeSearch?.()

      if (isFunction(suggestions)) {
        onCleanup && cleanup(onCleanup)
        isSearching.value = true
        await suggestions(query, maxDisplayedSuggestions?.())
        isSearching.value = false
      } else {
        result.value = (search ?? defaultSearch)(suggestions, query, maxDisplayedSuggestions?.())
      }

      onAfterSearch?.()
    },
    { debounce }
  )

  return {
    result: readonly(result),
    isSearching: readonly(isSearching),
  }
}

function defaultSearch(data: Suggestion[], query: string, limit: number): Suggestion[] {
  const result = []
  for (const suggestion of data) {
    if (suggestion.label.includes(query)) result.push(suggestion)
    if (result.length >= limit) break
  }
  return result
}
