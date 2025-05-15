<template>
    <div class="min-h-screen flex items-center justify-center bg-blue-50">
        <div class="w-[1000px] h-[600px] bg-gray-900 rounded-lg shadow-2xl flex overflow-hidden bg-opacity-95">
            <!-- 左侧图片区域 -->
            <div class="w-1/2 relative overflow-hidden">
                <img :src="leftImageUrl" alt="学习社区" class="w-full h-full object-cover object-top" />
                <div class="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                    <h1 class="text-4xl font-bold mb-4">MiliMili</h1>
                    <h2 class="text-3xl font-bold mb-4">学习社区管理系统</h2>
                </div>
            </div>
            <!-- 右侧深色登录区域 -->
            <div class="w-1/2 p-12 flex flex-col justify-center">
                <div class="mb-12">
                    <h1 class="text-3xl font-bold text-white mb-2">欢迎登录</h1>
                    <p class="text-gray-400">登录后开启您的管理之旅</p>
                </div>
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-300">账号</label>
                        <div class="relative">
                            <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                            <input
                                type="text"
                                v-model="loginForm.username"
                                class="w-full pl-10 pr-4 py-3 border-none bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="请输入账号"
                                required
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-300">密码</label>
                        <div class="relative">
                            <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="loginForm.password"
                                class="w-full pl-10 pr-12 py-3 border-none bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="请输入密码"
                                required
                            />
                            <button
                                type="button"
                                @click="togglePassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 !rounded-button whitespace-nowrap"
                    >
                        登录
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const showPassword = ref(false);
const leftImageUrl = 'https://ai-public.mastergo.com/ai/img_res/b4713f481485b5ef1db418a87acd75c1.jpg';
const router = useRouter();

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const loginForm = ref({
  username: '',
  password: ''
});

const handleLogin = () => {
    // 处理登录逻辑
    request.post("/adminLogin",loginForm.value).then(res => {
        if (res.code === '200') {
            localStorage.setItem("code_user", JSON.stringify(res.data || {}));
            ElMessage.success('登录成功');
            router.push('/home');
          } else {
            ElMessage.error(res.message);
          }
        });
}



</script>

<style scoped>
/* 移除number input的箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>
