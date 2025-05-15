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
            <side_menu/>
        </div>
        <!-- 右侧内容区 -->
        <div class="flex-1 p-6">
            <div class="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-3rem)]">
                <div class="text-2xl font-medium mb-6">{{ currentMenuTitle }}</div>
                <!-- 内容占位 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="(stat, index) in stats"
                        :key="index"
                        class="bg-gradient-to-br p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        :class="[stat.bgClass, { 'ring-4 ring-blue-200': activeCard === index }]"
                        @click="handleCardClick(index)"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-100/90">{{ stat.title }}</p>
                                <p class="text-2xl font-semibold text-white mt-2">{{ stat.value }}</p>
                            </div>
                            <i :class="[stat.icon, 'text-3xl text-white/80']"></i>
                        </div>
                    </div>
                </div>
                <!-- 图表区域 -->
                <div class="mt-8 grid grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-lg font-medium mb-4">近7天数据统计</h3>
                        <div ref="chartRef1" class="w-full h-80"></div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 ">
                        <h3 class="text-lg font-medium mb-4">内容分布</h3>
                        <div ref="chartRef2" class="w-full h-80 "></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import side_menu from '@/components/side_menu.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import request from '@/utils/request.js';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const activeMenu = ref('home');
const activeCard = ref(-1);
const chartRef1 = ref<HTMLDivElement | null>(null);
const chartRef2 = ref<HTMLDivElement | null>(null);
const router = useRouter();

const menuItems = [
    { id: 'home', name: '首页', icon: 'fas fa-tachometer-alt' },
    { id: 'video', name: '视频审核', icon: 'fas fa-video' },
    { id: 'document', name: '资料审核', icon: 'fas fa-folder' },
    { id: 'postcheck', name: '帖子审核', icon: 'fas fa-file-alt' },
    { id: 'admin', name: '管理员管理', icon: 'fas fa-user-shield' },
    { id: 'user', name: '用户管理', icon: 'fas fa-users' },
    { id: 'profile', name: '我的', icon: 'fas fa-user-circle' },
];

const stats = ref([
    {
        title: '待审核视频',
        value: '0',
        icon: 'fas fa-video',
        bgClass: 'from-blue-500 to-blue-600'
    },
    {
        title: '待审核资料',
        value: '0',
        icon: 'fas fa-folder',
        bgClass: 'from-green-500 to-green-600'
    },
    {
        title: '待审核帖子',
        value: '0',
        icon: 'fas fa-file-alt',
        bgClass: 'from-purple-500 to-purple-600'
    }
]);

const currentMenuTitle = ref('系统概览');

const handleMenuClick = (menuId: string) => {
    activeMenu.value = menuId; 
    
    router.push({ path: `/${menuId}` });
};

const handleCardClick = (index: number) => {
    activeCard.value = index;
    const menu = menuItems.find(item => {
        switch(index) {
            case 0: return item.id === 'video';
            case 1: return item.id === 'document';
            case 2: return item.id === 'postcheck';
        }
    });
    if (menu) handleMenuClick(menu.id);
};

// 获取统计数据
const fetchStats = async () => {
    try {
        const res = await request.get('/dashboard/stats');
        if (res.code === '200') {
            stats.value[0].value = res.data.pendingVideos.toString();
            stats.value[1].value = res.data.pendingMaterials.toString();
            stats.value[2].value = res.data.pendingPosts.toString();
        } else {
            ElMessage.error(res.message || '获取统计数据失败');
        }
    } catch (error) {
        console.error('获取统计数据出错:', error);
        ElMessage.error('获取统计数据出错');
    }
};

// 获取近7天数据
const fetchWeeklyStats = async () => {
    try {
        const res = await request.get('/dashboard/weeklyStats');
        if (res.code === '200' && chartRef1.value) {
            const chart1 = echarts.init(chartRef1.value);
            chart1.setOption({
                animation: false,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['视频', '资料', '帖子']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: res.data.days || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '视频',
                        type: 'line',
                        data: res.data.videoData || [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '资料',
                        type: 'line',
                        data: res.data.materialData || [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '帖子',
                        type: 'line',
                        data: res.data.postData || [150, 232, 201, 154, 190, 330, 410]
                    }
                ]
            });
        } else {
            ElMessage.error(res.message || '获取近7天数据失败');
        }
    } catch (error) {
        console.error('获取近7天数据出错:', error);
        ElMessage.error('获取近7天数据出错');
    }
};

// 获取内容分布数据
const fetchContentDistribution = async () => {
    try {
        const res = await request.get('/dashboard/contentDistribution');
        if (res.code === '200' && chartRef2.value) {
            const chart2 = echarts.init(chartRef2.value);
            
            // 使用从后端获取的实际数据
            const videoCount = res.data.videoCount || 0;
            const materialCount = res.data.materialCount || 0;
            const postCount = res.data.postCount || 0;
            
            chart2.setOption({
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['视频课程', '学习资料', '帖子']
                },
                series: [
                    {
                        name: '内容分布',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: videoCount, name: '视频课程' },
                            { value: materialCount, name: '学习资料' },
                            { value: postCount, name: '帖子' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
            
            // 如果所有数据都为0，显示提示信息
            if (videoCount === 0 && materialCount === 0 && postCount === 0) {
                ElMessage.info('暂无内容分布数据');
            }
        } else {
            ElMessage.error(res.message || '获取内容分布数据失败');
        }
    } catch (error) {
        console.error('获取内容分布数据出错:', error);
        ElMessage.error('获取内容分布数据出错');
    }
};

onMounted(() => {
    // 初始化图表（先显示默认数据）
    if (chartRef1.value) {
        const chart1 = echarts.init(chartRef1.value);
        chart1.setOption({
            animation: false,
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['视频', '资料', '帖子']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '视频',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '资料',
                    type: 'line',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '帖子',
                    type: 'line',
                    data: [150, 232, 201, 154, 190, 330, 410]
                }
            ]
        });
    }
    
    if (chartRef2.value) {
        const chart2 = echarts.init(chartRef2.value);
        chart2.setOption({
            animation: false,
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['视频课程', '学习资料', '帖子']
            },
            series: [
                {
                    name: '内容分布',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 0, name: '视频课程' },
                        { value: 0, name: '学习资料' },
                        { value: 0, name: '帖子' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
    }
    
    // 获取实时数据
    fetchStats();
    fetchWeeklyStats();
    fetchContentDistribution();
    
    // 监听窗口大小变化，重新渲染图表
    window.addEventListener('resize', () => {
        if (chartRef1.value) {
            const chart1 = echarts.getInstanceByDom(chartRef1.value);
            chart1?.resize();
        }
        if (chartRef2.value) {
            const chart2 = echarts.getInstanceByDom(chartRef2.value);
            chart2?.resize();
        }
    });
});
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
