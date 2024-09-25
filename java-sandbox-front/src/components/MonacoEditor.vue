<script setup lang="ts">
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor'
import { nextTick, ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { compileCode } from '@/api/api'

import { useCodeResultStore } from '@/stores/counter'
const store = useCodeResultStore()

const text = ref('')
const route = useRoute()
const language = ref('go')
const msg = ref()
const loading = ref(false)

let editor: monaco.editor.IStandaloneCodeEditor
onBeforeUnmount(() => {
  editor.dispose()
})

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker()
    }
    return new EditorWorker()
  }
}
const editorInit = () => {
  nextTick(() => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true
    })

    !editor
      ? (editor = monaco.editor.create(document.getElementById('monacoEditor') as HTMLElement, {
          value: text.value, // 编辑器初始显示文字
          language: 'java', // 语言支持自行查阅demo
          automaticLayout: true, // 自适应布局
          theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
          foldingStrategy: 'indentation',
          renderLineHighlight: 'all', // 行亮
          selectOnLineNumbers: true, // 显示行号
          minimap: {
            enabled: false
          },
          readOnly: false, // 只读
          fontSize: 16, // 字体大小
          scrollBeyondLastLine: false, // 取消代码后面一大段空白
          overviewRulerBorder: false // 不要滚动条的边框
        }))
      : editor.setValue('')
    // 监听值的变化
    editor.onDidChangeModelContent((val: any) => {
      text.value = editor.getValue()
    })
  })
}
editorInit()
// @ts-ignore
//切换语言
const changeLanguage = () => {
  monaco.editor.setModelLanguage(editor.getModel(), language.value)

  //  editor.updateOptions({
  //           language: "objective-c"
  //       });
}
//设置一个确认按钮，点击时调用接口
const submitCode = () => {
  compileCode(editor.getValue()).then((res) => {
    store.setResult(res.data?.toString())
  })
}
// editor.setValue(newValue)

// editor.getValue()

// editor.onDidChangeModelContent((val) => {})

// editor.getAction('editor.action.formatDocument').run() //格式化代码

// editor.dispose()
</script>

<template>
  <div class="editor-area">
    <div id="monacoEditor"></div>
    <div id="submitButton" @click="submitCode()">Run</div>
  </div>
</template>

<style scoped>
.editor-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
#monacoEditor {
  height: 80vh;
  width: 45vw;
}

#submitButton {
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: white;
  cursor: pointer;
  background-color: green;
  border: 1px white solid;
  border-radius: 5px;
  margin-left: 5px;
  text-align: center;
}
</style>
