// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import CreateProduct from '../views/CreateProduct.vue'
import EditProduct from '../views/EditProduct.vue'
import TakeAwayView from '../views/TakeAwayView.vue'
import AdminView from '../views/AdminView.vue'
// Use dynamic import to avoid TypeScript error
// import ProductDetail from '../views/ProductDetail.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/takeaway'
  },
  {
    path: '/takeaway',
    name: 'TakeAway',
    component: TakeAwayView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    children: [
      {
        path: '',
        redirect: '/admin/products',
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: ProductList
      },
      {
        path: 'product/:id',
        name: 'AdminProductDetail',
        component: () => import('../views/ProductDetail.vue')
      },
      {
        path: 'create',
        name: 'AdminCreateProduct',
        component: CreateProduct
      },
      {
        path: 'edit/:id',
        name: 'AdminEditProduct',
        component: EditProduct
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/AdminSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
