<template>
  <div
    class="button"
    :class="[{ button_disabled: disabled }, `button_${color}`]"
    @click="clickHandler"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { EColor } from '~/types';

type TComponentProps = {
  text: string;
  disabled?: boolean;
  color?: EColor;
};

const { disabled = false, text, color = EColor.BLUE } = defineProps<TComponentProps>();
const componentEmits = defineEmits<{ (e: 'click'): void }>();

const clickHandler = () => {
  if (disabled) return;
  componentEmits('click');
};
</script>

<style scoped>
.button {
  padding: 10px 20px;
  width: min-content;
  border-radius: 10px;
  user-select: none;
  cursor: pointer;
  text-wrap: nowrap;
  background-color: #b6c6ec;
  font-family: '18vag';
  font-weight: normal;
  font-size: 20px;
}

.button_disabled {
  pointer-events: none;
  background-color: #9799a1;
}

.button_blue:not(.button_disabled) {
  background-color: #b6c6ec;
}

.button_blue:not(.button_disabled):hover {
  background-color: rgb(138, 166, 227);
}

.button_red:not(.button_disabled) {
  background-color: #f0593a;
}

.button_red:not(.button_disabled):hover {
  background-color: #e23a19;
}
</style>
