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
        <div class="flex-1 bg-gray-50 overflow-hidden">
            <!-- 顶部导航栏 -->
            <div class="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
                <div class="flex items-center">
                    <h1 class="text-xl font-semibold text-gray-800">{{ currentMenuTitle }}</h1>
                    <span class="ml-4 text-blue-500 bg-blue-50 border border-blue-500 px-2 py-0.5 rounded-full text-xs">
                        共 {{ displayVideos.length }} 个视频
                    </span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input
                            type="text"
                            v-model="searchKeyword"
                            placeholder="搜索视频标题/作者"
                            class="w-64 h-10 pl-10 pr-4 rounded-lg border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    </div>
                    <div class="relative">
                        <button
                            @click="toggleFilterMenu"
                            class="px-4 h-10 bg-blue-500 text-white !rounded-button hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                            <i class="fas fa-filter mr-2"></i>{{ filterOptions[selectedFilter] }}
                        </button>
                        <!-- 筛选下拉菜单 -->
                        <div
                            v-if="showFilterMenu"
                            class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                        >
                            <div
                                v-for="(label, value) in filterOptions"
                                :key="value"
                                @click="selectFilter(value)"
                                :class="[
                                    'px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors text-sm',
                                    { 'bg-blue-50 text-blue-600': selectedFilter === value }
                                ]"
                            >
                                {{ label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 视频列表 -->
            <div class="p-6">
                <div class="bg-white rounded-lg shadow">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">视频标题</th>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">视频长度</th>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">作者</th>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">发布时间</th>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600 w-28">状态</th>
                                <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="video in paginatedVideos"
                                :key="video.vid"
                                class="border-b last:border-b-0 hover:bg-gray-50"
                            >
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-sm font-medium text-gray-900 line-clamp-2">{{ video.title }}</h3>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-gray-600">{{ video.duration }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <span class="text-sm text-gray-600">{{ video.nickname }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm text-gray-600">{{ video.uploadDate }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="getStatusClass(video.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                                        {{ video.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-2">
                                        <button
                                            class="p-2 text-green-500 hover:text-green-600 transition-colors"
                                            @click="handleApprove(video)"
                                        >
                                            <i class="fas fa-check text-lg"></i>
                                        </button>
                                        <button
                                            class="p-2 text-red-500 hover:text-red-600 transition-colors"
                                            @click="handleReject(video)"
                                        >
                                            <i class="fas fa-times text-lg"></i>
                                        </button>
                                        <button
                                            class="p-2 text-gray-500 hover:bg-gray-100 !rounded-button transition-colors"
                                            @click="openVideoDetail(video)"
                                        >
                                            <i class="fas fa-eye text-blue-500"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 分页控件 -->
                    <div class="flex items-center justify-between px-6 py-4 border-t">
                        <div class="flex items-center space-x-2">
                            <button
                                @click="prevPage"
                                :disabled="currentPage === 1"
                                :class="[
                                    'px-3 py-1 !rounded-button whitespace-nowrap',
                                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                ]"
                            >
                                <i class="fas fa-chevron-left mr-1"></i>上一页
                            </button>
                            <div class="flex items-center space-x-1">
                                <button
                                    v-for="page in displayedPages"
                                    :key="page"
                                    @click="goToPage(page)"
                                    :class="[
                                        'w-8 h-8 flex items-center justify-center !rounded-button text-sm',
                                        page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    ]"
                                >
                                    {{ page }}
                                </button>
                            </div>
                            <button
                                @click="nextPage"
                                :disabled="currentPage === totalPages"
                                :class="[
                                    'px-3 py-1 !rounded-button whitespace-nowrap',
                                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                ]"
                            >
                                下一页
                                <i class="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 视频详情弹窗 -->
            <div v-if="showVideoDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                    <!-- 弹窗头部 -->
                    <div class="px-6 py-4 border-b flex items-center justify-between">
                        <h3 class="text-xl font-semibold text-gray-800">视频详情</h3>
                        <button @click="closeVideoDetail" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <!-- 弹窗内容 -->
                    <div class="p-6 space-y-6">
                        <!-- 视频封面 -->
                        <div class="w-full h-[300px] rounded-lg overflow-hidden mb-6">
                            <Artplayer 
                                :key="currentVideo.videoUrl"
                                :option="playerOption"
                                :title="currentVideo.title"
                            />
                        </div>
                        <!-- 视频基本信息 -->
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">作者：</span>
                                <span class="flex-1 text-gray-800">{{ currentVideo.nickname }}</span>
                            </div>
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">提交时间：</span>
                                <span class="flex-1 text-gray-800">{{ currentVideo.uploadDate}}</span>
                            </div>
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">视频标题：</span>
                                <span class="flex-1 text-gray-800">{{ currentVideo.title }}</span>
                            </div>
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">视频描述：</span>
                                <p class="flex-1 text-gray-800">{{ currentVideo.descr }}</p>
                            </div>
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">视频分类：</span>
                                <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {{ currentVideo.scId  }}
                                </span>
                            </div>
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500">视频标签：</span>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="(tag, index) in (typeof currentVideo.tags === 'string' ? currentVideo.tags.split(' ') : currentVideo.tags)"
                                        :key="index"
                                        class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
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
import Artplayer from '@/components/lessons/videos.vue';
import { reactive } from 'vue';

const activeMenu = ref('video');
const showFilterMenu = ref(false);
const selectedFilter = ref('all');
const currentPage = ref(1);
const pageSize = ref(5);
const showVideoDetail = ref(false);
const currentVideo = ref<any>({});
const searchKeyword = ref('');



// 分类映射关系
const categoryMap: {[key: string]: string} = {
    "1001": "考研专区",
    '1002': '考公专区',
    '1003': '出国专区',
    '1004': '保研专区',
    '1005': '竞赛专区',
    '1006': '期末复习专区',
    '1007': '课题实验专区',
    '1008': '考级证书专区',
    '1009': '选修课专区'
};

const filterOptions = {
    all: '全部',
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
};

const categories = [
    '考研专区',
    '考公专区',
    '出国专区',
    '保研专区',
    '竞赛专区',
    '期末复习专区',
    '课题实验专区',
    '考级证书专区',
    '选修课专区',
    '实习分享专区',
    '论文专区',
];

const menuItems = [
    { id: 'home', name: '首页', icon: 'fas fa-tachometer-alt' },
    { id: 'video', name: '视频审核', icon: 'fas fa-video' },
    { id: 'document', name: '资料审核', icon: 'fas fa-folder' },
    { id: 'post', name: '帖子审核', icon: 'fas fa-file-alt' },
    { id: 'admin', name: '管理员管理', icon: 'fas fa-user-shield' },
    { id: 'user', name: '用户管理', icon: 'fas fa-users' },
    { id: 'profile', name: '我的', icon: 'fas fa-user-circle' },
];


// 视频播放器配置
const playerOption = reactive({
  url: '',
  type: "mp4",
  playbackRate: true,
  isLive: false, 
  setting: true,
  pip: true,
  fullscreen: true,
  miniProgressBar: true,
        
  settings: [
        {
            html: 'setting01',
            selector: [
                {
                    html: 'setting01-01',
                },
                {
                    html: 'setting01-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
        {
            html: 'setting02',
            selector: [
                {
                    html: 'setting02-01',
                },
                {
                    html: 'setting02-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
    ],
})


const currentMenuTitle = ref('视频审核');

const displayVideos = ref([
    {
        vid: 1,
        title: '',
        nickname: '',
        uploadDate: '',
        duration: 0,
        status: '',
        coverUrl: '',
        videoUrl:'',
        uid: '', 
        descr:'',
        scId: '',
        tags: [], 
    }
]);

/**
 * 处理菜单点击，切换当前激活菜单和标题
 * @param menuId 菜单项的id
 */
const handleMenuClick = (menuId: string) => {
    activeMenu.value = menuId;
    const menu = menuItems.find((item) => item.id === menuId);
    if (menu) {
        currentMenuTitle.value = menu.name;
    }
};

/**
 * 打开视频详情弹窗，并设置当前视频信息
 * @param video 当前点击的视频对象
 */
const openVideoDetail = (video: any) => {
    showVideoDetail.value = true;
    currentVideo.value = video;
    playerOption.url = video.videoUrl;
};

/**
 * 关闭视频详情弹窗
 */
const closeVideoDetail = () => {
    showVideoDetail.value = false;
    currentVideo.value = {};
};

/**
 * 审核通过操作，将视频状态设为“已通过”
 * @param video 当前操作的视频对象
 */
const handleApprove = (video: any) => {
    if (video.status === '已通过') return;
    const index = displayVideos.value.findIndex((v) => v.vid === video.id);
    if (index !== -1) {
        displayVideos.value[index] = {
            ...displayVideos.value[index],
            status: '已通过',
        };
        
    }
    request.put('/content/moderation',{
            vid:video.vid,
            status:1
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            video.status = '已通过';
        } else {
            ElMessage.error(res.message);
        }
    });

    
};

/**
 * 审核拒绝操作，将视频状态设为“已拒绝”
 * @param video 当前操作的视频对象
 */
const handleReject = (video: any) => {
    if (video.status === '已拒绝') return;
    const index = displayVideos.value.findIndex((v) => v.vid === video.id);
    if (index !== -1) {
        displayVideos.value[index] = {
            ...displayVideos.value[index],
            status: '已拒绝',

        };
        
    }
    request.put('/content/moderation',{
            vid:video.vid,
            status:2
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            video.status = '已拒绝';
        } else {
            ElMessage.error(res.message);
        }
    });
};

/**
 * 根据视频状态返回对应的样式类
 * @param status 视频状态
 * @returns 样式类名
 */
const getStatusClass = (status: string) => {
    const classes = {
        待审核: 'bg-yellow-100 text-yellow-800',
        已通过: 'bg-green-100 text-green-800',
        已拒绝: 'bg-red-100 text-red-800',
    };
    return classes[status as keyof typeof classes];
};

/**
 * 切换筛选菜单的显示/隐藏
 */
const toggleFilterMenu = () => {
    showFilterMenu.value = !showFilterMenu.value;
};

/**
 * 选择筛选条件
 * @param filter 选中的筛选条件
 */
const selectFilter = (filter: string) => {
    selectedFilter.value = filter;
    showFilterMenu.value = false;
    currentPage.value = 1;
};

/**
 * 计算筛选和搜索后的所有视频列表
 */
const filteredVideos = computed(() => {
    let filtered = displayVideos.value;
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(
            (video) =>
                video.title.toLowerCase().includes(keyword) ||
                video.nickname.toLowerCase().includes(keyword)
        );
    }
    if (selectedFilter.value !== 'all') {
        const statusMap = {
            pending: '待审核',
            approved: '已通过',
            rejected: '已拒绝',
        };
        filtered = filtered.filter(
            (video) => video.status === statusMap[selectedFilter.value as keyof typeof statusMap]
        );
    }
    return filtered;
});

/**
 * 计算总页数
 */
const totalPages = ref(1)
/**
 * 当前页起始索引
 */
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
/**
 * 当前页结束索引
 */
const endIndex = computed(() => startIndex.value + pageSize.value);

/**
 * 当前页显示的视频列表
 */
const paginatedVideos = computed(() => {
    return filteredVideos.value.slice(startIndex.value, endIndex.value);
});

/**
 * 计算分页器中显示的页码（带省略号）
 */
const displayedPages = computed(() => {
    const totalPagesCount = totalPages.value;
    const current = currentPage.value;
    const delta = 2;
    const range = [];
    let rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPagesCount; i++) {
        if (i === 1 || i === totalPagesCount || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }

    range.sort((a, b) => a - b);

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
});

/**
 * 上一页
 */
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

/**
 * 下一页
 */
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

/**
 * 跳转到指定页
 * @param page 页码
 */
const goToPage = (page: number) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};


const load=()=>{
    request.get('/content/list',{
        params:{
            pageNum:currentPage.value,
            pageSize:pageSize.value,
            mcId:'1',
            title:searchKeyword.value
        }
    }).then((res)=>{
        if(res.code=='200'){
            displayVideos.value=res.data.list;
            totalPages.value=res.data.pages;
            displayVideos.value.forEach((video: any) => {
                if (video.status === 0) {
                    video.status = '待审核';
                } else if (video.status === 1) {
                    video.status = '已通过';
                } else if (video.status === 2) {
                    video.status = '已拒绝';
                }
                request.get('/users/findUser',{
                    params:{
                        uid:video.uid
                    }
                }).then((res)=>{
                    if(res.code=='200'){
                        video.nickname=res.data.nickname;
                    }else{
                        ElMessage(res.msg);
                    }
                });
                video.videoUrl = encodeURI(video.videoUrl.replace("filesDownload", 'inlineVideo'))
                // 规范化日期为 yyyy-MM-dd 格式
                const date = new Date(video.uploadDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                video.uploadDate = `${year}-${month}-${day}`;
                // 规范化视频时长为 分钟:秒
                if (typeof video.duration === 'number') {
                    const min = Math.floor(video.duration / 60);
                    const sec = String(Math.floor(video.duration % 60)).padStart(2, '0');
                    video.duration = `${min}分${sec}秒`;
                }
                // 规范化视频分类
                video.scId = categoryMap[video.scId]
                playerOption.url = video.videoUrl;
            });

            
        }else{
            ElMessage(res.msg);
        }})
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
