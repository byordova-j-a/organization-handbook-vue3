<template>
  <div class="table-handbook">
    <div class="table-handbook__header header" :class="headerClass">
      <div
        v-for="{ title, value, vBind } in headerConfig"
        :key="value"
        class="header-cell"
        v-bind="vBind"
        @click="headerCellClick(value)"
      >
        {{ title }}
      </div>
    </div>

    <TableRow
      v-for="item in items"
      :key="item.id"
      :is-header="false"
      :data="item"
      @delete="componentEmits('deleteItem', item.id)"
      @edit="componentEmits('editItem', item)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  EOrganizationKeys,
  ESortType,
  type TOrganization,
  type TSortOrder,
  type TSortParams,
} from '~/types';
import TableRow from '../ui/TableRow.vue';
import { computed } from 'vue';

type TComponentProps = {
  items: TOrganization[];
  sortParams: TSortParams;
};

const componentEmits = defineEmits<{
  (e: 'deleteItem', id: number): void;
  (e: 'editItem', item: TOrganization): void;
  (e: 'sortItems', type: TSortParams): void;
}>();

const { items, sortParams } = defineProps<TComponentProps>();

const headerClass = computed(
  () => `header_sort${sortParams.order === 1 ? '' : '_reverse'} header_sort_${sortParams.type}`
);

const headerConfig = [
  {
    title: 'Название',
    vBind: { class: 'header-cell_organization' },
    value: EOrganizationKeys.ORGANIZATION,
  },
  {
    title: 'Фио директора',
    vBind: { class: 'header-cell_director' },
    value: EOrganizationKeys.DIRECTOR,
  },
  { title: 'Номер телефона', vBind: {}, value: EOrganizationKeys.PHONE },
  { title: 'Адрес', vBind: {}, value: EOrganizationKeys.ADDRESS },
  { title: '', vBind: {}, value: 'null' },
];

const headerCellClick = (type: string) => {
  if (type !== ESortType.ORGANIZATION && type !== ESortType.DIRECTOR) return;

  let sortType: ESortType = sortParams.type;
  let sortOrder: TSortOrder = sortParams.order;

  if (type === sortParams.type) sortOrder = (-1 * sortParams.order) as TSortOrder;
  else {
    sortType = type;
    sortOrder = 1;
  }
  componentEmits('sortItems', { type: sortType, order: sortOrder });
};
</script>

<style scoped>
.table-handbook {
  display: flex;
  flex-direction: column;
  position: relative;
}
.table-handbook__header {
  display: flex;
  font-family: '18vag';
  font-weight: normal;
  font-size: 24px;
  user-select: none;
  cursor: default;
}

.header_sort_organization .header-cell_organization::after,
.header_sort_director .header-cell_director::after {
  content: '↓';
  display: block;
  position: relative;
  transform: translateY(-10%);
}

.header_sort_reverse.header_sort_organization .header-cell_organization::after,
.header_sort_reverse.header_sort_director .header-cell_director::after {
  transform: rotate(180deg);
}

.header-cell {
  width: 20%;
  word-break: break-all;
  border: 1px solid black;
  border-right: none;
  padding: 15px 20px;
  box-sizing: border-box;
  display: flex;
}

.header-cell:nth-child(4) {
  width: 30%;
}
.header-cell:nth-child(5) {
  width: 10%;
  border-right: 1px solid black;
}
</style>
