<template>
  <div class="parent flex flex-col justify-center items-center">
    <!-- date filter -->
    <div
      class="w-full bg-zinc-800 rounded-lg w-full md:grid md:grid-cols-3 md:gap-2 mb-2"
    >
      <!-- En Per Language -->
      <div
        class="px-1 pt-1 md:grid md:grid-cols-2 md:gap-2 flex border-r max-h-24 border-gray-800"
      >
        <button
          @click="isPersian = false"
          class="m-1 mb-2 py-2 px-4 w-full rounded hover:text-indigo-800 hover:bg-indigo-400 text-white font-bold"
          :class="{
            'bg-indigo-300 text-indigo-800': !isPersian,
            'bg-indigo-800': isPersian,
          }"
        >
          English
        </button>
        <button
          @click="isPersian = true"
          class="m-1 mb-2 py-2 px-4 w-full rounded hover:bg-indigo-400 hover:text-indigo-800 text-white font-bold"
          :class="{
            'bg-indigo-300 text-indigo-800': isPersian == true,
            'bg-indigo-800': isPersian == false,
          }"
        >
          Persian
        </button>
      </div>

      <!-- filter Date -->
      <div
        class="col-span-2 flex grid md:grid-cols-10 grid-cols-6 items-center Class Properties overflow-hidden"
      >
        <div class="col-span-1 flex items-center justify-center">
          <button
            @click="todoStore.nextAndPrevious(-1)"
            class="bg-indigo-700 cursor-pointer hover:bg-indigo-300 hover:text-indigo-800 text-lg m-2 max-w-44 min-w-14 max-h-12 flex items-center justify-center py-2 rounded font-bold"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
        </div>
        <div
          class="md:col-span-8 justify-center col-span-4 relative flex overflow-hidden"
        >
          <div
            class="w-full flex justify-center items-center box-transition"
            :style="{ transform: `${todoStore.direction}` }"
          >
            {{ todoStore.direction }}
            <button
              v-for="days in todoStore.weekday"
              class="m-2 max-w-44 cursor-pointer text-center items-center hover:bg-indigo-400 hover:text-indigo-800 min-w-28 flex flex-col py-1 justify-center rounded font-bold"
              :key="days.dayNum"
              @click="todoStore.setFilter('dateTime', null, days.enDate)"
              :class="{
                'bg-indigo-300 text-indigo-800':
                  todoStore.filterType == 'dateTime' &&
                  todoStore.filterDateTime === days.enDate,
                'bg-indigo-800 text-gray-200':
                  todoStore.filterType != 'dateTime' ||
                  todoStore.filterDateTime != days.enDate,
              }"
            >
              <div class="font-bold text-xs text-center">
                {{ isPersian ? days.perName : days.name }}
                <span v-if="days.enDate === todoStore.todayDateTime"
                  >{{ isPersian ? '(امروز)' : '(today)' }}
                </span>
              </div>
              <div class="font-bold text-xs text-center">
                {{ isPersian ? days.perDate : days.enDate }}
              </div>
            </button>
          </div>
        </div>
        <div class="col-span-1 flex items-center justify-center">
          <button
            @click="todoStore.nextAndPrevious(1)"
            class="bg-indigo-700 cursor-pointer hover:bg-indigo-300 hover:text-indigo-800 text-lg m-2 max-w-44 min-w-14 max-h-12 flex items-center justify-center py-2 rounded font-bold"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </button>
        </div>
      </div>
    </div>

    <!-- todolist part -->
    <div class="w-full bg-zinc-800 rounded-lg w-full flex flex-col">
      <div class="grid md:grid-cols-3 m-2 p-3 md:gap-2">
        <!-- groupList -->
        <div
          class="box-h md:bg-zinc-800 bg-zinc-700 rounded-lg md:mb-0 mb-3 group-List px-2 pt-1 flex flex-col justify-between md:border-x md:border-indigo-400"
        >
          <div class="groupList">
            <table class="w-full table-fixed">
              <thead>
                <tr>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b dark:border-indigo-400"
                  >
                    {{ isPersian ? 'نام گروه' : 'Group Name' }}
                  </th>
                </tr>
              </thead>
              <tbody v-if="todoStore.groupList?.length > 0">
                <tr
                  v-for="group in todoStore.groupList"
                  :key="group.id"
                  class=""
                  :class="{
                    'bg-indigo-500 text-indigo-800':
                      todoStore.filterType == 'group' &&
                      todoStore.groupId === group.id,
                    'odd:bg-zinc-800 even:bg-zinc-700 text-gray-200':
                      todoStore.filterType != 'group' ||
                      todoStore.groupId != group.id,
                  }"
                >
                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    <a @click="todoStore.setFilter('group', group.id)">
                      {{ group.name }}
                    </a>
                  </td>
                </tr>
              </tbody>
              <div
                v-if="todoStore.groupList.length == 0"
                class="text-center pt-2 text-gray-200"
              >
                {{ isPersian ? 'گروهی موجود نمی باشد' : 'There is No Group' }}
              </div>
            </table>
          </div>

          <button
            @click="showModal('add-group')"
            class="m-1 mb-2 py-2 px-4 rounded bg-indigo-700 bg-indigo-700 hover:text-indigo-800 hover:bg-indigo-300 text-gray-100 font-bold"
          >
            {{ isPersian ? 'افزودن گروه' : 'Add Group' }}
          </button>
        </div>

        <!-- todo List -->
        <div
          class="col-span-2 box-h md:bg-zinc-800 bg-zinc-700 rounded-lg flex flex-col px-2 justify-between todo-list"
        >
          <div class="pt-1 groupList pr-1">
            <table class="w-full table-fixed">
              <thead>
                <tr>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b border-indigo-400"
                  >
                    {{ isPersian ? 'نام کار' : 'ToDo Name' }}
                  </th>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b border-indigo-400"
                  >
                    {{ isPersian ? 'زمان انجام' : 'ToDo Date' }}
                  </th>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b border-indigo-400"
                  >
                    {{ isPersian ? 'نام گروه' : ' ToDo Group' }}
                  </th>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b border-indigo-400"
                  >
                    {{ isPersian ? 'انجام شده' : 'Done' }}
                  </th>
                  <th
                    class="font-bold text-gray-200 py-2 px-3 text-center border-b border-indigo-400"
                  >
                    {{ isPersian ? 'حذف' : 'remove' }}
                  </th>
                </tr>
              </thead>
              <tbody v-if="todoStore.todoList.length > 0">
                <tr
                  class="odd:bg-zinc-800 even:bg-zinc-700"
                  v-for="(todo, index) in todoStore.filteredTodos"
                  :class="{
                    'line-through text-gray-200':
                      todoStore.todoList[index].done,
                  }"
                  :key="todo.id"
                >
                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    {{ todo.name }}
                  </td>
                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    {{ isPersian ? todo.perDateTime : todo.dateTime }}
                    <!-- {{ getTime(todo.dateTime) }} -->
                  </td>
                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    {{
                      todo.groupId
                        ? getGroupName(todo.groupId)
                        : isPersian
                          ? 'گروه ندارد'
                          : 'No Group'
                    }}
                  </td>

                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    <input
                      type="checkbox"
                      v-on:change="todoStore.updateLocalStorage('todoList', this.todoList)()"
                      v-model="todoStore.todoList[index].done"
                    />
                  </td>
                  <td
                    class="text-gray-200 text-lg text-center cursor-pointer px-4 hover:bg-indigo-600 border-t dark:border-gray-700"
                  >
                    <a
                      @click="
                        todoStore.removeToDoList(todoStore.todoList[index].id)
                      "
                    >
                      <font-awesome-icon class="text-red-500" icon="trash" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="todoStore.todoList.length == 0"
              class="text-center pt-2 text-gray-200"
            >
              {{
                isPersian
                  ? 'لیست انجام کار خالی می باشد'
                  : 'There is No ToDo List'
              }}
            </div>
          </div>
          <div class="flex flex-col">
            <button
              v-if="
                todoStore.hasFilter == true && todoStore.todoList.length > 0
              "
              @click="
                (todoStore.filterType = ''), (todoStore.hasFilter = false)
              "
              class="my-1 mb-2 py-2 px-4 rounded bg-indigo-700 hover:text-indigo-800 hover:bg-indigo-300 text-white font-bold"
            >
              {{ isPersian ? 'حذف فیلتر' : 'Delete Filter' }}
            </button>
            <button
              @click="showModal('add-list')"
              class="my-1 mr-2 mb-2 py-2 px-4 rounded bg-indigo-700 hover:text-indigo-800 hover:bg-indigo-300 text-white font-bold"
            >
              {{ isPersian ? 'افزودن لیست' : 'Add List' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :currentComponent="currentComponent"
      @close="closeModal"
      @add-group="handleAddGroup"
      @add-todo="handleToDo"
      :groupList="groupList"
      :isPersian="isPersian"
    />
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore'
import { onMounted } from 'vue'
import AddGroup from './AddGroup.vue'
import Modal from './Modal.vue'
import AddToDo from './AddToDo.vue'
export default {
  components: {
    Modal,
  },

  data() {
    return {
      groupList: [],
      todoList: [],
      isModalVisible: false,
      currentComponent: '',
      filterType: '',
      groupId: 0,
      nextClickNum: 0,
      hasFilter: false,
      saveDetail: false,
      isPersian: false,
      filterDateTime: '',
    }
  },
  setup() {
    const todoStore = useTodoStore()

    onMounted(() => {
      todoStore.initializeWeekdays() // Initialize weekdays on mount
    })
    return {
      todoStore,
    }
  },
  methods: {
    getGroupName(id) {
      const group = this.todoStore.groupList.find(group => group.id === id)
      return group ? group.name : ''
    },
    showModal(type) {
      this.isModalVisible = true
      this.currentComponent = type === 'add-group' ? AddGroup : AddToDo
    },
    handleAddGroup() {
      this.closeModal()
    },
    handleToDo() {
      this.closeModal()
    },
    closeModal() {
      this.isModalVisible = false
      this.currentComponent = ''
    },
    returnTranslateNum(num) {
      return num * 130
    },
    nextAndPrevioustodoStore(num) {
      return num * 130
    },
    clearFilter() {
      this.hasFilter = false
    },
  },
}
</script>

<style scoped>
.child {
  height: 80%;
}

.box-h {
  height: 80vh;
}

.box-transition {
  transition: transform 0.3s ease;
}

@screen md {
  .parent {
    height: 100vh;
  }
}
.groupList {
  height: 68vh;
  overflow: scroll;
}
.week-view {
  display: flex;
  align-items: center;
}
.days-wrapper {
  overflow: hidden;
  width: 300px; /* Adjust based on three items' total width */
}

.day {
  width: 100px;
  text-align: center;
}
</style>
