import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/testVideo',
    name: 'testVideo',
    component: () => import('@/views/test-video/TestVideo.vue')
  },
  {
    path: '/testGl',
    name: 'testGl',
    component: () => import('@/views/test-gl/TestGl.vue')
  },
  {
    path: '/testRegl',
    name: 'testRegl',
    component: () => import('@/views/test-regl/TestRegl.vue')
  },
  {
    path: '/testResl',
    name: 'testResl',
    component: () => import('@/views/test-resl/TestResl.vue')
  },
  {
    path: '/testSplitPanel',
    name: 'testSplitPanel',
    component: () => import('@/views/test-split-panel/TestSplitPanel.vue')
  },
  {
    path: '/learnThree',
    name: 'learnThree',
    component: () => import('@/views/learn-three/LearnThree.vue')
  },
  {
    path: '/virtual-grid',
    name: 'virtual-grid',
    component: () => import('@/views/virtual-grid/VirtualGrid.vue')
  },
  {
    path: '/test-drag',
    name: 'test-drag',
    component: () => import('@/views/dragAndDrop/TestDrag.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
