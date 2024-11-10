import { defineStore } from 'pinia'
import moment from 'moment'
import momentJalaali from 'moment-jalaali'
import Weekday from './weekday'
import 'moment/locale/fa'

// Constants outside the store
const PERSIAN_DAY_NAMES = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
]

export const useTodoStore = defineStore('todo', {
  state: () => ({
    groupList: JSON.parse(localStorage.getItem('groupList')) || [],
    todoList: JSON.parse(localStorage.getItem('todoList')) || [],
    weekday: [],
    nextClickNum: 0,
    selectedGroup: null,
    dateTime: '',
    todayWeekDayNumber: moment().weekday(),
    isPersian: false,
    todayDate: moment(),
    todayDateTime: moment().format('MM-DD-YYYY'),
    direction: '',
    filterType: '',
    filterDateTime: '',
    hasFilter: false,
    groupId: 0,
  }),

  actions: {
    initializeWeekdays() {
      this.weekday = Array.from({ length: 10 }, (_, i) => {
        const dayOffset = i - 2
        return this.calculateDayOffset(dayOffset)
      })
    },

    calculateDayOffset(dayOffset) {
      const currentDay = this.todayDate.clone().add(dayOffset, 'days')
      return this.formatWeekday(currentDay)
    },

    formatWeekday(currentDay) {
      return new Weekday(
        currentDay.format('dddd'),
        PERSIAN_DAY_NAMES[(currentDay.weekday() + 1) % 7],
        currentDay.weekday(),
        currentDay.format('MM-DD-YYYY'),
        momentJalaali(currentDay).format('jYYYY-jMM-jDD'),
      )
    },
    nextAndPrevious(number) {
      const newDay = this.generateNewDay(number)
      this.applyDirection(newDay, number)
      this.calculateDirectionTransform()
    },

    generateNewDay(number) {
      const dayIndex = number === 1 ? this.weekday.length - 1 : 0
      const lastDayDateTime = moment(this.weekday[dayIndex].enDate).add(
        number,
        'days',
      )

      return {
        name: lastDayDateTime.format('dddd'),
        enDate: lastDayDateTime.format('MM-DD-YYYY'),
        perDate: momentJalaali(lastDayDateTime).format('jYYYY-jMM-jDD'),
        perName: PERSIAN_DAY_NAMES[(lastDayDateTime.day() + 1) % 7],
        dayNum: lastDayDateTime.day(),
      }
    },

    applyDirection(newDay, number) {
      if (number === -1) {
        this.nextClickNum--
        this.weekday.unshift(newDay)
      } else {
        this.weekday.push(newDay)
        this.nextClickNum++
      }
    },

    calculateDirectionTransform() {
      this.direction = `translateX(${-this.nextClickNum * 60}px)`
    },

    addGroup(name) {
      const newGroup = { id: this.groupList.length, name }
      this.groupList.push(newGroup)
      this.updateLocalStorage('groupList', this.groupList)
    },

    removeToDoList(todoId) {
      this.todoList = this.todoList.filter(todo => todo.id !== todoId)
      this.updateLocalStorage('todoList', this.todoList)
    },

    setFilter(type, id, dateTime) {
      this.hasFilter = true
      this.filterType = type
      this.groupId = id
      this.filterDateTime = dateTime
    },

    clearFilter() {
      this.hasFilter = false
      this.filterType = ''
      this.groupId = 0
      this.filterDateTime = ''
    },

    addTodoIfValid({ name, groupId, dateTime, isPersian }) {
      if (!name || !this.isValidDateTime(dateTime)) return false
      momentJalaali.loadPersian({ dialect: 'persian-modern' })

      const formattedDate = isPersian
        ? momentJalaali(dateTime, 'jYYYY/jMM/jDD').toDate()
        : dateTime

      const newTodo = {
        name,
        groupId,
        dateTime: moment(formattedDate).format('MM-DD-YYYY'),
        perDateTime: momentJalaali(formattedDate).format('jYYYY-jMM-jDD'),
        done: false,
        id: this.todoList.length,
      }

      this.todoList.push(newTodo)
      this.updateLocalStorage('todoList', this.todoList)
      return true
    },

    isValidDateTime(date) {
      return !isNaN(new Date(date).getTime())
    },

    updateLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
  },

  getters: {
    filteredTodos: state => {
      if (!state.hasFilter) return state.todoList
      return state.todoList.filter(todo => {
        if (state.filterType === 'dateTime')
          return todo.dateTime === state.filterDateTime
        if (state.filterType === 'group') return todo.groupId === state.groupId
        return true
      })
    },
  },
})
