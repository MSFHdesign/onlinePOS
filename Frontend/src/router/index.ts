// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import CreateProduct from '../views/CreateProduct.vue'
import EditProduct from '../views/EditProduct.vue'
// Use dynamic import to avoid TypeScript error
// import ProductDetail from '../views/ProductDetail.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/create',
    name: 'CreateProduct',
    component: CreateProduct
  },
  {
    path: '/edit/:id',
    name: 'EditProduct',
    component: EditProduct
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
