<script setup lang="ts">
import { ref , watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

// Define the meals and yuckyMeals arrays
const data = ref(
  [
    { header: 'header 1',
      id: 1, 
    body :[
      {comment: 'comment 1 1', createDate: '1 1' , deadline: '1 1'},
      {comment: 'comment 1 2', createDate: '1 2' , deadline: '1 2'},
      {comment: 'comment 1 3', createDate: '1 3' , deadline: '1 3'},
      {comment: 'comment 1 4', createDate: '1 4' , deadline: '1 4'},
    ]},
    { header: 'header 2',
      id: 2, 
    body :[
      {comment: 'comment 2 1', createDate: '2 1' , deadline: '2 1'},
      {comment: 'comment 2 2', createDate: '2 2' , deadline: '2 2'},
      {comment: 'comment 2 3', createDate: '2 3' , deadline: '2 3'},
      {comment: 'comment 2 4', createDate: '2 4' , deadline: '2 4'},
    ]}
])

watch(data.value, async () => {
  console.log(data.value)
})



</script>

<template>
  <div v-for="item in data" class="">

    <h1>{{ item.header }}</h1>
    <VueDraggableNext  v-model="item.body" tag="ul" group="meals" :animation="100">
     <template v-for="element in item.body"">
        <li>{{ element.comment }}</li>
      </template>
    </VueDraggableNext>
  </div>

</template>

<style scoped>
li {
  list-style: none;
  padding: 8px;
  margin: 4px 0;
  background-color: #6d3c3c;
  border-radius: 4px;
  cursor: grab;
}
</style>
