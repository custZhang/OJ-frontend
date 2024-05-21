<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入题号" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
      column-resizable
      :bordered="{ cell: false }"
    >
      <template #judgeInfo="{ record }">
        <div>
          {{ JSON.stringify(record.judgeInfo) }}
        </div>
      </template>
      <template #status="{ record }">
        <a-tooltip :content="record.judgeInfo.message" position="top">
          <a-tag checkable :color="getColor(record.status)"
            >{{ getStatus(record.status) }}
          </a-tag>
        </a-tooltip>
      </template>
      <template #memory="{ record }">
        {{ record.judgeInfo.memory ? record.judgeInfo.memory : 0 }} KB
      </template>
      <template #time="{ record }">
        {{ record.judgeInfo.time ? record.judgeInfo.time : 0 }} ms
      </template>
      <template #createTime="{ record }">
        <div>
          <!--          {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}-->
          {{
            moment
              // .utc(record.createTime)
              .tz(record.createTime, "Asia/Shanghai")
              .format("YYYY-MM-DD HH:mm")
          }}
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
// import moment from "moment";
import moment from "moment-timezone";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const getStatus = (value: number) => {
  switch (value) {
    case 0:
      return "等待中";
    case 1:
      return "判题中";
    case 2:
      return "答案正确";
    case 3:
      return "执行异常";
    case 4:
      return "部分错误";
    case 5:
      return "答案错误";
    default:
      return "";
  }
};

const getColor = (value: number) => {
  switch (value) {
    case 0:
      return "grey";
    case 1:
      return "cyan";
    case 2:
      return "green";
    case 3:
      return "red";
    case 4:
      return "orangered";
    case 5:
      return "red";
    default:
      return "green";
  }
};

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "questionVO.title",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
  },
  {
    title: "占用内存",
    slotName: "memory",
  },
  {
    title: "运行时间",
    slotName: "time",
  },
  // {
  //   title: "运行信息",
  //   slotName: "message",
  // },
  {
    title: "提交者",
    dataIndex: "userVO.userName",
  },
  {
    title: "提交时间",
    dataIndex: "createTime",
    slotName: "createTime",
    width: 155,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
