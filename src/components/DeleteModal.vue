<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["closeModal", "onSubmit"]);

const confirmModal = () => {
  emits("onSubmit");
};

const closeModal = () => {
  emits("closeModal");
};
</script>

<template>
  <Dialog
    :closable="false"
    v-model:visible="props.isVisible"
    modal
    header=""
    :style="{ width: '25rem' }"
  >
    <template #header>
      <h4>
        {{ "آیا از حذف آیتم مورد نظر اطمینان دارید" }}
      </h4>
    </template>
    <div></div>
    <template #footer>
      <div style="margin-right: 2em; width: 100%" class="">
        <Button
          label="حذف"
          outlined
          severity="danger
        "
          @click="confirmModal"
          autofocus
        />
        <Button
          label="انصراف"
          text
          severity="secondary"
          @click="closeModal"
          autofocus
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.modalBtn {
  margin-right: 2em;
  width: 100%;
}
</style>
