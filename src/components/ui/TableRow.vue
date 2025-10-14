<template>
  <div class="table-row" @click="editItem">
    <div v-for="(data, idx) in rowData" :key="idx" class="table-row__cell">
      {{ data }}
    </div>
    <div class="table-row__cell" @click.stop="deleteItem">{{ CROSS }}</div>
  </div>
</template>

<script setup lang="ts">
import { type TOrganization } from '~/types';
import { computed } from 'vue';
import { CROSS } from '~/constants';

type TComponentProps = {
  data: TOrganization;
};

const { data } = defineProps<TComponentProps>();
const componentEmits = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const rowData = computed(() => {
  const { organization, director, phone, address } = data;
  return [
    organization,
    director,
    phone,
    `г. ${address.city}, ул. ${address.street}, д. ${address.house}`,
  ];
});

const deleteItem = () => {
  componentEmits('delete');
};

const editItem = () => {
  componentEmits('edit');
};
</script>

<style scoped>
.table-row {
  display: flex;
  width: 100%;
  font-family: '18vag';
  font-weight: normal;
  font-size: 20px;
  cursor: default;
}

.table-row__cell {
  width: 20%;
  word-break: break-all;
  padding: 10px 20px;
  box-sizing: border-box;
}

.table-row__cell:nth-child(4) {
  width: 30%;
}
.table-row__cell:nth-child(5) {
  width: 10%;
  justify-content: center;
  user-select: none;
  border-right: 1px solid black;
  cursor: pointer;
}

.table-row__cell {
  border: 1px solid black;
  border-right: none;
  display: flex;
  align-items: center;
}

.table-row__cell {
  border-top: none;
}
.table-row:hover {
  background-color: rgb(183, 183, 224);
}
</style>
