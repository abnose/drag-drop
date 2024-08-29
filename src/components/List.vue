<script setup lang="ts">
import Button from "primevue/button";
import { VueDraggableNext } from "vue-draggable-next";
import { handleDate, stringReducer, remainingDays } from "../utils/util";
import dataStore from "../store/crud";
import { Task, TaskGroup } from "../App.vue";

const store = dataStore();

const emits = defineEmits([
  "editHeader",
  "deleteHeader",
  "deleteTask",
  "editTask",
  "addTask",
]);

const handleEditHeader = (item: TaskGroup) => {
  emits("editHeader", item);
};

const handleDeleteHeader = (item: TaskGroup) => {
  emits("deleteHeader", item);
};

const handleEditTask = (item: Task, id: number) => {
  emits("editTask", { data: item, groupId: id });
};

const handleDeleteTask = (id: number) => {
  emits("deleteTask", id);
};

const handleAddTask = (id: number) => {
  emits("addTask", id);
};

// Method to use in the template

const showingDate = (createDate: string): string => {
  return handleDate(createDate);
};
</script>

<template>
  <div class="mainContainer">
    <div
      :key="item.id"
      v-for="item in store.storedData"
      class="mainContainer__customCard"
    >
      <h1 class="mainContainer__customCard--header rltDir">
        {{ stringReducer(item.header, 10) }}
      </h1>
      <div class="mainContainer__customHeaderBtnContainer">
        <Button
          @click="handleEditHeader(item)"
          icon="pi pi-pencil"
          severity="warn"
          aria-label="pencil"
          v-tooltip.bottom="'ویرایش گروه'"
          class="mrRight"
          rounded
        />
        <Button
          @click="handleDeleteHeader(item)"
          icon="pi pi-trash"
          severity="danger"
          aria-label="trash"
          v-tooltip.bottom="'حذف گروه'"
          rounded
        />
      </div>
      <VueDraggableNext
        class="mainContainer__customCard--body"
        v-model="item.body"
        tag="div"
        group="tasks"
        :animation="100"
      >
        <span v-if="!item.body?.length"> بنداز اینجا </span>
        <template :key="element.id" v-for="element in item.body">
          <div
            class="mainContainer__customCard--body-task"
            :style="[
              remainingDays(element.deadline).isPast
                ? { background: 'rgb(139,0,0 , .5)' }
                : { background: 'rgba(0, 0, 0, 0.5)' },
            ]"
          >
            <div class="mainContainer__customCard--body--btnContainer">
              <Button
                rounded
                outlined
                @click="handleDeleteTask(element.id)"
                icon="pi pi-trash"
                severity="danger"
                aria-label="trash"
                v-tooltip.bottom="'حذف تسک'"
              />
              <Button
                rounded
                outlined
                @click="handleEditTask(element, item.id)"
                icon="pi pi-pencil"
                severity="warn"
                aria-label="pencil"
                v-tooltip.bottom="'ویرایش تسک'"
              />
              <small
                class="mainContainer__customCard--body--btnContainer-remaindays"
                >{{ remainingDays(element.deadline).message }}</small
              >
              <small
                class="mainContainer__customCard--body--btnContainer-createDate"
              >
                تاریخ ایجاد: {{ showingDate(element.createDate) }}</small
              >
            </div>
            <p
              v-tooltip.bottom="
                `${element.comment.length > 20 ? element.comment : ''}`
              "
              class="rltDir"
            >
              {{ stringReducer(element.comment, 20) }}
            </p>
          </div>
        </template>
      </VueDraggableNext>
      <slot></slot>
      <div
        @click="handleAddTask(item.id)"
        class="mainContainer__customCard--addBtn"
        v-tooltip.bottom="'ایجاد تسک'"
      >
        <Button rounded icon="pi pi-plus" aria-label="Save" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mainContainer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  &__customCard {
    border: 1px solid snow;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    width: 49%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2.75em 0.2em;
    &--header {
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(-20%, -85%);
      background: rgb(223, 223, 223);
      border: 1px solid black;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
      font-size: 1.55em;
      border-radius: 15px;
      color: black;
      padding: 0.25em 0.75em;
    }
    &--body {
      background: rgba(223, 223, 223, 0.01);
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 1em;
      border-radius: 10px;
      padding: 1em;
      align-items: center;
      flex-direction: column;
      &-task {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        list-style: none;
        padding: 8px;
        margin: 14px 0;
        color: black;
        border-radius: 14px;
        cursor: grab;
        width: 80%;
        height: 100px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        color: wheat;
      }
      &--btnContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: auto;
        position: relative;
        &-remaindays {
          position: absolute;
          left: 0;
          bottom: 0;
          background: lightblue;
          color: black;
          transform: translate(0, 170%);
          padding: 0.25em 0.75em;
          border-radius: 7px;
          box-shadow: 0 0 1px black;
        }
        &-createDate {
          direction: rtl;
          margin-left: 0.5em;
        }
        Button {
          margin: 0.1em;
        }
      }
    }
    &--addBtn {
      background: lightblue;
      width: 90%;
      height: 45px;
      border-bottom-left-radius: 150px;
      border-bottom-right-radius: 150px;
      position: absolute;
      bottom: 0;
      transform: translate(0, 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      p {
        border-radius: 50%;
        width: 24px;
        height: 24px;
        padding: 0 0.05em 1.15em 0;
        background: rgb(44, 63, 15);
        color: wheat;
      }
    }
  }
  &__customHeaderBtnContainer {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(5px, -15px);
  }
}
</style>
