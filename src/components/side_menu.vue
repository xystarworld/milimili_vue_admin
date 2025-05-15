<template>
    <div class="flex-1 py-4 space-y-2 overflow-y-auto">
                <div
                    v-for="(item, index) in menuItems"
                    :key="index"
                    :class="[
                        'menu-item group flex items-center h-12 px-4 cursor-pointer transition-all duration-300',
                        { 'menu-item-active': activeMenu === item.id }
                    ]"
                    @click="handleMenuClick(item.id)"
                >
                    <div
                        class="w-1 h-6 transition-all duration-300 rounded-r-full"
                        :class="activeMenu === item.id ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500/50'"
                    ></div>
                    <div class="flex items-center flex-1 ml-3">
                        <i :class="[item.icon, 'w-5 text-center transition-transform duration-300 group-hover:scale-110']"></i>
                        <span class="ml-3 transition-colors duration-300">{{ item.name }}</span>
                    </div>
                </div>
            </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeMenu = ref('');
const currentMenuTitle = ref('');
const menuItems = [
    { id: 'home', name: '首页', icon: 'fas fa-tachometer-alt' },
    { id: 'video', name: '视频审核', icon: 'fas fa-video' },
    { id: 'document', name: '资料审核', icon: 'fas fa-folder' },
    { id: 'post', name: '帖子审核', icon: 'fas fa-file-alt' },
    { id: 'admin', name: '管理员管理', icon: 'fas fa-user-shield' },
    { id: 'user', name: '用户管理', icon: 'fas fa-users' },
    { id: 'my', name: '我的', icon: 'fas fa-user-circle' },
];




const handleMenuClick = (menuId) => {
    activeMenu.value = menuId;
    const menu = menuItems.find(item => item.id === menuId);
    if (menu) {
        currentMenuTitle.value = menu.name;
        router.push({ name: menuId });
    }
};
</script>

<style scoped>

</style>