<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.png" />
            <div class="title">和风 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="150px">
      <div>
        <a-space>
          <a-dropdown trigger="hover" :popup-max-height="false">
            <a-button @click="login"
              >{{ store.state.user?.loginUser?.userName ?? "未登录" }}
              <icon-down />
            </a-button>
            <template #content>
              <a-doption @click="swapAccount">
                <icon-swap />
                切换账号
              </a-doption>
              <a-doption @click="exit">
                <icon-import />
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { IconDown, IconImport, IconSwap } from "@arco-design/web-vue/es/icon";

import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "和风",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const exit = async () => {
  const data = await UserControllerService.userLogoutUsingPost();
  if (data.data) {
    message.success("退出登陆成功");
    store.state.user.loginUser = undefined;
  } else {
    message.error("退出登陆失败，" + data.message);
  }
};

const swapAccount = () => {
  router.push({
    path: "/user/login",
  });
};

const login = () => {
  // alert("进入login方法");
  // alert(store.state.user.loginUser.userName);
  //只有在未登录时，才会跳转到登录界面
  if (
    !store.state.user.loginUser ||
    store.state.user.loginUser.userName == "未登录"
  ) {
    // alert("跳转到登录");
    router.push({
      path: "/user/login",
    });
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
