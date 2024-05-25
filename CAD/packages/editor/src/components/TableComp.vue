<template>
  <n-table class="header-table-box" :single-line="false" size="small">
    <thead>
      <tr>
        <th></th>
        <th v-for="item in options?.columns" :key="item.title">
          <n-tooltip :style="{ maxWidth: '400px' }" trigger="hover" v-if="item.info">
            <template #trigger>
              {{ item.title }}
            </template>
            {{ item.info }}
          </n-tooltip>
          <div v-else>
            {{ item.title }}
          </div>
        </th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in tableArray" :key="index">
        <td>
          {{ index + 1 }}
        </td>
        <td v-for="columns in options?.columns" :key="columns.title">
          <n-tooltip :style="{ maxWidth: '400px' }" trigger="hover" v-if="(item[columns.key]  && item[columns.key].length > 10)">
            <template #trigger>
              <n-input v-model:value="item[columns.key]" :disabled="options?.editDisabled"
                :placeholder="columns.placeholder ?? ''" type="text" size="small" clearable/>
            </template>
            {{ item[columns.key] ?? '' }}
          </n-tooltip>
          <n-input v-else v-model:value="item[columns.key]" :disabled="options?.editDisabled"
                :placeholder="columns.placeholder ?? ''" type="text" size="small" clearable/>
        </td>
        <td>
          <div style="width: 80px" class="buttons">
            <n-button class="ml-2" type="primary" size="tiny" circle ghost :disabled="options?.editDisabled"
              @click="add(index)">+</n-button>
            <n-button class="ml-2" type="warning" size="tiny" circle ghost
              :disabled="index === 0 && options?.editDisabled" @click="remove(index)">
              -
            </n-button>
            <n-tooltip :style="{ maxWidth: '400px' }" trigger="hover" v-for="(button, idx) in options?.buttons"
              :key="idx">
              <template #trigger>
                <n-button class="ml-2" type="info" size="tiny" circle ghost
                  :disabled="index === 0 && options?.editDisabled" @click="button.click(tableArray, index)">
                  <template #icon>
                    <n-icon>
                      <component :is="button.icon"></component>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ button.info ?? '' }}
            </n-tooltip>

          </div>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
  
<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue'

const emits = defineEmits(['update:modelValue', 'onClick'])

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  options: {
    type: Object,
    required: false
  }
})
const tableArray = reactive<any>([]);
props.modelValue.forEach((element: any) => {
  tableArray.push({...element})
});
watch(
  () => tableArray,
  (newValue) => {
    emits('update:modelValue', newValue);
  },
  { deep: true }
)
// 新增
const add = (index: number) => {
  tableArray.splice(index + 1, 0, {})
}

// 减少
const remove = (index: number) => {
  if (tableArray.length !== 1) {
    tableArray.splice(index, 1)
  }
}

</script>
  
<style lang="scss">
.header-table-box {
  background-color: #0000;
  background-color: rgba(0, 0, 0, 0);

  .n-data-table .n-data-table-td {
    background-color: rgba(0, 0, 0, 0);
  }

}

.header-table-box :deep .n-data-table .n-data-table-td {
  background-color: #0000
}

.header-table-box :deep .add-btn-box {
  width: 100%;
  display: flex;
  justify-content: center
}

.header-table-box :deep .add-btn-box .add-btn {
  width: 300px
}

.ml-2 {
  margin-left: 2px;
}

.buttons {
  display: flex;
}
</style>
  