<template>
  <div id="addQuestionView">
    <h2>{{ `${updatePage ? "修改题目" : "创建题目"}` }}</h2>

    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="form.tags"
          placeholder="请输入标签，按回车生成一个标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
        <a-tooltip content="生成前请确保【题目内容】完整，提高回答准确率">
          <a-button
            type="outline"
            shape="round"
            style="margin-left: 30px"
            @click="getAIAnswer"
            :loading="answerBtnLoading"
          >
            <icon-robot />&nbsp;AI生成
          </a-button>
        </a-tooltip>
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              as
              number
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="judgeCase" label="判题用例">
        <a-textarea
          v-model="form.judgeCase"
          placeholder="请输入判题用例"
          auto-size="true"
          style="max-width: 700px"
        />
        <a-tooltip content="生成前请确保【题目内容】完整，提高回答准确率">
          <a-button
            type="outline"
            shape="round"
            style="margin-left: 30px"
            @click="getAICase"
            :loading="caseBtnLoading"
          >
            <icon-robot />&nbsp;AI生成
          </a-button>
        </a-tooltip>
        <!--        <a-drawer-->
        <!--          :width="340"-->
        <!--          :visible="caseVisible"-->
        <!--          @ok="caseHandleOK"-->
        <!--          @cancel="caseHandleCancel"-->
        <!--          unmountOnClose-->
        <!--        >-->
        <!--          <template #title>AI生成结果：判题用例</template>-->
        <!--          <div>-->
        <!--            {{ aiResponse }}-->
        <!--          </div>-->
        <!--          <div style="position: absolute; top: 100px">-->
        <!--            {{ "按确定键写入" }}-->
        <!--          </div>-->
        <!--        </a-drawer>-->
      </a-form-item>
      <a-form-item field="pre_code" label="前置代码（核心代码模式的main方法）">
        <a-textarea
          v-model="form.pre_code"
          placeholder="请输入前置代码"
          auto-size="true"
          style="max-width: 600px"
        />
        <a-tooltip content="生成前请确保【题目内容】完整，提高回答准确率">
          <a-button
            type="outline"
            shape="round"
            style="margin-left: 30px"
            @click="getAIPre"
            :loading="preBtnLoading"
          >
            <icon-robot />&nbsp;AI生成
          </a-button>
        </a-tooltip>
      </a-form-item>
      <a-form-item
        field="after_code"
        label="后置代码（核心代码模式的默认代码）"
      >
        <a-textarea
          v-model="form.after_code"
          placeholder="请输入后置代码"
          auto-size="true"
          style="max-width: 600px"
        />
        <a-tooltip content="生成前请确保【题目内容】完整，提高回答准确率">
          <a-button
            type="outline"
            shape="round"
            style="margin-left: 30px"
            @click="getAIAfter"
            :loading="afterBtnLoading"
          >
            <icon-robot />&nbsp;AI生成
          </a-button>
        </a-tooltip>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>

    <!--四个抽屉-->
    <!--    1.判题用例结果抽屉-->
    <a-drawer
      :width="340"
      :visible="caseVisible"
      @ok="caseHandleOK"
      @cancel="caseHandleCancel"
      unmountOnClose
    >
      <template #title>AI生成结果：判题用例</template>
      <div>
        {{ aiCaseResponse }}
      </div>
      <div style="margin-top: 30px">
        {{ "按确定键写入" }}
      </div>
    </a-drawer>
    <!--    2.前置代码结果抽屉-->
    <a-drawer
      :width="340"
      :visible="preVisible"
      @ok="preHandleOK"
      @cancel="preHandleCancel"
      unmountOnClose
    >
      <template #title>AI生成结果：前置代码</template>
      <div>
        {{ "【AI生成可能会有错误，请仔细查看】" }}
      </div>
      <div style="margin-top: 30px">
        {{ aiPreResponse }}
      </div>
      <div style="margin-top: 30px">
        {{ "【按确定键写入】" }}
      </div>
    </a-drawer>
    <!--    3.后置代码结果抽屉-->
    <a-drawer
      :width="340"
      :visible="afterVisible"
      @ok="afterHandleOK"
      @cancel="afterHandleCancel"
      unmountOnClose
    >
      <template #title>AI生成结果：后置代码</template>
      <div>
        {{ "【AI生成可能会有错误，请仔细查看】" }}
      </div>
      <div style="margin-top: 30px">
        {{ aiAfterResponse }}
      </div>
      <div style="margin-top: 30px">
        {{ "【按确定键写入】" }}
      </div>
    </a-drawer>
    <!--    4.答案结果抽屉-->
    <a-drawer
      :width="340"
      :visible="answerVisible"
      @ok="answerHandleOK"
      @cancel="answerHandleCancel"
      unmountOnClose
    >
      <template #title>AI生成结果：答案</template>
      <div>
        {{ "【AI生成可能会有错误，请仔细查看】" }}
      </div>
      <div style="margin-top: 30px">
        {{ aiAnswerResponse }}
      </div>
      <div style="margin-top: 30px">
        {{ "【按确定键写入】" }}
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import {
  QuestionControllerService,
  AiControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

import { IconRobot } from "@arco-design/web-vue/es/icon";

// import { IconDown, IconImport, IconSwap } from "@arco-design/web-vue/es/icon";

// 开始
// import { createApp } from "vue";
// import ArcoVue from "@arco-design/web-vue";
// // 额外引入图标库
// import ArcoVueIcon from "@arco-design/web-vue/es/icon";
// import App from "../../App.vue";
// import "@arco-design/web-vue/dist/arco.css";
//
// const app = createApp(App);
// app.use(ArcoVue);
// app.use(ArcoVueIcon);
// app.mount("#app");
// 结束

interface JudgeConfig {
  memoryLimit: number;
  stackLimit: number;
  timeLimit: number;
}

// interface judgeCase {
//   input: number;
//   output: number;
// }

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content:
    "## 题目详情\n" +
    "\n" +
    "## 示例1\n" +
    "**输入**：\n" +
    "\n" +
    "**输出**：\n" +
    "## 示例2\n" +
    "**输入**：\n" +
    "\n" +
    "**输出**：\n" +
    "\n" +
    "## 输入格式",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: '[{"input":"","output":""},{"input":"","output":""}]',
  pre_code: "",
  after_code: "",
  // judgeCase: [
  //   {
  //     input: "a",
  //     output: "b",
  //   },
  // ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionEditVoByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = '[{"input":"","output":""}]';
    } else {
      // form.value.judgeCase = form.value.judgeCase.toString();
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 500,
        stackLimit: 500,
        timeLimit: 500,
      };
    } else {
      // form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
      form.value.judgeConfig.memoryLimit = parseInt(
        form.value.judgeConfig.memoryLimit.toString()
      );
      form.value.judgeConfig.stackLimit = parseInt(
        form.value.judgeConfig.stackLimit.toString()
      );
      form.value.judgeConfig.timeLimit = parseInt(
        form.value.judgeConfig.timeLimit.toString()
      );
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      // form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const router = useRouter();

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功，正在跳转到首页...");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功，正在跳转到首页...");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
  router.push({
    path: "/",
  });
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  // form.value.judgeCase.push({
  //   input: "",
  //   output: "",
  // });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  // form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

//以下是ai相关
//1.判题用例
const caseVisible = ref(false); //抽屉可视化开关
const caseBtnLoading = ref(false); //按钮加载状态开关
const aiCaseResponse = ref(""); //ai生成结果

const getAICase = async () => {
  //前后设置按钮状态
  caseBtnLoading.value = true;
  //发送请求
  const res = await AiControllerService.getJudgeCaseUsingPost(
    form.value.content,
    12
  );
  //得到结果，写入抽屉变量
  aiCaseResponse.value = res;
  //展示抽屉
  caseVisible.value = true;
  caseBtnLoading.value = false;
};

const caseHandleOK = () => {
  //写入
  form.value.judgeCase = JSON.stringify(aiCaseResponse.value);
  caseVisible.value = false;
};

const caseHandleCancel = () => {
  caseVisible.value = false;
};

//2. 前置代码
const preVisible = ref(false); //抽屉可视化开关
const preBtnLoading = ref(false); //按钮加载状态开关
const aiPreResponse = ref("这是ai生成结果"); //ai生成结果

const getAIPre = async () => {
  //前后设置按钮状态
  preBtnLoading.value = true;
  //发送请求
  const res = await AiControllerService.getPreCodeUsingPost(form.value.content);
  //得到结果，写入抽屉变量
  aiPreResponse.value = res;
  //展示抽屉
  preVisible.value = true;
  preBtnLoading.value = false;
};

const preHandleOK = () => {
  //写入
  form.value.pre_code = aiPreResponse.value.toString();
  preVisible.value = false;
};

const preHandleCancel = () => {
  preVisible.value = false;
};

//3. 后置代码
const afterVisible = ref(false); //抽屉可视化开关
const afterBtnLoading = ref(false); //按钮加载状态开关
const aiAfterResponse = ref("这是ai生成结果"); //ai生成结果

const getAIAfter = async () => {
  //前后设置按钮状态
  afterBtnLoading.value = true;
  //发送请求
  const res = await AiControllerService.getAfterCodeUsingPost(
    form.value.content
  );
  //得到结果，写入抽屉变量
  aiAfterResponse.value = res;
  //展示抽屉
  afterVisible.value = true;
  afterBtnLoading.value = false;
};

const afterHandleOK = () => {
  //写入
  form.value.after_code = aiAfterResponse.value.toString();
  afterVisible.value = false;
};

const afterHandleCancel = () => {
  afterVisible.value = false;
};

//4. 答案
const answerVisible = ref(false); //抽屉可视化开关
const answerBtnLoading = ref(false); //按钮加载状态开关
const aiAnswerResponse = ref("这是ai生成结果"); //ai生成结果

const getAIAnswer = async () => {
  //前后设置按钮状态
  answerBtnLoading.value = true;
  //发送请求
  const res = await AiControllerService.getAnswerUsingPost(form.value.content);
  //得到结果，写入抽屉变量
  aiAnswerResponse.value = res;
  //展示抽屉
  answerVisible.value = true;
  answerBtnLoading.value = false;
};

const answerHandleOK = () => {
  //写入
  form.value.answer = aiAnswerResponse.value.toString();
  answerVisible.value = false;
};

const answerHandleCancel = () => {
  answerVisible.value = false;
};
</script>

<style scoped>
#addQuestionView {
}
</style>
