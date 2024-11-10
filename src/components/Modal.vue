<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content md:w-2/5 w-3/5">
      <button class="close text-gray-900" @click="$emit('close')">×</button>
      <component
        :is="currentComponent"
        @add-group="$emit('add-group', $event)"
        @add-todo="$emit('add-todo', $event)"
        :groupList="groupList"
        :isPersian="isPersian"
      />
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Modal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    currentComponent: {
      type: [Object, String],
      required: true,
    },
    groupList: {
      type: Object,
      default: () => ({}),
    },
    isPersian: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'add-group', 'add-todo'],
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
