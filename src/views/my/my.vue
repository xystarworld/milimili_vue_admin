<template>
    <div class="min-h-screen flex bg-gray-100">
        <!-- Left menu -->
        <div class="w-60 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 flex flex-col">
            <!-- Logo area -->
            <div class="h-16 flex items-center justify-center border-b border-gray-200">
                <i class="fas fa-graduation-cap text-2xl text-blue-400 mr-2"></i>
                <span class="text-xl font-semibold text-gray-600">管理端</span>
            </div>
            <!-- Menu list -->
            <side_menu />
        </div>
        <!-- Right content area -->
        <div class="flex-1 bg-gray-50">
            <!-- Top navigation -->
            <div class="h-16 px-6 flex items-center border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-700">{{ currentMenuTitle }}</h2>
            </div>
            <!-- Profile content area -->
            <div class="p-6 space-y-6">
                <!-- Profile card -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-start space-x-6">
                        <div class="flex-1">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h3 class="text-xl font-medium text-gray-800">
                                        <span v-if="!isEditing">{{ userInfo.user.nickname }}</span>
                                        <input v-else type="text" v-model="editingInfo.nickname"
                                            class="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                                    </h3>
                                    <div class="mt-6 space-y-6">
                                        <div class="flex items-center mb-6">
                                            <i class="fa fa-address-card text-gray-400 mr-2 text-xl"></i>
                                            <span v-if="!isEditing" class="text-gray-600 text-xl">{{ userInfo.user.username }}</span>
                                            <input v-else type="email" v-model="editingInfo.username"
                                                class="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                                        </div>
                                        <div class="flex items-center mb-6">
                                            <i class="fas fa-lock text-gray-400 mr-2 text-xl"></i>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-gray-600 text-xl">密码</span>
                                                <button @click="showPasswordModal = true"
                                                    class="!rounded-button px-3 py-1 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center space-x-1 whitespace-nowrap">
                                                    <i class="fas fa-key text-xs"></i>
                                                    <span>修改密码</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button v-if="!isEditing" @click="startEditing"
                                        class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
                                        <i class="fas fa-edit"></i>
                                        <span>编辑资料</span>
                                    </button>
                                    <template v-else>
                                        <button @click="saveChanges"
                                            class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
                                            <i class="fas fa-check"></i>
                                            <span>保存</span>
                                        </button>
                                        <button @click="cancelEditing"
                                            class="!rounded-button px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center space-x-2 whitespace-nowrap">
                                            <i class="fas fa-times"></i>
                                            <span>取消</span>
                                        </button>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Password modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[400px] p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-medium text-gray-800">修改密码</h3>
                <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                    <div class="relative">
                        <input type="password" v-model="currentPassword"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="请输入当前密码">
                        <i class="fas fa-eye absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            @click="togglePasswordVisibility('current')"></i>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                    <div class="relative">
                        <input type="password" v-model="newPassword"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="请输入新密码">
                        <i class="fas fa-eye absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            @click="togglePasswordVisibility('new')"></i>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                    <div class="relative">
                        <input type="password" v-model="confirmPassword"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="请再次输入新密码">
                        <i class="fas fa-eye absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            @click="togglePasswordVisibility('confirm')"></i>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button @click="showPasswordModal = false"
                    class="!rounded-button px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors whitespace-nowrap">取消</button>
                <button @click="handleChangePassword"
                    class="!rounded-button px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap">确认修改</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import side_menu from '@/components/side_menu.vue';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import request from '@/utils/request';
    import { ElMessage } from 'element-plus';
import router from '@/router';

    const showPasswordModal = ref(false);
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const isEditing = ref(false);

    const userInfo = reactive({
        user: JSON.parse(localStorage.getItem("code_user")||"{}")
    })

    const editingInfo = ref({
        uid : userInfo.user.uid,
        nickname: userInfo.user.nickname,
        username: userInfo.user.username,
        password:''
    });

    
    const currentMenuTitle = ref('我的');



    const startEditing = () => {
        editingInfo.value = { ...userInfo.user.value };
        isEditing.value = true;
    };

    const saveChanges = () => {
        if (!editingInfo.value.nickname || !editingInfo.value.username) {
            alert('请填写完整信息');
            return;
        }
        isEditing.value = false;
        editingInfo.value.uid= userInfo.user.uid;
        request .put('/users/usersUpdate',editingInfo.value ).then((res) => {
            if(res.code === '200'){
                ElMessage.success('修改成功');
                router.push('/')
            } else{
                ElMessage.error(res.message); 
        }
    })
    };

    const cancelEditing = () => {
        isEditing.value = false;
        editingInfo.value = { ...userInfo.user.value };
    };



    const togglePasswordVisibility = (field: string) => {
        const input = document.querySelector(`input[type="password"][placeholder*="${field === 'current' ? '当前' : field === 'new' ? '新' : '再次'}"]`) as HTMLInputElement;
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    };

    const handleChangePassword = () => {
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            alert('请填写完整的密码信息');
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            alert('两次输入的新密码不一致');
            return;
        }
        
        editingInfo.value.uid= userInfo.user.uid;
        editingInfo.value.password = newPassword.value;
        showPasswordModal.value = false;
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        request .put('/users/usersUpdate',editingInfo.value ).then((res) => {
            if(res.code === '200'){
                ElMessage.success('修改成功');
                router.push('/')
            } else{
                ElMessage.error(res.message); 
        }
    })
    };
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
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
