<template>
  <div class="page">
    <Button :color="EColor.RED" text="Добавить" @click="openModal(null)" />
    <Input :type="EInputType.SEARCH" placeholder="Найти по ФИО..." v-model="filterInputValue" />

    <TableHandbook
      :sort-params="sortParams"
      :items="organizationList"
      @deleteItem="deleteOrganization"
      @sortItems="sortItems"
      @editItem="openModal"
    />
    <PageSwitcher
      :totalPages="totalPages"
      @click="fetchOrganizationList"
      v-model:currentPage="currentPage"
    />
    <OrganizationForm
      v-model:is-shown="isModalShown"
      :data="editedItem"
      @add-item="addItem"
      @edit-item="editItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { EColor, EInputType, ESortType, type TOrganization, type TSortParams } from '~/types';
import { ref, computed, watch } from 'vue';
import Button from '~/components/ui/Button.vue';
import Input from '~/components/ui/Input.vue';
import PageSwitcher from '~/components/ui/PageSwitcher.vue';
import TableHandbook from '~/components/entities/TableHandbook.vue';
import { useOrgatnizationsStore } from '~/store/index';
import OrganizationForm from '~/components/widgets/OrganizationForm.vue';

const store = useOrgatnizationsStore();

const currentPage = ref(1);
const sortParams = ref<TSortParams>({
  type: ESortType.ORGANIZATION,
  order: 1,
});
const filterInputValue = ref('');

const isModalShown = ref(false);
const editedItem = ref<TOrganization | null>(null);

const organizationList = computed(() => store.getOrganizationList);
const totalPages = computed(() => Math.trunc((store.getTotalItems - 1) / 10) + 1);

const fetchOrganizationList = () => {
  store.fetchOrganizationList(currentPage.value, sortParams.value, filterInputValue.value);
};

const sortItems = (params: TSortParams) => {
  const { type, order } = params;

  sortParams.value = { type, order };
};

const deleteOrganization = (id: number) => {
  store.deleteOrganization(id);
  if (totalPages.value < currentPage.value) currentPage.value--;
  fetchOrganizationList();
};

const closeModal = () => {
  isModalShown.value = false;
  editedItem.value = null;
};

const addItem = (newItem: Omit<TOrganization, 'id'>) => {
  closeModal();

  store.addOrganization(newItem);
  fetchOrganizationList();
};

const openModal = (item: TOrganization | null) => {
  if (item) editedItem.value = item;
  isModalShown.value = true;
};

const editItem = (item: TOrganization) => {
  closeModal();

  store.updateOrganization(item);
  fetchOrganizationList();
};

watch(
  [() => sortParams.value, () => filterInputValue.value],
  () => {
    currentPage.value = 1;
    fetchOrganizationList();
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}
</style>
