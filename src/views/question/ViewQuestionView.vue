<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '200px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            field="codeMode"
            label="答题模式"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.codeMode"
              :style="{ width: '200px' }"
              placeholder="选择答题模式"
              @change="handleCodeModeChange"
            >
              <a-option>ACM模式</a-option>
              <a-option>核心代码模式</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          ref="codeEditor"
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-divider size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit">
          提交代码
        </a-button>
        <a-button
          type="outline"
          style="margin-left: 30px"
          @click="getAITip"
          :loading="tipBtnLoading"
        >
          <icon-robot />&nbsp;AI提示
        </a-button>
        <div style="margin-top: 30px">
          <a-typography-text>
            {{ tip }}
          </a-typography-text>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  watchEffect,
  withDefaults,
  defineProps,
  defineComponent,
  toRaw,
} from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  AiControllerService,
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import { IconRobot } from "@arco-design/web-vue/es/icon";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

// const editor = ref<CodeEditor | null>(null);
// const editor = ref<InstanceType<typeof CodeEditor> | null>(null);

const codeEditor = ref(null);

// 当更改答题模式时
const handleCodeModeChange = () => {
  if (form.value.codeMode === "ACM模式") {
    // form.value.code = ""; // 设置为空字符串或者其他值
    if (codeEditor.value) {
      codeEditor.value.changeValue("");
    }
  } else if (form.value.codeMode === "核心代码模式") {
    // form.value.code = question.value?.after_code; // 设置核心代码的默认值
    if (codeEditor.value) {
      codeEditor.value.changeValue(question.value?.after_code);
    }
  }
};

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
  codeMode: "ACM模式",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string | undefined) => {
  form.value.code = value;
};
//ai部分
const tip = ref("");

const tipBtnLoading = ref(false);

const getAITip = async () => {
  // alert(question.value?.content as string);
  //前后设置按钮状态
  tipBtnLoading.value = true;
  //发送请求
  const res = await AiControllerService.getTipUsingPost(
    question.value?.content as string
  );
  // const res = "示例结果";
  //得到结果，写入提示区
  tip.value = res;
  tipBtnLoading.value = false;
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
