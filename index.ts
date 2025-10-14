import { defineStore } from 'pinia';
import { type TOrganization, type TSortParams } from '~/types';
import { data } from '~/store/data';
const ruCollator = new Intl.Collator('ru-RU');
let initialData = data;

export const useOrgatnizationsStore = defineStore('organizations', {
  state: (): { organizationList: TOrganization[]; unicId: number; totalItems: number } => {
    return {
      organizationList: [],
      unicId: initialData.length + 1,
      totalItems: initialData.length,
    };
  },

  getters: {
    getTotalItems: state => state.totalItems,
    getOrganizationList: state => state.organizationList,
  },
  actions: {
    fetchOrganizationList(page: number, sortParam: TSortParams, filterValue: string) {
      const regex = new RegExp(filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      const { type, order } = sortParam;

      const list = initialData
        .filter(({ director }) => regex.test(director))
        .sort((a, b) => order * ruCollator.compare(a[type], b[type]));

      this.totalItems = list.length;

      this.organizationList = list.slice((page - 1) * 10, page * 10);
    },
    addOrganization(newOrganizationData: Omit<TOrganization, 'id'>) {
      const newOrganization = { ...newOrganizationData, id: this.unicId };
      initialData.push(newOrganization);
      this.unicId++;
      this.totalItems++;
    },
    updateOrganization(updatedOrganization: TOrganization) {
      initialData = initialData.map(organization => {
        if (organization.id === updatedOrganization.id) return updatedOrganization;
        return organization;
      });
    },

    deleteOrganization(id: number) {
      initialData = initialData.filter(organization => organization.id !== id);
      this.totalItems--;
    },
  },
});
