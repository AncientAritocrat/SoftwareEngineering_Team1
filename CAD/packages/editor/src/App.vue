<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
     <n-layout class="layout">
       <n-layout-header class="layout-header">
         <HeaderView @onTheme="onTheme"/>
       </n-layout-header>
       <n-layout-content class="layout-content">
          <RouterView />
       </n-layout-content>
     </n-layout>
  </n-message-provider>
 </n-config-provider>
 <Message></Message>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from 'vue-router'
import { darkTheme } from 'naive-ui'
import HeaderView from "@/views/HeaderView.vue"
import { useAppStore } from "@/stores/app";
import Message from "@/components/Message.vue";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";
import formCreate from "@form-create/naive-ui"
import FormGroup from '@/components/FormGroup'
import TableComp from "@/components/TableComp.vue";
import MonacoEditor from "@/components/MonacoEditor.vue";
import ExprComp from '@/components/ExprComp'
formCreate.component('tableComp', TableComp);
formCreate.component('formGroup', FormGroup);
formCreate.component('monacoEditor', MonacoEditor);
formCreate.component('exprComp', ExprComp);
const app = useAppStore();
const theme = ref<BuiltInGlobalTheme | null>(app.lightTheme ? null : darkTheme);

const onTheme = () => {
   if(theme.value === null) {
     theme.value = darkTheme;
     app.setTheme(false);
     return
   }
   theme.value = null
   app.setTheme(true);
 }
</script>


<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .layout-header {
    flex: none;
    height: 34px;
  }
  .layout-content {
    flex: 1;
  }
}

</style>
