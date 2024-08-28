<script setup lang="ts">
import Button from 'primevue/button';
import { ref, watch  } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import dataStore from './store/crud';
import { getRandomInt ,handleDate } from "./utils/util";
import InputText from 'primevue/inputtext';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Modal from './components/Modal.vue';
import DeleteModal from './components/DeleteModal.vue';

// Define the types for data items
interface Task {
  comment: string;
  createDate: string;
  deadline: string;
  id: number;
}

interface TaskGroup {
  header: string;
  id: number;
  body: Task[];
}

// Using the store
const store = dataStore();

// Toast functionality
const toast = useToast();
const showSuccess = (text: string): void => {
    toast.add({ severity: 'success', summary: 'موفق', detail: text, life: 3000 });
};

// Initial header setup
const headerText = ref<string>('');
const headerRules = {
  headerText: { required },
};
const v_header$ = useVuelidate(headerRules, { headerText });

// Initial task setup
const comment = ref<string>('');
const deadline = ref<string>('');
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

watch(data.value, async () => {
  store.saveData(data.value);
});


// Close modals and reset validation
const closeAddHeaderModal = (): void => {
  headerText.value = '';
  visibleAddTaskHeaderModal.value = false;
  editMode.value = false;
  v_header$.value.$reset();
};

const closeAddTaskModal = (): void => {
  comment.value = '';
  deadline.value = '';
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
    console.log('Form submitted:', { headerText: headerText.value });
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

  showSuccess('با موفقیت انجام شد');
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
  showSuccess('با موفقیت انجام شد');
};


// Delete confirmation and actions
const deletedItemId = ref<number>();

const confirmDelete = (): void => {
  data.value.forEach((item) => {
    item.body = item.body.filter(el => el.id !== deletedItemId.value);
  });
  closeDeleteModal();
  showSuccess('با موفقیت حذف شد');
};

const handleDeleteTask = (id: number): void => {
  deletedItemId.value = id;
  visibleDeleteModal.value = true;
};

// Edit handlers for tasks and headers
const handleEditTask = (taskData: Task, groupId: number): void => {
  selectedTaskId.value = taskData.id;
  openAddTaskModal(groupId);
  comment.value = taskData.comment;
  deadline.value = taskData.deadline;
  editMode.value = true;
};

const closeDeleteModal = (): void => {
  deletedItemId.value = 0;
  visibleDeleteModal.value = false;
};

const handleEditHeader = (item: TaskGroup): void => {
  selectedGroupId.value = item.id;
  editMode.value = true;
  headerText.value = item.header;
  visibleAddTaskHeaderModal.value = true;
};

// Method to use in the template
const remainingDays = (deadline: string): { message: string, isPast: boolean } => {
  // Create a new Date object for now and normalize it to midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Create a new Date object for the deadline and normalize it to midnight
  const deadlineDate = new Date(deadline);
  const deadlineDay = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());

  // Calculate the difference in milliseconds
  const differenceInMs = deadlineDay.getTime() - today.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  console.log(differenceInDays);
  // Determine the message and whether it's past
  if (differenceInDays > 0) {
    return {
      message: `${differenceInDays} روز باقی مانده`,
      isPast: false,
    };
  } else if (differenceInDays === 0) {
    return {
      message: `تاریخ امروز است`,
      isPast: false,
    };
  } else {
    return {
      message: `تاریخ گذشته است`,
      isPast: true,
    };
  }
};

const showingDate = (createDate: string) : string => {  
 return handleDate(createDate)
}

</script>

<template>
  <Toast />
  <div class="helperBtnGroup">
    <Button  @click="visibleAddTaskHeaderModal = true" icon="pi pi-plus" aria-label="Save" />
  </div>

  <Modal @close-modal="closeAddHeaderModal" @on-submit="addTaskGroup" :is-visible="visibleAddTaskHeaderModal" :isEdit="editMode" :header="editMode == false ? 'اضافه کردن گروه' :'ویرایش کردن گروه'">
    <div class="modalBody">
      <div class="customTextInput">
          <label for="headerText" class="required">سر متن</label>
          <InputText v-model="headerText" dir="rtl" id="headerText" class="flex-auto" autocomplete="off" />
          <small class="customError" v-if="v_header$.headerText.$error">سر متن اجباری است</small>
      </div>
    </div>
  </Modal>

   <Modal 
    @close-modal="closeAddTaskModal" 
    @on-submit="addTask" 
    :is-visible="visibleAddTaskModal" 
    :isEdit="editMode" :header="editMode == false ? 'اضافه کردن تسک' : 'ویرایش کردن تسک'">
     <div class="modalBody">
      <div class="customTextInput">
          <label for="comment" class="required">متن</label>
          <InputText v-model="comment" dir="rtl" id="comment" class="flex-auto" autocomplete="off" />
          <small class="customError" v-if="v_tasks$.comment.$error">متن اجباری است</small>
      </div>
      <div class="customDatePicker">
          <label for="deadline" class="required">مهلت</label>
         <custom-date-picker
            v-model="deadline"
            class="customDatePicker__input"
            id="deadline"
          />
          {{ }}
          <small class="customError" v-if="v_tasks$.deadline.$error">مهلت اجباری است</small>
      </div>
    </div>
  </Modal>

  <DeleteModal :is-visible="visibleDeleteModal" @close-modal="closeDeleteModal" @on-submit="confirmDelete" />



  <div class="mainContainer">
    <div v-for="item in data" class="customCard">
      <h1 class="customCard__header">{{ item.header }}</h1>
      <div class="customHeaderBtnContainer">
        <Button @click="handleEditHeader(item)" icon="pi pi-pencil" severity="warn" aria-label="pencil" />
      </div>
      <VueDraggableNext  class="customCard__body"  v-model="item.body" tag="div" group="tasks" :animation="100">
        <span v-if="!item.body?.length">
          بنداز اینجا
        </span>
        <template v-for="element in item.body"">
          <div class="task" :style="[remainingDays(element.deadline).isPast ? {background: 'red'} : {background: '#f4ff8f'}]">
      
                  <div class="customCard__body--btnContainer">
            <Button @click="handleDeleteTask(element.id)" icon="pi pi-trash" severity="danger" aria-label="trash" />
            <Button @click="handleEditTask(element , item.id)" icon="pi pi-pencil" severity="warn" aria-label="pencil" />
          </div>
                <p>
              {{ element.comment }}
            </p>
            <small>{{ remainingDays(element.deadline).message }}</small>
            <small>{{ showingDate(element.createDate) }}</small>
            
          </div>
          <!-- {{ new Date(element.deadline) }} {{ new Date()}} -->
          
        </template>
      </VueDraggableNext>
      <div  @click="openAddTaskModal(item.id)" class="customCard__addBtn"><p>
        +
      </p>
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
  // background: red;
}
.customHeaderBtnContainer {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(5px ,-15px);
}
.customCard {
  // background: red;
  border: 1px solid snow;
  /* From https://css.glass */
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
margin: 1.75em .2em;
  &__header {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(-20% , -85%);
    background: gold;
    font-size: 1.15em;
    border-radius: 5px;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .25em .75em;
  }
   &__body {
     background: rgba(223, 223, 223, 0.199);
     width: 90%;
     // background: red;
     display: flex;
     justify-content: center;
     margin: 1em;
     border-radius: 10px;
     padding: 1em;
    align-items: center;
    flex-direction: column;
    &--btnContainer {
      display: flex;
      margin-right: auto;
      Button {
        margin: .1em;
      }
    }
  }
  &__addBtn {
    background: green;
    width: 90%;
    height: 35px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px ;
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
      background: greenyellow;
      color: black;
    }
  }
}
.modalBody {
  margin-top: -1em;
}
.helperBtnGroup {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transform: translate(15% ,15%);
}
.customTextInput {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  label {
    margin-left: auto;
    margin-bottom: .5em;
  }
}
.form-control {
  font-family: 'irancell' !important;
  padding: 1em !important;
}

.form-control::placeholder {
  font-family: 'irancell' !important;
  color: red
}
.customDatePicker {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  label {
    margin-left: auto;
    margin-bottom: .5em;
  }
}
.task {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  list-style: none;
  padding: 8px;
  margin: 4px 0;
  // background-color: #f4ff8f;
  color: black;
  border-radius: 4px;
  cursor: grab;
  width: 80%;
}

.customError {
  color: rgb(248, 107, 131);
  margin-top: .5em;
}
</style>
