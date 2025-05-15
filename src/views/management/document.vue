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
        <div class="flex-1 bg-gray-50 overflow-hidden">
            <!-- 顶部标题栏 -->
            <div class="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
                <div class="flex items-center">
                    <h1 class="text-xl font-medium text-gray-800">{{ currentMenuTitle }}</h1>
                    <div class="ml-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        共 <span class="font-medium">{{ filteredDocuments.length }}</span> 条资料
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            v-model="searchQuery"
                            class="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                            placeholder="搜索文档标题、作者或ID..."
                        />
                    </div>
                    <div class="relative">
                        <button @click="toggleFilter" class="flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm !rounded-button whitespace-nowrap">
                            <i class="fas fa-filter mr-2"></i>
                            {{ filterOptions.find(f => String(f.value) === String(currentFilter))?.label || '全部' }}
                        </button>
                        <!-- 筛选下拉菜单 -->
                        <div v-if="showFilter" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                            <div v-for="filter in filterOptions" :key="filter.value"
                                @click="selectFilter(Number(filter.value))"
                                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between">
                                <span>{{ filter.label }}</span>
                                <i v-if="currentFilter === Number(filter.value)" class="fas fa-check text-blue-500"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 内容区 -->
            <div class="p-6">
                <!-- 表头 -->
                <div class="bg-white rounded-xl shadow-sm mb-4">
                    <div class="grid grid-cols-12 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
                        <div class="col-span-3">资料标题</div>
                        <div class="col-span-1">文件大小</div>
                        <div class="col-span-2">作者</div>
                        <div class="col-span-2">发布时间</div>
                        <div class="col-span-2">状态</div>
                        <div class="col-span-2">操作</div>
                    </div>
                </div>
                <!-- 资料列表 -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="divide-y divide-gray-200">
                        <div v-for="doc in filteredDocuments" :key="doc.vid"
                            class="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div class="col-span-3 min-w-0">
                                <h3 class="text-sm font-medium text-gray-800 truncate">{{ doc.title }}</h3>
                                <div class="hidden items-center mt-1 text-xs text-gray-500">
                                    <i class="fas fa-user-circle mr-2"></i>
                                    <span class="truncate">{{ doc.nickname }}</span>
                                    <span class="mx-2">·</span>
                                    <i class="fas fa-clock mr-2"></i>
                                    <span>{{ doc.uploadDate }}</span>
                                </div>
                            </div>
                            <div class="col-span-1 text-sm text-gray-600">
                                {{ doc.realSize }}
                            </div>
                            <div class="col-span-2 text-sm text-gray-600">
                                {{ doc.nickname }}
                            </div>
                            <div class="col-span-2 text-sm text-gray-600">
                                {{ doc.uploadDate }}
                            </div>
                            <div class="col-span-2">
                                <span class="px-3 py-1 text-xs rounded-full"
                                    :class="{
                                        'bg-yellow-50 text-yellow-600': doc.status === 0,
                                        'bg-red-50 text-red-600': doc.status === 2,
                                        'bg-green-50 text-green-600': doc.status === 1,
                                    }">
                                    {{ doc.statusText }}
                                </span>
                            </div>
                            <div class="col-span-2 flex items-center space-x-2">
                                <button @click="handlePreview(doc)" class="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors !rounded-button whitespace-nowrap" title="预览">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button @click="handleApprove(doc)" class="w-9 h-9 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-lg transition-colors !rounded-button whitespace-nowrap" title="通过">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button @click="handleReject(doc)" class="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors !rounded-button whitespace-nowrap" title="拒绝">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分页器 -->
                <div class="mt-6 flex justify-between items-center px-6 py-4 bg-white rounded-xl shadow-sm">
                    <div class="flex items-center space-x-2">
                        <button
                            @click="prevPage"
                            :disabled="currentPage === 1"
                            :class="[
                                'px-3 py-2 rounded-lg text-sm transition-colors duration-300 !rounded-button whitespace-nowrap',
                                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            ]">
                            <i class="fas fa-chevron-left mr-1"></i> 上一页
                        </button>
                        <span class="text-sm text-gray-600">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
                        <button @click="nextPage"
                            :disabled="currentPage === totalPages"
                            :class="[
                                'px-3 py-2 rounded-lg text-sm transition-colors duration-300 !rounded-button whitespace-nowrap',
                                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            ]">
                            下一页 <i class="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 预览弹窗 -->
        <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white w-[800px] rounded-xl shadow-xl">
                <!-- 弹窗头部 -->
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-800">资料详情预览</h3>
                    <button @click="closePreview" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <!-- 弹窗内容 -->
                <div class="px-6 py-4">
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">资料标题：</span>
                            <div class="flex-1 text-gray-800">{{ previewDoc?.title }}</div>
                        </div>
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">作者：</span>
                            <div class="flex-1 text-gray-800">{{ previewDoc?.nickname }}</div>
                        </div>
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">资料分类：</span>
                            <div class="flex-1 text-gray-800">{{ previewDoc?.topic }}</div>
                        </div>
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">主题分类：</span>
                            <div class="flex-1 text-gray-800">
                                {{ tag.find(item => item.value === previewDoc?.scId)?.label || '未知分类' }}
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">提交时间：</span>
                            <div class="flex-1 text-gray-800">{{ previewDoc?.uploadDate }}</div>
                        </div>
                        <div class="flex items-start">
                            <span class="w-20 text-gray-500">资料简介：</span>
                            <div class="flex-1 text-gray-800">{{ previewDoc?.descr }}</div>
                        </div>
                    </div>
                    <!-- 弹窗底部 -->
                    <div class="mt-6 flex justify-end space-x-4 border-t border-gray-200 pt-4">
                        <button @click="handleViewContent" class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors !rounded-button whitespace-nowrap">
                            <i class="fas fa-book-open mr-2"></i>
                            查看内容
                        </button>
                        <button @click="closePreview" class="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors !rounded-button whitespace-nowrap">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 内容查看弹窗 -->
        <div v-if="showContent" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white w-[1000px] h-[80vh] rounded-xl shadow-xl flex flex-col">
                <!-- 弹窗头部 -->
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-800">{{ previewDoc?.title }}</h3>
                    <button @click="closeContent" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <!-- 弹窗内容 -->
                <div class="flex-1 overflow-y-auto px-6 py-4">
                    



                    <div v-if="previewDoc?.videoUrl" class="prose">
                        <div v-if="previewDoc.videoUrl.endsWith('.pdf')">
                            <iframe
                                :src="previewDoc.videoUrl"
                                class="w-full h-[70vh] border rounded-lg"
                                frameborder="0"
                            ></iframe>
                        </div>
                        <div v-else-if="previewDoc.videoUrl.endsWith('.docx') || previewDoc.videoUrl.endsWith('.xlsx')">
                            <el-alert
                                title="暂不支持直接预览此文件类型，请下载后查看"
                                type="warning"
                                show-icon
                            ></el-alert>
                            <a
                                :href="previewDoc.videoUrl"
                                download
                                class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                下载文件
                            </a>
                        </div>
                        <div v-else-if="previewDoc.videoUrl.endsWith('.txt')">
                            <iframe
                                :src="previewDoc.videoUrl"
                                class="w-full h-[70vh] border rounded-lg"
                                frameborder="0"
                            ></iframe>
                        </div>
                        <div v-else-if="previewDoc.videoUrl.endsWith('.ppt') || previewDoc.videoUrl.endsWith('.pptx')">
                            <el-alert
                                title="暂不支持直接预览此文件类型，请下载后查看"
                                type="warning"
                                show-icon
                            ></el-alert>
                            <a
                                :href="previewDoc.videoUrl"
                                download
                                class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                下载文件
                            </a>
                        </div>
                        <div v-else-if="previewDoc.videoUrl.endsWith('.jpg') || previewDoc.videoUrl.endsWith('.jpeg') || previewDoc.videoUrl.endsWith('.png')">
                            <img
                                :src="previewDoc.videoUrl"
                                alt="预览图片"
                                class="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div v-else-if="previewDoc.videoUrl.endsWith('.mp4')">
                            <video
                                controls
                                :src="previewDoc.videoUrl"
                                class="w-full h-[70vh] rounded-lg"
                            ></video>
                        </div>
                        <div v-else>
                            <el-alert
                                title="无法预览此文件类型"
                                type="error"
                                show-icon
                            ></el-alert>
                        </div>
                    </div>





                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import side_menu from '@/components/side_menu.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const activeMenu = ref('document');
const showFilter = ref(false);
const currentFilter = ref(null);
const showPreview = ref(false);
const showContent = ref(false);
const previewDoc = ref<any>(null);

const data=reactive({
    user: JSON.parse(localStorage.getItem('code_user') || '{}'),

})
const setPreviewDoc = (doc: any) => {
    previewDoc.value = { ...doc };
};
const menuItems = [
    { id: 'home', name: '首页', icon: 'fas fa-tachometer-alt' },
    { id: 'video', name: '视频审核', icon: 'fas fa-video' },
    { id: 'document', name: '资料审核', icon: 'fas fa-folder' },
    { id: 'post', name: '帖子审核', icon: 'fas fa-file-alt' },
    { id: 'admin', name: '管理员管理', icon: 'fas fa-user-shield' },
    { id: 'user', name: '用户管理', icon: 'fas fa-users' },
    { id: 'profile', name: '我的', icon: 'fas fa-user-circle' },
];

const filterOptions = [
    { label: '全部', value: null },
    { label: '待审核', value: 0 },
    { label: '已通过', value: 1 },
    { label: '已拒绝', value: 2 },
];

const tag = ref([
        { value: "1", label: '教材' },
        { value: "2", label: '试卷' },
        { value: "3", label: '课件' },
        { value: "4", label: '课程笔记' },
        { value: "5", label: '实验报告' },
        { value: "6", label: '其他' }
    ]);

const currentMenuTitle = ref('资料审核');
const pendingReview = ref(3);
const searchQuery = ref('');


// 文件列表数据
const documents = ref([
    {
        vid: '',
        title: '',
        uid: '',
        uploadDate: '',
        topic: '',
        duration: 0,
        realSize:'',
        descr: '',
        scId: '',
        status: 0,
        statusText: '待审核',
        nickname:'',
        videoUrl:''
    }
]);

// 格式化上传日期并更新状态文本
const processDocuments = () => {
    documents.value.forEach(doc => {
        doc.uploadDate = doc.uploadDate.slice(0, 10);
        if (doc.status === 0) {
            doc.statusText = '待审核';
        } else if (doc.status === 1) {
            doc.statusText = '已通过';
        } else if (doc.status === 2) {
            doc.statusText = '未通过';
        }
    });
};

const currentPage = ref(1);
const pageSize = ref(15);
const totalItems = ref(0);
const totalPages = ref(0);


const toggleFilter = () => {
    showFilter.value = !showFilter.value;
};

const selectFilter = (value: number) => {
    currentFilter.value = value;
    showFilter.value = false;
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};


const handleApprove = (doc: any) => {
    // 发送请求更新状态
    request.put('/content/moderation',{
            vid:doc.vid,
            status:1
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            doc.status = 1;
            doc.statusText = '已通过';
            pendingReview.value = documents.value.filter(d => d.status === 1).length;
        } else {
            ElMessage.error(res.message);
        }
    });
};

const handleReject = (doc: any) => {
    request.put('/content/moderation',{
            vid:doc.vid,
            status:2
    }).then((res) => {
        if (res.code === '200') {
            ElMessage.success('操作成功');
            doc.status = 2;
            doc.statusText = '已拒绝';
            pendingReview.value = documents.value.filter(d => d.status === 2).length;
        } else {
            ElMessage.error(res.message);
        }
    });
};

const handlePreview = (doc: any) => {
    previewDoc.value = doc;
    showPreview.value = true;
};

const handleViewContent = () => {
    showContent.value = true;
};

const closePreview = () => {
    showPreview.value = false;
    previewDoc.value = null;
};

const closeContent = () => {
    showContent.value = false;
};



const filteredDocuments = computed(() => {
    if (currentFilter.value === null) {
        return documents.value;
    }
    return documents.value.filter(doc => doc.status === currentFilter.value);
});


const fetchUsernames = () => {
    documents.value.forEach(doc => {
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

fetchUsernames();

// 加载数据
const load = () =>{
    request.get('/content/fileSelectPage',{
        params:{
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            title:searchQuery.value,
            status: null,
            mcId:3
        }
    }).then((res) => {
        if (res.code === '200') {
            documents.value = res.data.list;
            documents.value.forEach(doc => {
                // 规范化文件大小
                const size = parseFloat(String(doc.duration));
                if (!isNaN(size)) {
                    if (size >= 1024 * 1024 * 1024) {
                        doc.realSize = (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
                    } else if (size >= 1024 * 1024) {
                        doc.realSize = (size / (1024 * 1024)).toFixed(2) + ' MB';
                    } else if (size >= 1024) {
                        doc.realSize = (size / 1024).toFixed(2) + ' KB';
                    } else {
                        doc.realSize = size.toFixed(2) + ' B';
                    }
                } else {
                    doc.realSize = '未知大小';
                }
            });
            totalItems.value = res.data.total;
            totalPages.value = res.data.pages;
            processDocuments();
            fetchUsernames();
        } else {
            ElMessage.error(res.message);
        }
    })
}

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
/* 自定义滚动条样式 */
.prose::-webkit-scrollbar {
    width: 6px;
}
.prose::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}
.prose::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}
.prose::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
.prose {
    color: #374151;
    line-height: 1.6;
}
.prose h1 {
    font-size: 2em;
    margin-bottom: 1em;
    font-weight: 600;
    color: #111827;
}
.prose h2 {
    font-size: 1.5em;
    margin-top: 2em;
    margin-bottom: 1em;
    font-weight: 600;
    color: #1f2937;
}
.prose p {
    margin-bottom: 1.25em;
}
.prose pre {
    background-color: #f3f4f6;
    padding: 1em;
    border-radius: 0.375rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875em;
    line-height: 1.7142857;
}
.prose ul {
    margin-top: 1.25em;
    margin-bottom: 1.25em;
    padding-left: 1.625em;
}
.prose li {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}
</style>
