<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- 左侧菜单 -->
    <div class="w-60 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 flex flex-col">
      <!-- Logo区域 -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <i class="fas fa-graduation-cap text-2xl text-blue-400 mr-2"></i>
        <span class="text-xl font-semibold text-gray-600">管理端</span>
      </div>
      <!-- 菜单列表 -->
      <side_menu />
    </div>

    <!-- 右侧内容区 -->
    <div class="flex-1 bg-gray-50">
      <!-- 顶部导航 -->
      <div class="h-16 flex items-center justify-between px-6 bg-white shadow-sm">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-800">{{ currentMenuTitle }}</h1>
          <div class="ml-4 text-sm text-gray-500">共 {{ totalUsers }} 位用户</div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索用户名"
              @keyup.enter="load"
              class="w-64 h-9 pl-10 pr-4 text-sm border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="p-6">
        <div class="bg-white rounded-lg shadow-sm">
          <table class="w-full">
            <thead>
              <tr class="text-sm text-gray-600 border-b">
                <th class="py-4 px-6  font-medium">用户名</th>
                <th class="py-4 px-6  font-medium">邮箱</th>
                <th class="py-4 px-6  font-medium ">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.uid"
                class="border-b last:border-none hover:bg-gray-50"
              >
                <td class="py-4 px-6">
                    <div class="font-medium text-gray-900 text-center">{{ user.nickname }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="text-sm text-gray-500 text-center">{{ user.username }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="handleEdit(user)"
                      class="!rounded-button p-2 text-blue-500 hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="handleDelete(user)"
                      class="!rounded-button p-2 text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 分页 -->
          <div class="flex items-center justify-between px-6 py-4 border-t">
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1),load()"
                :disabled="currentPage === 1"
                class="!rounded-button px-3 py-1 text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-500 whitespace-nowrap"
              >
                <i class="fas fa-chevron-left mr-1"></i>
                上一页
              </button>
              <div class="flex items-center">
                <template v-for="page in displayedPages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="typeof page === 'number' && (currentPage = page, load())"
                    :class="[
                      '!rounded-button w-9 h-9 text-sm border mx-1',
                      currentPage === page
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 hover:border-blue-500 hover:text-blue-500'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="mx-1">{{ page }}</span>
                </template>
              </div>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1), load()"
                :disabled="currentPage === totalPages"
                class="!rounded-button px-3 py-1 text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-500 whitespace-nowrap"
              >
                下一页
                <i class="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑用户弹窗 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">编辑用户信息</h3>
            <button
              @click="closeEditModal"
              class="!rounded-button text-gray-400 hover:text-gray-500"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              v-model="editingUser.nickname"
              required
              class="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              v-model="editingUser.username"
              required
              class="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="editingUser.password"
                required
                class="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入密码"
                disabled = "true"
              />
              <button
                @click="showPassword = !showPassword"
                class="!rounded-button absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="closeEditModal"
            class="!rounded-button px-4 py-2 border border-gray-300 hover:border-gray-400 transition-colors whitespace-nowrap"
          >
            取消
          </button>
          <button
            @click="saveUser"
            class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import side_menu from '@/components/side_menu.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import request from '@/utils/request.js';
import { ElMessage } from 'element-plus';
interface User {
  uid: number;
  nickname: string;
  username: string;
  readonly password?: string;
}




const totalUsers = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const showEditModal = ref(false);
const showPassword = ref(false);
const editingUser = ref<User>({
  uid: 0,
  nickname: '',
  username: '',
  password: ''
});

const users = ref<User[]>();

const searchQuery =ref();

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));


const displayedPages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 7;

  if (totalPages.value <= maxVisiblePages) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  pages.push(1);
  if (currentPage.value > 3) {
    pages.push('...');
  }

  for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(currentPage.value + 1, totalPages.value - 1); i++) {
    pages.push(i);
  }

  if (currentPage.value < totalPages.value - 2) {
    pages.push('...');
  }
  pages.push(totalPages.value);

  return pages;
});

const currentMenuTitle = ref('用户管理');

const showSuccessMessage = (message: string) => {
  alert(message);
};

const showConfirmDialog = (message: string): boolean => {
  return window.confirm(message);
};

const handleEdit = (user: User) => {
  editingUser.value = { ...user };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingUser.value = {
    uid: 0,
    username: '',
    nickname: '',
    password: ''
  };
  showPassword.value = false;
};

//修改用户信息
const saveUser = () => {
  request.put('/users/usersUpdate',editingUser.value).then((res) => {
    if(res.code === '200'){
      ElMessage.success('修改成功');
      closeEditModal();
      load();
    } else{
      ElMessage.error(res.message); 
    }
  });
};

//删除用户
const handleDelete = (user: User) => {
  if (showConfirmDialog(`确定要删除用户 ${user.nickname} 吗？`)) {
    request.delete('/users/usersDelete/'+ user.uid).then((res) =>  {
    if(res.code === '200'){
      ElMessage.success('删除成功');
      load();
    } else{
      ElMessage.error(res.message); 
    }   
    });
  }
};


// 加载用户数据
const load = () => {
  request.get("/users/selectPageUsers",{
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      nickname: searchQuery.value
    }
  }).then((res) =>  {
    if(res.code === '200'){
      users.value = res.data.list;
      totalUsers.value = res.data.total;
    } else{
      ElMessage.error(res.message); 
    }
      
    });
}
load()
</script>

<style scoped>
.menu-item {
  position: relative;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: all 0.3s ease;
}

.menu-item:hover::before {
  background-color: rgba(59, 130, 246, 0.05);
}

.menu-item-active {
  background-color: rgba(59, 130, 246, 0.1);
}

.menu-item-active i,
.menu-item-active span {
  color: #3b82f6;
}
</style>
