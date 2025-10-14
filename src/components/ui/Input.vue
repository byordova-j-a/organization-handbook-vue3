<template>
  <input
    class="input"
    :class="{ input_invalid: inputWasInteracted && !isValid }"
    :type="inputType"
    :placeholder="placeholder"
    :value="modelValue"
    @input="updateInputValue"
    @blur="setValidationDisplay"
    :maxlength="maxLength"
  />
</template>

<script setup lang="ts">
import { PHONE_NUMBER_REGEX, NUMBER_REGEX } from '~/constants';
import { debounce } from 'lodash-es';
import { EInputType } from '~/types';
import { computed, ref, watch } from 'vue';

type TComponentProps = {
  placeholder: string;
  type: EInputType;
  isValid?: boolean;
  resetValidationDisplay?: boolean;
};

const modelValue = defineModel<string>({ required: true });
const componentEmits = defineEmits<{ (e: 'isValid:updated', isValid: boolean): void }>();
const {
  placeholder,
  type,
  isValid = true,
  resetValidationDisplay = false,
} = defineProps<TComponentProps>();

const inputWasInteracted = ref(false);

const inputType = computed(() =>
  type === EInputType.PHONE || EInputType.NUMBER ? EInputType.TEXT : type
);

const maxLength = computed(() => (type === EInputType.NUMBER ? 4 : 255));

const setModelValue = (value: string) => {
  modelValue.value = value;
};

const debouncedSetModelValue = debounce(setModelValue, 400);

const emitEvent = (value: boolean) => {
  componentEmits('isValid:updated', value);
};

const validate = (value: string) => {
  if (type === EInputType.NUMBER) {
    emitEvent(NUMBER_REGEX.test(value));
    return;
  }

  if (type === EInputType.PHONE) {
    emitEvent(PHONE_NUMBER_REGEX.test(value));
  } else {
    emitEvent(!!value.trim());
  }
};

const updateInputValue = (e: Event) => {
  const { value } = e.target as HTMLInputElement;
  if (type === EInputType.SEARCH) {
    debouncedSetModelValue(value);
  } else {
    setModelValue(value);
    validate(value);
  }
};

const setValidationDisplay = () => {
  if (type === EInputType.SEARCH || inputWasInteracted.value) return;
  inputWasInteracted.value = true;
  validate(modelValue.value);
};

watch(
  () => resetValidationDisplay,
  value => {
    if (value) inputWasInteracted.value = false;
  }
);
</script>

<style scoped>
.input {
  font-family: '18vag';
  font-size: 24px;
  line-height: 36px;
  border: 1px solid black;
  padding: 4px 10px;
  box-sizing: border-box;
}
.input_invalid {
  border: 1px solid red;
}
input:focus-visible {
  outline: none;
}
</style>
