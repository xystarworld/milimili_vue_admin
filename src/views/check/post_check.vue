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
            <!-- 顶部搜索栏 -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                    <h2 class="text-2xl font-semibold text-gray-800">帖子审核</h2>
                    <div class="ml-4 px-3 py-1 bg-blue-100 rounded-full">
                        <span class="text-sm text-blue-600">共 {{ filteredPosts.length }} 条帖子</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input type="text" v-model="searchQuery" placeholder="搜索帖子内容、作者" class="w-64 h-10 pl-10 pr-4 rounded-lg border-none bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <div class="relative">
                        <button @click="toggleFilterMenu" class="flex items-center px-4 h-10 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors duration-200 !rounded-button whitespace-nowrap">
                            <i class="fas fa-filter mr-2"></i>
                            <span class="text-sm">{{ selectedFilter.label }}</span>
                        </button>
                        <div v-if="showFilterMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                            <div v-for="filter in filters" :key="filter.value"
                                :class="[
                                    'px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer',
                                    filter.value === selectedFilter.value ? 'text-blue-500 bg-blue-50' : 'text-gray-700'
                                ]"
                                @click="selectFilter(filter)">
                                {{ filter.label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 帖子列表 -->
            <div class="bg-white rounded-lg shadow">
                <div class="grid grid-cols-12 py-3 px-6 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
                    <div class="col-span-4">帖子标题</div>
                    <div class="col-span-2">作者</div>
                    <div class="col-span-2">发布时间</div>
                    <div class="col-span-2">状态</div>
                    <div class="col-span-2 text-center">操作</div>
                </div>
                <div v-for="post in displayedPosts" :key="post.postid" class="grid grid-cols-12 py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <div class="col-span-4">
                        <div class="text-gray-900">{{ post.title }}</div>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <span class="text-sm text-gray-700">{{ post.nickname }}</span>
                    </div>
                    <div class="col-span-2 flex items-center text-sm text-gray-500">
                        {{ post.updatetime }}
                    </div>
                    <div class="col-span-2 flex items-center">
                        <span :class="[
                            'px-2 py-1 text-xs rounded-full',
                            post.status === 0 ? 'bg-yellow-100 text-yellow-700' :
                            post.status === 1 ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                        ]">
                            {{ statusMap[post.status] }}
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center justify-center space-x-2">
                        <button @click="handleApprove(post.postid)" class="p-2 text-green-600 hover:bg-green-50 rounded !rounded-button whitespace-nowrap">
                            <i class="fas fa-check"></i>
                        </button>
                        <button @click="handleReject(post.postid)" class="p-2 text-red-600 hover:bg-red-50 rounded !rounded-button whitespace-nowrap">
                            <i class="fas fa-times"></i>
                        </button>
                        <button @click="showPostDetail(post.postid)" class="p-2 text-blue-600 hover:bg-blue-50 rounded !rounded-button whitespace-nowrap">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="flex items-center justify-between mt-6">
                <div class="flex items-center space-x-2">
                    <button
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed !rounded-button whitespace-nowrap">
                        上一页
                    </button>
                    <div class="flex items-center space-x-1">
                        <button
                            v-for="page in displayPages"
                            :key="page"
                            @click="changePage(page)"
                            :class="[
                                'w-10 h-10 rounded-lg text-sm font-medium !rounded-button whitespace-nowrap',
                                currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            ]">
                            {{ page }}
                        </button>
                    </div>
                    <button
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed !rounded-button whitespace-nowrap">
                        下一页
                    </button>
                </div>
            </div>
        </div>
        <!-- 帖子详情弹窗 -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
                <!-- 弹窗标题栏 -->
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">帖子详情</h3>
                    <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <!-- 帖子内容 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <h4 class="text-xl font-medium text-gray-900 mb-2">{{ currentPost?.title }}</h4>
                    <div class="flex items-center text-sm text-gray-500 mb-4">
                        <span>作者：{{ currentPost?.nickname }}</span>
                        <span class="mx-2">|</span>
                        <span>{{ currentPost?.updatetime }}</span>
                        <span class="mx-2">|</span>
                        <span class="text-gray-500 text-sm">
                            分类：<span class="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                {{ topicsCheck.find(topic => topic.value === currentPost?.topic)?.label || '未知分类' }}
                            </span>
                        </span>
                    </div>
                    <div class="flex gap-2 mb-4">
                        <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                            {{ currentPost?.tag }}</span>
                    </div>
                    <p class="text-gray-700 whitespace-pre-wrap" v-html="currentPost?.content"></p>
                    <div v-if="currentPost?.url" class="mt-4">
                        <img :src="currentPost.url" alt="帖子图片" class="w-full h-auto rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import side_menu from '@/components/side_menu.vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const activeMenu = ref('post');
const searchQuery = ref('');
const showFilterMenu = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPosts = ref(156);
const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
};
const filters = [
    { label: '全部', value: 0 },
    { label: '待审核', value: 0 },
    { label: '已通过', value: 1 },
    { label: '已拒绝', value: 2 }
];

const topicsCheck = ref([
  { value: 1, label: '课程学习专区' },
  { value: 2, label: '考研专区' },
  { value: 3, label: '考公专区' },
  { value: 4, label: '出国专区' },
  { value: 5, label: '竞赛专区' },
  { value: 6, label: '期末复习专区' },
  { value: 7, label: '课题实验专区' },
  { value: 8, label: '考级证书专区' },
  { value: 9, label: '实习分享专区' },
  { value: 10, label: '论文专区' },
]
);
const selectedFilter = ref(filters[0]);
const posts = ref<Array<{
    postid: number;
    title: string;
    content: string;
    uid: number;
    updatetime: string;
    topic: number;
    tag: string;
    status: number;
    url: string;
    nickname: string;
}>>([
    {
        postid: 1,
        title: '',
        content: '',
        uid: 0,
        topic: 1,
        tag: '',
        updatetime: '',
        status: 0,
        url:'',
        nickname: '',
    }
]);


const filteredPosts = computed(() => {
    let result = posts.value;
    if (selectedFilter.value.value !== 0) {
        result = result.filter(post => post.status === selectedFilter.value.value);
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.nickname.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query)
        );
    }
    return result;
});

const displayedPosts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredPosts.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredPosts.value.length / pageSize.value);
});

const displayPages = computed(() => {
    const pages = [];
    let start = Math.max(1, currentPage.value - 2);
    let end = Math.min(totalPages.value, start + 4);
    if (end - start < 4) {
        start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const handleMenuClick = (menuId: string) => {
    activeMenu.value = menuId;
};

const toggleFilterMenu = () => {
    showFilterMenu.value = !showFilterMenu.value;
};

const selectFilter = (filter: { label: string; value: number }) => {
    selectedFilter.value = filter;
    showFilterMenu.value = false;
    currentPage.value = 1;
};

const handleApprove = (postId: number) => {
    request.put('/content/moderationPost',{
            postid:postId,
            status:1
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            load();
        } else {
            ElMessage.error(res.message);
        }
    });
};

const handleReject = (postId: number) => {
    request.put('/content/moderationPost',{
            postid:postId,
            status:2
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            load();
        } else {
            ElMessage.error(res.message);
        }
    });
};

const showDetailModal = ref(false);
const currentPost = ref<{
    postid: number;
    title: string;
    content: string;
    uid: number;
    updatetime: string;
    topic: number;
    tag: string;
    status: number;
    url: string;
    nickname: string;
} | null>(null);

const showPostDetail = (postId: number) => {
    currentPost.value = posts.value.find(p => p.postid === postId) || null;
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
};

const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
};


// 处理帖子用户名
const fetchUsernames = () => {
    posts.value.forEach(doc => {
        if (!doc.uid) return;
        // 发送请求获取用户名
        request.get('/users/findUser', { params: { uid: doc.uid } }).then((res) => {
            if (res.code === '200') {
                doc.nickname = res.data.nickname || '未知用户';
            } else {
                ElMessage.error(res.message);
            }
        });
    });
};

// 处理帖子数据
const processDocuments = () => {
    posts.value.forEach(doc => {
        doc.updatetime = doc.updatetime.slice(0, 10);
    });
};

// 加载数据
const load = () => {
    request.get('/content/postSelectPage',{
        params:{
            pageNum: currentPage.value,
            pageSize:pageSize.value,
            title:searchQuery.value,
        }
    }).then((res) =>  {
    if(res.code === '200'){
        posts.value = res.data.list;
        totalPosts.value = res.data.total;
        processDocuments();
        fetchUsernames();
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
</style>
