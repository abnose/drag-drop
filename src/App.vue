<script setup lang="ts">
import Button from "primevue/button";
import { ref, watch } from "vue";
import dataStore from "./store/crud";
import { getRandomInt } from "./utils/util";
import InputText from "primevue/inputtext";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import List from "./components/List.vue";
import Modal from "./components/Modal.vue";
import DeleteModal from "./components/DeleteModal.vue";
// Define the types for data items
export interface Task {
  comment: string;
  createDate: string;
  deadline: string;
  id: number;
}

export interface TaskGroup {
  header: string;
  id: number;
  body: Task[];
}

// Using the store
const store = dataStore();

// Toast functionality
const toast = useToast();
const showSuccess = (text: string): void => {
  toast.add({ severity: "success", summary: "موفق", detail: text, life: 3000 });
};

// Initial header setup
const headerText = ref<string>("");
const headerRules = {
  headerText: { required },
};
const v_header$ = useVuelidate(headerRules, { headerText });

// Initial task setup
const comment = ref<string>("");
const deadline = ref<string>("");
const rules = {
  comment: { required },
  deadline: { required },
};
const v_tasks$ = useVuelidate(rules, { comment, deadline });

// Modal visibility and mode states
const editMode = ref<boolean>(false);

const visibleAddTaskHeaderModal = ref<boolean>(false);
const visibleAddTaskModal = ref<boolean>(false);
const visibleDeleteModal = ref<boolean>(false);

// Reference for data storage
const data = ref<TaskGroup[]>(store.storedData as TaskGroup[]);

const saveStats = (): void => {
  console.log(data.value);
  store.saveData(data.value);
};

watch(data.value, async () => {
  saveStats();
});

// Close modals and reset validation
const closeAddHeaderModal = (): void => {
  headerText.value = "";
  visibleAddTaskHeaderModal.value = false;
  editMode.value = false;
  v_header$.value.$reset();
};

const closeAddTaskModal = (): void => {
  comment.value = "";
  deadline.value = "";
  visibleAddTaskModal.value = false;
  selectedGroupId.value = 0;
  editMode.value = false;
  v_tasks$.value.$reset();
};

// Selected IDs for editing tasks or groups
const selectedGroupId = ref<number>(0);
const selectedTaskId = ref<number>(0);

// Function to open task modal
const openAddTaskModal = (id: number): void => {
  selectedGroupId.value = id;
  visibleAddTaskModal.value = true;
};

// Function to add or edit a task group
const addTaskGroup = (): void => {
  v_header$.value.$touch(); // Touch all fields to trigger validation
  if (v_header$.value.$invalid) {
    return;
  }

  if (editMode.value) {
    data.value.forEach((item) => {
      if (item.id === selectedGroupId.value) {
        item.header = headerText.value;
      }
    });
  } else {
    data.value.push({
      header: headerText.value,
      id: getRandomInt(5000),
      body: [],
    });
  }

  showSuccess("با موفقیت انجام شد");
  closeAddHeaderModal();
};

// Function to add or edit a task
const addTask = (): void => {
  v_tasks$.value.$touch(); // Touch all fields to trigger validation
  if (v_tasks$.value.$invalid) {
    return;
  }

  if (editMode.value) {
    data.value.forEach((item) => {
      if (item.id === selectedGroupId.value) {
        item.body.forEach((el) => {
          if (el.id === selectedTaskId.value) {
            el.comment = comment.value;
            el.deadline = deadline.value;
          }
        });
      }
    });
  } else {
    data.value.forEach((item) => {
      if (item.id === selectedGroupId.value) {
        item.body.push({
          comment: comment.value,
          createDate: new Date().toDateString(),
          deadline: deadline.value,
          id: getRandomInt(10000),
        });
      }
    });
  }

  closeAddTaskModal();
  showSuccess("با موفقیت انجام شد");
};

// Delete confirmation and actions
const deletedItemId = ref<{ id: number; mode: string }>({ id: 0, mode: "" });

const confirmDelete = (): void => {
  if (deletedItemId.value.mode == "task") {
    data.value.forEach((item) => {
      item.body = item.body.filter((el) => el.id !== deletedItemId.value.id);
    });
  } else if (deletedItemId.value.mode == "header") {
    data.value = data.value.filter(
      (item) => item.id !== deletedItemId.value.id
    );
  } else {
    data.value = [];
  }
  saveStats();
  closeDeleteModal();
  showSuccess("با موفقیت حذف شد");
};

const handleDeleteTask = (id: number): void => {
  deletedItemId.value.id = id;
  deletedItemId.value.mode = "task";
  visibleDeleteModal.value = true;
};

const handleDeleteHeader = (item: TaskGroup): void => {
  deletedItemId.value.id = item.id;
  deletedItemId.value.mode = "header";
  visibleDeleteModal.value = true;
};

const handleDeleteAll = (): void => {
  deletedItemId.value.id = 0;
  deletedItemId.value.mode = "deleteAll";
  visibleDeleteModal.value = true;
};

// Edit handlers for tasks and headers
const handleEditTask = (taskData: { data: Task; groupId: number }): void => {
  console.log(taskData);
  selectedTaskId.value = taskData.data.id;
  openAddTaskModal(taskData.groupId);
  comment.value = taskData.data.comment;
  deadline.value = taskData.data.deadline;
  editMode.value = true;
};

const closeDeleteModal = (): void => {
  deletedItemId.value.id = 0;
  deletedItemId.value.mode = "";
  visibleDeleteModal.value = false;
};

const handleEditHeader = (item: TaskGroup): void => {
  selectedGroupId.value = item.id;
  editMode.value = true;
  headerText.value = item.header;
  visibleAddTaskHeaderModal.value = true;
};
</script>

<template>
  <Toast />
  <div class="helperBtnGroup">
    <Button
      @click="visibleAddTaskHeaderModal = true"
      icon="pi pi-plus"
      aria-label="Add"
      v-tooltip.bottom="'اضافه کردن گروه'"
      class="mrRight"
    />
    <Button
      @click="handleDeleteAll"
      icon="pi pi-trash"
      severity="danger"
      aria-label="delete"
      v-tooltip.bottom="'حذف همه'"
      :disabled="data.length == 0"
    />
  </div>

  <Modal
    @close-modal="closeAddHeaderModal"
    @on-submit="addTaskGroup"
    :is-visible="visibleAddTaskHeaderModal"
    :isEdit="editMode"
    :header="editMode == false ? 'اضافه کردن گروه' : 'ویرایش کردن گروه'"
  >
    <div class="modalBody">
      <div class="customTextInput">
        <label for="headerText" class="required">سر متن</label>
        <InputText
          v-model="headerText"
          dir="rtl"
          id="headerText"
          class="flex-auto"
          autocomplete="off"
        />
        <small class="customError" v-if="v_header$.headerText.$error"
          >سر متن اجباری است</small
        >
      </div>
    </div>
  </Modal>

  <Modal
    @close-modal="closeAddTaskModal"
    @on-submit="addTask"
    :is-visible="visibleAddTaskModal"
    :isEdit="editMode"
    :header="editMode == false ? 'اضافه کردن تسک' : 'ویرایش کردن تسک'"
  >
    <div class="modalBody">
      <div class="customTextInput">
        <label for="comment" class="required">متن</label>
        <InputText
          v-model="comment"
          dir="rtl"
          id="comment"
          class="flex-auto"
          autocomplete="off"
        />
        <small class="customError" v-if="v_tasks$.comment.$error"
          >متن اجباری است</small
        >
      </div>
      <div class="customDatePicker">
        <label for="deadline" class="required">مهلت</label>
        <custom-date-picker
          v-model="deadline"
          class="customDatePicker__input"
          id="deadline"
        />
        <small class="customError" v-if="v_tasks$.deadline.$error"
          >مهلت اجباری است</small
        >
      </div>
    </div>
  </Modal>

  <DeleteModal
    :is-visible="visibleDeleteModal"
    @close-modal="closeDeleteModal"
    @on-submit="confirmDelete"
  />

  <List
    @editHeader="handleEditHeader"
    @deleteHeader="handleDeleteHeader"
    @deleteTask="handleDeleteTask"
    @editTask="handleEditTask"
    @addTask="openAddTaskModal"
  ></List>

  <div class="" v-if="data.length == 0">
    <h1>در حال حاضر آیتمی وجود ندارد</h1>
    <h4>برای اضافه کردن آیتم روی دکمه مثبت کلیک کنید</h4>
  </div>
</template>

<style scoped lang="scss">
.helperBtnGroup {
  position: absolute;
  top: 0;
  left: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transform: translate(15%, 15%);
}
.customTextInput {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  label {
    margin-left: auto;
    margin-bottom: 0.5em;
  }
}

.customDatePicker {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  label {
    margin-left: auto;
    margin-bottom: 0.5em;
  }
}
</style>
