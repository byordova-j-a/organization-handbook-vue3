<template>
  <Blackout v-show="isShown">
    <div class="organization-form">
      <div class="organization-form__heading">{{ heading }}</div>
      <div
        class="organization-form__field"
        v-for="({ field, label, placeholder, type }, idx) in formFieldsConfig"
        :key="idx"
      >
        <div class="organization-form__field-label">{{ label }}</div>
        <Input
          class="organization-form__field-input"
          :placeholder="placeholder"
          :type="type"
          :reset-validation-display="resetValidationDisplay"
          :is-valid="isFormFieldsValid[field]"
          v-model="formValues[field]"
          @isValid:updated="
            validationState => {
              updateFieldValidationState(field, validationState);
            }
          "
        />
      </div>
      <div class="organization-form__buttons">
        <Button text="Отмена" :color="EColor.RED" @click="close"></Button>
        <Button text="Подтвердить" @click="confirm" :disabled="!isValid"></Button>
      </div>
    </div>
  </Blackout>
</template>

<script setup lang="ts">
import { EAddressKeys, EColor, EInputType, EOrganizationKeys, type TOrganization } from '~/types';
import Blackout from '../ui/Blackout.vue';
import Input from '../ui/Input.vue';
import { computed, ref, watch } from 'vue';
import Button from '../ui/Button.vue';
import { isEqual } from 'lodash-es';

type TFormFiledsKeys =
  | EAddressKeys.CITY
  | EAddressKeys.STREET
  | EAddressKeys.HOUSE
  | EOrganizationKeys.DIRECTOR
  | EOrganizationKeys.ORGANIZATION
  | EOrganizationKeys.PHONE;

type TFormFields = { [key in TFormFiledsKeys]: string };
type TFormFiledsValidation = { [key in TFormFiledsKeys]: boolean };

type TFormFiledConfig = {
  field: TFormFiledsKeys;
  placeholder: string;
  label: string;
  type: EInputType;
};

const initialFormFields: TFormFields = {
  [EOrganizationKeys.ORGANIZATION]: '',
  [EOrganizationKeys.DIRECTOR]: '',
  [EOrganizationKeys.PHONE]: '',
  [EAddressKeys.CITY]: '',
  [EAddressKeys.STREET]: '',
  [EAddressKeys.HOUSE]: '',
};

const initialFormFieldsNegativeValidation: TFormFiledsValidation = {
  [EOrganizationKeys.ORGANIZATION]: false,
  [EOrganizationKeys.DIRECTOR]: false,
  [EOrganizationKeys.PHONE]: false,
  [EAddressKeys.CITY]: false,
  [EAddressKeys.STREET]: false,
  [EAddressKeys.HOUSE]: false,
};

const initialFormFieldsPositiveValidation: TFormFiledsValidation = {
  [EOrganizationKeys.ORGANIZATION]: true,
  [EOrganizationKeys.DIRECTOR]: true,
  [EOrganizationKeys.PHONE]: true,
  [EAddressKeys.CITY]: true,
  [EAddressKeys.STREET]: true,
  [EAddressKeys.HOUSE]: true,
};

const isShown = defineModel<boolean>('isShown', { required: true });

const { data } = defineProps<{ data: TOrganization | null }>();

const componentEmits = defineEmits<{
  (e: 'addItem', newItem: Omit<TOrganization, 'id'>): void;
  (e: 'editItem', editedItem: TOrganization): void;
  (e: 'close'): void;
}>();

const formValues = ref<TFormFields>({
  ...initialFormFields,
});

const resetValidationDisplay = ref(false);
const isFormFieldsValid = ref<TFormFiledsValidation>({ ...initialFormFieldsNegativeValidation });

const formFieldsConfig = ref<TFormFiledConfig[]>([
  {
    field: EOrganizationKeys.ORGANIZATION,
    placeholder: 'ООО "ЫЫЫ"',
    label: 'Название:',
    type: EInputType.TEXT,
  },
  {
    field: EOrganizationKeys.DIRECTOR,
    placeholder: 'Сидоров А.А',
    label: 'ФИО директора:',
    type: EInputType.TEXT,
  },
  {
    field: EOrganizationKeys.PHONE,
    placeholder: '+7-800-555-35-35',
    label: 'Номер телефона:',
    type: EInputType.PHONE,
  },
  {
    field: EAddressKeys.CITY,
    placeholder: 'Москва',
    label: 'Город:',
    type: EInputType.TEXT,
  },
  {
    field: EAddressKeys.STREET,
    placeholder: 'Грибоедова',
    label: 'Улица:',
    type: EInputType.TEXT,
  },
  {
    field: EAddressKeys.HOUSE,
    placeholder: '10',
    label: 'Дом:',
    type: EInputType.NUMBER,
  },
]);

const isValid = computed(() => Object.values(isFormFieldsValid.value).every(value => !!value));
const heading = computed(() => `${data ? 'Редактировать' : 'Добавить'} организацию`);

const updateFieldValidationState = (field: TFormFiledsKeys, state: boolean) => {
  isFormFieldsValid.value[field] = state;
};

const close = () => {
  componentEmits('close');
};

const confirm = () => {
  if (!isValid.value) return;
  const item = {
    [EOrganizationKeys.ORGANIZATION]: formValues.value[EOrganizationKeys.ORGANIZATION].trim(),
    [EOrganizationKeys.DIRECTOR]: formValues.value[EOrganizationKeys.DIRECTOR].trim(),
    [EOrganizationKeys.PHONE]: formValues.value[EOrganizationKeys.PHONE].trim(),
    [EOrganizationKeys.ADDRESS]: {
      [EAddressKeys.CITY]: formValues.value[EAddressKeys.CITY].trim(),
      [EAddressKeys.STREET]: formValues.value[EAddressKeys.STREET].trim(),
      [EAddressKeys.HOUSE]: +formValues.value[EAddressKeys.HOUSE],
    },
  };
  if (data) {
    const { id, ...dataWithoutId } = data;

    const isDataChanged = !isEqual(dataWithoutId, item);
    if (!isDataChanged) {
      componentEmits('close');
      return;
    }
    componentEmits('editItem', { ...item, id: data.id });
  } else {
    componentEmits('addItem', item);
  }
};

watch(
  () => isShown.value,
  value => {
    if (value) {
      resetValidationDisplay.value = false;
      formValues.value = data
        ? {
            [EOrganizationKeys.ORGANIZATION]: data[EOrganizationKeys.ORGANIZATION],
            [EOrganizationKeys.DIRECTOR]: data[EOrganizationKeys.DIRECTOR],
            [EOrganizationKeys.PHONE]: data[EOrganizationKeys.PHONE],
            [EAddressKeys.CITY]: data[EOrganizationKeys.ADDRESS][EAddressKeys.CITY],
            [EAddressKeys.STREET]: data[EOrganizationKeys.ADDRESS][EAddressKeys.STREET],
            [EAddressKeys.HOUSE]: data[EOrganizationKeys.ADDRESS][EAddressKeys.HOUSE].toString(),
          }
        : { ...initialFormFields };

      isFormFieldsValid.value = data
        ? { ...initialFormFieldsPositiveValidation }
        : { ...initialFormFieldsNegativeValidation };
    } else resetValidationDisplay.value = true;
  }
);
</script>

<style scoped>
.organization-form {
  font-family: '18vag';
  font-size: 24px;
  user-select: none;
  width: 820px;
  height: 500px;
  background-color: white;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 20px;
}

.organization-form__heading {
  font-size: 28px;
  align-self: center;
}

.organization-form__field {
  display: flex;
  align-items: center;
}

.organization-form__field-label {
  width: 220px;
}

.organization-form__field-input {
  flex-grow: 1;
}

.organization-form__buttons {
  display: flex;
  justify-content: space-between;
}
</style>
