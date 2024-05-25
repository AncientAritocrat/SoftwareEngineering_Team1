<template>
  <div ref="container" :style="editorStyle"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch} from 'vue';
import { useResizeObserver, useDebounceFn } from '@vueuse/core';
// Import monaco
// https://github.com/vitejs/vite/discussions/1791
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import vjmapTs from 'vjmap/dist/vjmap.d.ts?raw'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  style: {
    type: Object,
    required: false,
    default: () => {
      return {
        height: '300px',
        width: '100%'
      }
    }
  },
  isDark: {
    type: Boolean,
    required: false,
    default: true
  },
  wordWrap: {
    type: Boolean,
    required: false,
    default: true
  },
  minimap: {
    type: Boolean,
    required: false,
    default: true
  },
  lineNumbers: {
    type: Boolean,
    required: false,
    default: true
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false
  },
  language: {
    type: String,
    required: false,
    default: 'json'
  },
  height: {
    type: Number,
    required: false,
    default: 0
  }
})
const editorStyle = ref(props.style);
if (props.height) {
  editorStyle.value.height = props.height + "px"
}

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
const container = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor;
// eslint-disable-next-line vue/no-setup-props-destructure
const isDark = props.isDark;
// eslint-disable-next-line vue/no-setup-props-destructure
const language = props.language;
const emit = defineEmits(['update:modelValue', 'change']);

onMounted(() => {
  // extra libraries
  monaco.languages.typescript.javascriptDefaults.addExtraLib(vjmapTs, 'ts:vjmap.d.ts');

  // 把map做为全局对象加入
  let mapDefine = `
  declare var map:vjmap.Map;
  `
  monaco.languages.typescript.javascriptDefaults.addExtraLib(mapDefine, 'ts:map.d.ts');

  editor = monaco.editor.create(container.value!, {
    language: language,
    theme: isDark ? 'vs-dark' : 'vs',
    automaticLayout: true,
    minimap: {
      enabled: props.minimap ? true : false
    },
    smoothScrolling: true,
    scrollBeyondLastLine: false,
    contextmenu: true,
    wordWrap: props.wordWrap ? 'on' : 'off',
    formatOnPaste: true,
    readOnly: props.readOnly,
    lineNumbers: props.lineNumbers ?  "on" : "off"
  });
  editor.setValue(props.modelValue);
  emit('change', editor.getValue());
  editor.onDidChangeModelContent(
    useDebounceFn(() => {
      emit('change', editor.getValue());
      emit('update:modelValue', editor.getValue());
    }, 500)
  );
});

const editorObserver = useResizeObserver(container, () => {
  editor.layout();
});
onUnmounted(() => {
  editor?.dispose();
  editorObserver.stop();
});

const setValue = (value: string) => {
  editor.setValue(value);
}

const getValue = () => {
  return editor.getValue();
}

defineExpose(
  {
    setValue,
    getValue
  }
)
</script>