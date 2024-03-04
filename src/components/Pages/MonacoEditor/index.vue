<template>
  <div ref="el" class="go-editor-area" :style="{ width, height }"></div>
  <EditorWorker></EditorWorker>
</template>

<script lang="ts" setup>
import { onMounted, watch, PropType } from "vue";
import { useMonacoEditor } from "./index.hook";
import { EditorWorker } from "./index";

const props = defineProps({
  width: {
    type: String as PropType<string>,
    default: "100%"
  },
  height: {
    type: String as PropType<string>,
    default: "90vh"
  },
  language: {
    type: String as PropType<string>,
    default: "typescript"
  },
  preComment: {
    type: String as PropType<string>,
    default: ""
  },
  modelValue: {
    type: String as PropType<string>,
    default: ""
  },
  editorOptions: {
    type: Object as PropType<object>,
    default: () => ({})
  }
});

const emits = defineEmits(["blur", "update:modelValue"]);

const { el, updateVal, getEditor, createEditor } = useMonacoEditor(props.language);

const updateMonacoVal = (_val?: string) => {
  const { modelValue, preComment } = props;
  const val = preComment ? `${preComment}\n${_val || modelValue}` : _val || modelValue;
  updateVal(val);
};

onMounted(() => {
  const monacoEditor = createEditor(props.editorOptions);
  monacoEditor!.onDidChangeModelContent(() => {
    emits("update:modelValue", monacoEditor!.getValue());
  });
  monacoEditor!.onDidBlurEditorText(() => {
    emits("blur");
  });
  updateMonacoVal();
});

watch(
  () => props.modelValue,
  (val: string) => {
    val !== getEditor()?.getValue() && updateMonacoVal(val);
  }
);
</script>

<style lang="scss" scoped>
.go-editor-area {
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 0;
  overflow: hidden;
  background-color: rgb(0 0 0 / 0%);
  border-radius: 4px;

  @include deep {
    .margin,
    .monaco-editor,
    .inputarea.ime-input {
      background-color: rgb(0 0 0 / 0%);
    }
    .monaco-editor-background {
      background-color: rgb(0 0 0 / 0%);

      @include fetch-bg-color("filter-color-shallow");
    }
    .margin {
      @include fetch-bg-color("filter-color-shallow");
    }
  }
}
</style>
