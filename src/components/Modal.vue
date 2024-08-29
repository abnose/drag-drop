<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    required: true,
  },
  header: {
    type: String,
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
    :style="{ width: '25rem' }"
  >
    <template #header>
      <h4>
        {{ props.header }}
      </h4>
    </template>
    <slot></slot>
    <div class="modalBody"></div>
    <template #footer>
      <div class="modalBtn">
        <Button
          :label="props.isEdit ? 'ویرایش' : 'ایجاد'"
          outlined
          severity="primary"
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
