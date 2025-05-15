<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

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
    <div class="flex-1 bg-gray-50 p-6">
      <!-- 顶部搜索和操作区 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <div class="text-2xl font-semibold text-gray-800">管理员管理</div>
          <span class="text-sm text-gray-500">共 {{ totalItems }} 位用户</span>
        </div>
        <div class="flex space-x-4">
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="搜索管理员..." @keyup.enter="load" class="pl-10 pr-4 py-2 border-none bg-white rounded-lg shadow-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
          <button @click="showAddModal = true" class="!rounded-button flex items-center px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 shadow-sm whitespace-nowrap">
            <i class="fas fa-plus mr-2"></i>
            添加管理员
          </button>
        </div>
      </div>

      <!-- 管理员列表 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 text-left">
                <th class="px-6 py-4 text-sm font-medium text-gray-600">管理员</th>
                <th class="px-6 py-4 text-sm font-medium text-gray-600">账号</th>
                <th class="px-6 py-4 text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="admin in adminList" class="border-t border-gray-100">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-800">{{ admin.nickname }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ admin.username }}</td>
                <td class="px-6 py-4">
                  <div class="flex space-x-3">
                    <button 
                      class="edit-btn !rounded-button text-blue-500 hover:text-blue-600 whitespace-nowrap relative"
                      @click="handleEdit(admin)"
                      @mouseenter="handleEditHover($event, true)"
                      @mouseleave="handleEditHover($event, false)">
                      <i class="fas fa-edit transform transition-transform duration-300" :class="{'scale-hover': isEditHovered}"></i>
                      <div class="edit-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-all duration-300">
                        编辑管理员
                      </div>
                    </button>
                    <button
                      class="delete-btn !rounded-button text-red-500 hover:text-red-600 whitespace-nowrap relative"
                      @click="showDeleteConfirm(admin)"
                      @mouseenter="handleDeleteHover($event, true)"
                      @mouseleave="handleDeleteHover($event, false)">
                      <i class="fas fa-trash-alt transform transition-transform duration-300" :class="{'scale-hover': isDeleteHovered}"></i>
                      <div class="delete-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-all duration-300">
                        删除管理员
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <div class="flex space-x-2">
            <button @click="currentPage > 1 && (currentPage--)"
              :class="['!rounded-button whitespace-nowrap px-3 py-1 text-sm border', currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500']">
              上一页
            </button>
            <button class="!rounded-button px-3 py-1 text-sm border border-blue-500 text-blue-500 whitespace-nowrap">
              {{ currentPage }}
            </button>
            <button @click="currentPage < totalPages && (currentPage++)"
              :class="['!rounded-button whitespace-nowrap px-3 py-1 text-sm border', currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500']">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加管理员弹窗 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[480px] shadow-xl" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">添加管理员</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="px-6 py-4">
            <form @submit.prevent="add">
            <div class="space-y-4">
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input type="text" v-model="formData.nickname" required
                class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="block text-sm font-medium text-red-500 mb-1" >请输入用户名</p>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" v-model="formData.username" required
                class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="block text-sm font-medium text-red-500 mb-1"> 请输入有效的邮箱</p>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input type="password" v-model="formData.password" required
                class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <p class="block text-sm font-medium text-red-500 mb-1" >请输入密码</p>
                <p class="block text-sm font-medium text-red-500 mb-1">密码至少需要 6 个字符</p>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeModal"
              class="!rounded-button px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 whitespace-nowrap">
              取消
              </button>
              <button type="submit":disabled="submitButtonDisabled"
              class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap">
              确认添加
              </button>
            </div>
            </form>
        </div>
      </div>
    </div>

    <!-- 编辑管理员弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[480px] shadow-xl" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">编辑管理员</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="handleEditSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input type="text" v-model="editFormData.nickname" required
                  class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input type="text" v-model="editFormData.username" required
                  class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input type="password" v-model="editFormData.password" placeholder="如需修改密码请输入新密码"
                  class="w-full px-3 py-2 border-none bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeEditModal"
                class="!rounded-button px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 whitespace-nowrap">
                取消
              </button>
              <button type="submit"
                class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap">
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[400px] shadow-xl" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">确认删除</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-600">确定要删除管理员 <span class="font-medium text-gray-900">{{ selectedAdmin?.nickname }}</span> 吗？此操作无法撤销。</p>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="!rounded-button px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 whitespace-nowrap">
              取消
            </button>
            <button
              @click="confirmDelete(selectedAdmin?.uid)"
              class="!rounded-button px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 whitespace-nowrap">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import side_menu from '@/components/side_menu.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { email, maxLength, required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const activeMenu = ref('admin');
const searchQuery = ref('');
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);pageSize
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedAdmin = ref<any>(null);
const isDeleteHovered = ref(false);
const isEditHovered = ref(false);

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

interface FormData {
  uid:number;
  nickname: string;
  username: string;
  password: string;
}

const formData = ref<FormData>({
  uid:0,
  nickname: '',
  username: '',
  password: ''
});

// 校验的规则，需要注意上面的三个注意事项
const rules = computed(() => {
  return {
    // required: 必填项, maxLength: 最大长度不超过函数参数的值, email: 符合电子邮箱的格式
    // sameAs: 与某项必须一致（参数填formData里面的属性）
    nickname: { required, maxLength: maxLength(20) },
    username: { required, email },
    password: {required,maxLength: maxLength(25),minLength: minLength(3)},
  };
});

const $v = useVuelidate(rules, formData);

const submitButtonDisabled = computed(() => {
  $v.value.$validate();
  return $v.value.$error;
});

const editFormData = ref<FormData>({
  uid:0,
  nickname: '',
  username: '',
  password: null
});

const adminList = ref<FormData[]>([]);

const handleEdit = (admin: any) => {
  selectedAdmin.value = {
    uid:admin.uid,
    nickname: admin.nickname
  }
  editFormData.value = {
    uid:admin.uid,
    nickname: admin.nickname,
    username: admin.username,
    password: admin.password
  };
  showEditModal.value = true;
};

//修改管理员
const handleEditSubmit = () => {
  request.put('/users/usersUpdate',editFormData.value).then((res) => {
    if(res.code === '200'){
      ElMessage.success('修改成功');
      closeEditModal();
      load();
    } else{
      ElMessage.error(res.message); 
    }
  });
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedAdmin.value = null;
  editFormData.value = {
    uid:0,
    nickname: '',
    username: '',
    password: ''
  };
};

const handleEditHover = (event: MouseEvent, isHovered: boolean) => {
  const btn = event.currentTarget as HTMLElement;
  const tooltip = btn.querySelector('.edit-tooltip') as HTMLElement;
  
  if (isHovered) {
    isEditHovered.value = true;
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    isEditHovered.value = false;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translate(-50%, 5px)';
  }
};

const handleDeleteHover = (event: MouseEvent, isHovered: boolean) => {
  const btn = event.currentTarget as HTMLElement;
  const tooltip = btn.querySelector('.delete-tooltip') as HTMLElement;
  
  if (isHovered) {
    isDeleteHovered.value = true;
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    isDeleteHovered.value = false;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translate(-50%, 5px)';
  }
};

// 显示删除确认弹窗
const showDeleteConfirm = (admin: any) => {
  showDeleteModal.value = true;
  selectedAdmin.value = admin;
};

// 确认删除管理员
const confirmDelete = (uid) => {
  if (selectedAdmin.value) {
    request.delete('/users/usersDelete/'+ uid).then((res) =>  {
    if(res.code === '200'){
      ElMessage.success('删除成功');
      load();
      showDeleteModal.value = false;
      selectedAdmin.value = null;
    } else{
      ElMessage.error(res.message); 
    }   
    });
  }
};

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false;
  formData.value = {
    uid:0,
    nickname: '',
    username: '',
    password: ''
  };
};

//添加管理员
const add = () => {
  request.post('/users/adminAdd', formData.value).then((res) => {
    if(res.code === '200'){
      ElMessage.success('添加成功');
      closeModal();
      load();
    } else{
      ElMessage.error(res.message); 
    }
  });
};

// 加载用户数据
const load = () => {
  request.get("/users/selectPageAdmin",{
    params: {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      nickname: searchQuery.value
    }
  }).then((res) =>  {
    if(res.code === '200'){
      adminList.value = res.data.list;
      totalItems.value = res.data.total;
    } else{
      ElMessage.error(res.message); 
    }
      
    });
};
load();
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

.delete-btn,
.edit-btn {
  position: relative;
  z-index: 1;
}

.delete-tooltip,
.edit-tooltip {
  pointer-events: none;
  transform: translate(-50%, 5px);
  z-index: 10;
}

.scale-hover {
  transform: scale(1.2);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

