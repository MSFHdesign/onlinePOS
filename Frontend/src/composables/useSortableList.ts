/**     
 * This composable is used to sort a list of items.
 * usage:
 * import { useSortableList } from '@/composables/useSortableList'
 * <draggable 
  v-model="products" 
  item-key="id" 
  @end="updateOrder"
>
  <template #item="{ element }">
    <!-- dit row markup -->
  </template>
</draggable>

     */
import axios from 'axios'
import { ref } from 'vue'

export function useSortableList<T extends { id: number }>(
  endpoint: string,
  initialList: T[] = []
) {
  const items = ref<T[]>([...initialList])

  const updateOrder = async () => {
    const order = items.value.map((item) => item.id)
    try {
      await axios.post(endpoint, { order })
    } catch (err) {
      console.error('Fejl ved opdatering af rækkefølge:', err)
    }
  }

  return {
    items,
    updateOrder
  }
}
