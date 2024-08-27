<script setup lang="ts">
import Button from 'primevue/button';
import { ref , watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import dataStore from './store/crud'
import { getRandomInt } from "./utils/util";
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const store = dataStore()
const headerText = ref<string>('')
const visible = ref(false);
// Define the meals and yuckyMeals arrays
// const data = ref(
//   [
//     { header: 'header 1',
//       id: 1, 
//     body :[
//       {comment: 'comment 1 1', createDate: '1 1' , deadline: '1 1'},
//       {comment: 'comment 1 2', createDate: '1 2' , deadline: '1 2'},
//       {comment: 'comment 1 3', createDate: '1 3' , deadline: '1 3'},
//       {comment: 'comment 1 4', createDate: '1 4' , deadline: '1 4'},
//     ]},
//     { header: 'header 2',
//       id: 2, 
//     body :[
//       {comment: 'comment 2 1', createDate: '2 1' , deadline: '2 1'},
//       {comment: 'comment 2 2', createDate: '2 2' , deadline: '2 2'},
//       {comment: 'comment 2 3', createDate: '2 3' , deadline: '2 3'},
//       {comment: 'comment 2 4', createDate: '2 4' , deadline: '2 4'},
//     ]}
// ])

const data = ref(store.storedData)

watch(data.value, async () => {
  store.saveData(data.value)
})

const closeAddHeaderSidebar= () => {
  headerText.value = ''
  visible.value = false

}

const addTaskGroup = () => {
  data.value.push(
    { 
      header: headerText.value,
      id: getRandomInt(5000), 
      body :[]
    }
  )
  closeAddHeaderSidebar()
}

const test = ref()

</script>

<template>
  <!-- <Button class="customBtn">+</Button> -->
   <div class="helperBtnGroup">
     <Button  @click="visible = true" icon="pi pi-plus" aria-label="Save" />
  </div>

<Dialog v-model:visible="visible" modal header="" :style="{ width: '25rem' }">
    <template #header>
        <h4>
            {{ 'اضافه کردن گروه' }}
        </h4>
    </template>
    <div class="modalBody">

      <div class="customTextInput">
          <label for="deadLine" class="font-semibold w-24">سر متن</label>
          <InputText v-model="headerText" dir="rtl" id="headerText" class="flex-auto" autocomplete="off" />
      </div>
      <!-- <div class="customDatePicker">
          <label for="email" class="font-semibold w-24">مهلت</label>
         <custom-date-picker
            v-model="test"
            class="customDatePicker__input"
          />
      </div> -->
    </div>
    <template #footer>
      <div style="margin-right: 2em; width: 100%;" class="">
        <Button label="ذخیره" outlined severity="primary" @click="addTaskGroup" autofocus />
        <Button label="انصراف" text severity="secondary" @click="visible = false" autofocus />
      </div>
    </template>
</Dialog>


  
  <div v-for="item in data" class="">

    <h1>{{ item.header }}</h1>
    <VueDraggableNext  v-model="item.body" tag="ul" group="meals" :animation="100">
     <template v-for="element in item.body"">
        <li>{{ element.comment }}</li>
      </template>
    </VueDraggableNext>
  </div>

</template>

<style scoped lang="scss">
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
li {
  list-style: none;
  padding: 8px;
  margin: 4px 0;
  background-color: #6d3c3c;
  border-radius: 4px;
  cursor: grab;
}
</style>
