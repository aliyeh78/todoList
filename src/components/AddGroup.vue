<!-- GroupComponent.vue -->
<template>
  <div>
    <h2 class="text-slate-900 my-2 text-center font-bold">
      {{ isPersian ? ' افزودن گروه' : 'Add Group' }}
    </h2>
    <div class="px-3">
      <div class="flex flex-col relarive">
        <label
          for="groupName"
          :style="isPersian ? 'direction:rtl;text-align:right' : ''"
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          {{ isPersian ? 'نام گروه' : 'Group Name ' }}
        </label>
        <input
          type="text"
          id="groupName"
          v-model="groupName"
          :style="isPersian ? 'direction:rtl;text-align:right' : ''"
          class="bg-gray-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="isPersian ? 'نام گروه' : 'Group Name'"
          required
        />
        <div class="relative">
          <span
            v-if="
              (groupName == '' || groupName == null) && isAddingGroup == true
            "
            :style="isPersian ? 'direction:rtl;text-align:right' : ''"
            class="text-red-500 absolute text-xs pt-1 w-full px-2"
          >
            {{
              isPersian
                ? 'تکمیل این فیلد الزامی می باشد'
                : 'Please complete this field'
            }}
          </span>
        </div>

        <button
          @click="addGroupName"
          class="m-1 mt-7 py-2 px-4 rounded bg-indigo-700 hover:text-indigo-800 hover:bg-indigo-300 text-white font-bold"
        >
          {{ isPersian ? 'افزودن گروه' : 'Add Group' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useTodoStore } from '../stores/todoStore'

export default defineComponent({
  name: 'AddGroup',
  props: {
    isPersian: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      groupName: '',
      isAddingGroup: false,
    }
  },
  setup() {
    const todoStore = useTodoStore()

    return {
      todoStore,
    }
  },
  methods: {
    addGroupName() {
      this.isAddingGroup = true
      this.todoStore.addGroup(this.groupName)
      if (this.groupName != '') {
        this.$emit('add-group')
        this.groupName = ''
        this.isAddingGroup = false
      }
    },
  },
})
</script>
