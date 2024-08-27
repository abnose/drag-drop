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


  <div class="mainContainer">

    <div v-for="item in data" class="customCard">
      <h1 class="customCard__header">{{ item.header }}</h1>
      <VueDraggableNext  class="customCard__body"  v-model="item.body" tag="div" group="tasks" :animation="100">
        <span v-if="!item.body?.length">
          بنداز اینجا
        </span>
        <template v-for="element in item.body"">
          <div class="task">{{ element.comment }}</div>
        </template>
      </VueDraggableNext>
      <div class="customCard__addBtn">+</div>
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
width: 24.6%;
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
  }
  &__addBtn {
    background: rgb(95, 95, 95);
    width: 80%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px ;
    position: absolute;
    bottom: 0;
    transform: translate(0, 100%);
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
  background-color: #f4ff8f;
  color: black;
  border-radius: 4px;
  cursor: grab;
  width: 80%;
}
</style>
