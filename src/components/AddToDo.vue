<template>
  <div>
    <h2 class="text-slate-900 my-2 text-center font-bold">
      {{ isPersian ? 'افزودن کار' : 'Add ToDo' }}
    </h2>
    <div class="pc-3 flex flex-col">
      <label
        for="todoName"
        :style="isPersian ? 'direction:rtl;text-align:right' : ''"
        class="block mb-2 text-sm font-medium text-gray-900"
      >
        {{ isPersian ? 'نام کار' : 'ToDo name' }}
      </label>
      <input
        type="text"
        id="todoName"
        v-model="todoName"
        :style="isPersian ? 'direction:rtl;text-align:right' : ''"
        class="bg-gray-10 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :placeholder="isPersian ? 'نام کار' : 'todo Name'"
        required
      />
      <div class="relative">
        <span
          v-if="(todoName == '' || todoName == null) && isAddingTodo == true"
          :style="isPersian ? 'direction:rtl;text-align:right' : ''"
          class="text-red-500 absolute text-xs pt-1 w-full px-2"
        >
          {{
            isPersian
              ? 'تکمیل این فیلد الزامی می باشد'
              : 'Please complete this field'
          }}
          {{ todoName }}
        </span>
      </div>
      <label
        v-if="todoStore.groupList.length > 0"
        for="todoName"
        :style="isPersian ? 'direction:rtl;text-align:right' : ''"
        class="block my-2 mt-6 text-sm font-medium text-gray-900"
      >
        {{ isPersian ? 'نام گروه' : 'ToDo Group Name' }}
      </label>

      <select
        v-if="todoStore.groupList.length > 0"
        v-model="selectedGroup"
        :style="isPersian ? 'direction:rtl;text-align:right' : ''"
        class="bg-gray-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option
          :style="isPersian ? 'direction:rtl;text-align:right' : ''"
          v-for="gp in todoStore.groupList"
          :value="gp.id"
          :key="gp.id"
        >
          {{ gp.name }}
        </option>
      </select>
      <div class="relative">
        <span
          v-if="
            selectedGroup == null &&
            isAddingTodo == true &&
            todoStore.groupList?.length > 0
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
      <label
        for="todoName"
        :style="isPersian ? 'direction:rtl;text-align:right' : ''"
        class="block mt-6 my-2 text-sm font-medium text-gray-900"
      >
        {{ isPersian ? 'تاریخ انجام' : ' ToDo Date' }}
      </label>

      <VueDatePicker
        v-if="!isPersian"
        v-model="dateTime"
        format="mm/dd/yyyy"
        placeholder="Select Date"
      ></VueDatePicker>
      <DatePicker
        v-if="isPersian"
        v-model="dateTime"
        :placeholder="'تاریخ مورد نظر را انتخاب کنید'"
      />

      <div class="relative">
        <span
          v-if="
            (dateTime == '' ||
              (!todoStore.isValidDateTime(dateTime) && isPersian == false) ||
              dateTime == null) &&
            isAddingTodo == true
          "
          :style="isPersian ? 'direction:rtl;text-align:right' : ''"
          placeholder="Select Date"
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
        @click="addToDoName"
        class="mt-7 py-2 px-4 rounded bg-indigo-700 hover:text-indigo-800 hover:bg-indigo-300 text-white font-bold"
      >
        {{ isPersian ? 'افزودن به لیست' : 'Add todo' }}
      </button>
    </div>
  </div>
</template>

<script>
import 'moment/locale/fa'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import DatePicker from './DatePicker.vue'
import { useTodoStore } from '../stores/todoStore'

export default {
  name: 'AddToDo',
  components: {
    VueDatePicker,
    DatePicker,
  },
  mounted() {
    this.dateTime = ''
  },
  props: {
    groupList: {
      type: Array,
      required: true,
    },
    isPersian: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['add-todo'],
  data() {
    return {
      todoName: '',
      selectedGroup: null,
      dateTime: '',
      isAddingTodo: false,
    }
  },
  setup() {
    const todoStore = useTodoStore()

    return {
      todoStore,
    }
  },
  methods: {
    addToDoName() {
      this.isAddingTodo = true
      const success = this.todoStore.addTodoIfValid({
        name: this.todoName,
        groupId: this.selectedGroup,
        dateTime: this.dateTime,
        isPersian: this.isPersian,
      })

      if (success) {
        this.$emit('add-todo')
        this.todoName = ''
        this.dateTime = ''
        this.isAddingTodo = false
      }
    },
  },
}
</script>

<style scoped>
.vue-datepicker__action {
  display: none;
}
</style>
