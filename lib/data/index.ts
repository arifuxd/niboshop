import { serverApi } from '@/lib/api-server'
import type { Review } from './types'
import type { Banner, Category, Customer, CustomerStatus, Order, OrderStatus, Product } from './types'
export * from './types'
export type HomepageSection={id:string;title:string;description:string;productIds:string[]}
type HomeData={hero:Banner[];side:Banner[];sections:HomepageSection[]}
type RawOrder={id:number|string;number:string;user_id:number|null;customer_name:string;email?:string|null;phone:string;address:string;city:string;status:OrderStatus;payment:string;total:number|string;created_at:string;items:Array<{product_id:number|null;name:string;image:string;price:number|string;quantity:number}>}
const orderShape=(o:RawOrder):Order=>({id:o.number,databaseId:String(o.id),customerId:String(o.user_id??''),customerName:o.customer_name,date:o.created_at,status:o.status,payment:'Cash on Delivery',total:Number(o.total),items:o.items.map(i=>({productId:String(i.product_id??''),name:i.name,image:i.image??'',price:Number(i.price),quantity:i.quantity}))})
export async function getHomepageConfig():Promise<HomeData>{return serverApi('/homepage')}
export async function getCategories():Promise<Category[]>{return serverApi('/categories')}
export async function getCategory(slug:string){return (await getCategories()).find(c=>c.slug===slug)}
export async function getProducts(opts:{categorySlug?:string;subcategorySlug?:string;query?:string}={}):Promise<Product[]>{const q=new URLSearchParams();if(opts.categorySlug)q.set('category',opts.categorySlug);if(opts.subcategorySlug)q.set('subcategory',opts.subcategorySlug);if(opts.query?.trim())q.set('q',opts.query.trim());return serverApi(`/products?${q}`)}
export async function getFeaturedProducts(){return serverApi<Product[]>('/products?featured=1')}
export async function getNewProducts(){return serverApi<Product[]>('/products?new=1')}
export async function getProduct(slug:string){try{return await serverApi<Product>(`/products/${encodeURIComponent(slug)}`)}catch{return undefined}}
export async function getRelatedProducts(product:Product,limit=4){return (await getProducts({categorySlug:product.categorySlug})).filter(p=>p.id!==product.id).slice(0,limit)}
export async function getReviews(_productId:string):Promise<Review[]>{return []}
export async function searchProducts(query:string,limit=6){const q=query.trim().slice(0,120);if(q.length<3)return [];return (await getProducts({query:q})).slice(0,Math.min(Math.max(limit,1),20))}
export async function getOrders():Promise<Order[]>{return (await serverApi<RawOrder[]>('/admin/orders')).map(orderShape)}
export async function getOrder(id:string){return (await getOrders()).find(o=>o.id===id||o.databaseId===id)}
export async function getCustomers():Promise<Customer[]>{const rows=await serverApi<Array<{id:number;name:string;email:string;phone:string|null;city:string|null;orders_count:number;spent:number;created_at:string;status:CustomerStatus}>>('/admin/customers');return rows.map(c=>({id:String(c.id),name:c.name,email:c.email,phone:c.phone??'',city:c.city??'',orders:c.orders_count,spent:Number(c.spent),joined:c.created_at.slice(0,10),status:c.status}))}
export async function getRevenueByMonth(){const orders=await getOrders();const months=new Map<string,{revenue:number;orders:number}>();for(const o of orders){const d=new Date(o.date);const k=d.toLocaleString('en',{month:'short'});const v=months.get(k)||{revenue:0,orders:0};v.revenue+=o.total;v.orders++;months.set(k,v)}return [...months].slice(-6).map(([month,v])=>({month,...v}))}
export async function getCurrentCustomer():Promise<Customer>{const [u,orders]=await Promise.all([serverApi<{id:number;name:string;email:string;phone:string|null;city:string|null;created_at:string}>('/auth/me'),getCustomerOrders()]);return{id:String(u.id),name:u.name,email:u.email,phone:u.phone??'',city:u.city??'',orders:orders.length,spent:orders.reduce((n,o)=>n+o.total,0),joined:u.created_at.slice(0,10),status:'active'}}
export async function getCustomerOrders(_customerId?:string){return (await serverApi<RawOrder[]>('/account/orders')).map(orderShape)}
export type NewProductInput=Pick<Product,'name'|'brand'|'categorySlug'|'subcategorySlug'|'price'|'stock'|'image'|'images'|'description'|'highlights'>&Partial<Pick<Product,'comparePrice'|'isNew'|'isFeatured'|'freeShipping'>>
const productPayload=(p:NewProductInput)=>({name:p.name,brand:p.brand,categorySlug:p.categorySlug,subcategorySlug:p.subcategorySlug,price:p.price,comparePrice:p.comparePrice,stock:p.stock,image:p.image,images:p.images,description:p.description,highlights:p.highlights,isNew:p.isNew,isFeatured:p.isFeatured,freeShipping:p.freeShipping})
export async function createProduct(input:NewProductInput){return serverApi<Product>('/admin/products',{method:'POST',body:JSON.stringify(productPayload(input))})}
export async function updateProduct(id:string,input:NewProductInput){return serverApi<Product>(`/admin/products/${id}`,{method:'PUT',body:JSON.stringify(productPayload(input))})}
export async function deleteProduct(id:string){return serverApi(`/admin/products/${id}`,{method:'DELETE'})}
export async function updateOrderStatus(id:string,status:OrderStatus){const order=await getOrder(id);if(!order)return undefined;return serverApi(`/admin/orders/${order.databaseId??order.id}`,{method:'PATCH',body:JSON.stringify({status})})}
export async function getCustomer(id:string){const u=await serverApi<{id:number;name:string;email:string;phone:string|null;city:string|null;created_at:string;status:CustomerStatus;orders_count:number;spent:number}>(`/admin/customers/${id}`);return{id:String(u.id),name:u.name,email:u.email,phone:u.phone??'',city:u.city??'',orders:u.orders_count??0,spent:Number(u.spent??0),joined:u.created_at.slice(0,10),status:u.status} as Customer}
export type CustomerInput=Pick<Customer,'name'|'email'|'phone'|'city'>
export async function createCustomer(input:CustomerInput){return serverApi<Customer>('/admin/customers',{method:'POST',body:JSON.stringify(input)})}
export async function updateCustomer(id:string,patch:Partial<CustomerInput>&{status?:CustomerStatus}){const current=await getCustomer(id);if(!current)return undefined;return serverApi(`/admin/customers/${id}`,{method:'PUT',body:JSON.stringify({name:patch.name??current.name,email:patch.email??current.email,phone:patch.phone??current.phone,city:patch.city??current.city,status:patch.status??current.status})})}
export async function deleteCustomer(id:string){return serverApi(`/admin/customers/${id}`,{method:'DELETE'})}
export async function getOrdersByCustomer(customerId:string):Promise<Order[]>{return (await serverApi<RawOrder[]>(`/admin/orders?customer_id=${encodeURIComponent(customerId)}`)).map(orderShape)}
export async function createCategory(input:Omit<Category,'slug'|'subcategories'>){return serverApi<Category>('/admin/categories',{method:'POST',body:JSON.stringify(input)})}
export async function updateCategory(slug:string,patch:Pick<Category,'name'|'description'|'icon'>){const c=await getCategory(slug);if(!c)return undefined;return serverApi<Category>(`/admin/categories/${c.id}`,{method:'PUT',body:JSON.stringify({...patch,subcategories:c.subcategories})})}
export async function deleteCategory(slug:string){const c=await getCategory(slug);if(!c)return false;try{await serverApi(`/admin/categories/${c.id}`,{method:'DELETE'});return true}catch{return false}}
export async function createSubcategory(categorySlug:string,name:string){const c=await getCategory(categorySlug);if(!c)return undefined;const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const subcategories=[...c.subcategories,{name,slug}];return serverApi<Category>(`/admin/categories/${c.id}`,{method:'PUT',body:JSON.stringify({name:c.name,description:c.description,icon:c.icon,subcategories})})}
export async function updateHomepageBanners(input:{hero:Banner[];side:Banner[]}){const current=await getHomepageConfig();return serverApi('/admin/homepage',{method:'PUT',body:JSON.stringify({...current,...input})})}
export async function updateHomepageSections(sections:HomepageSection[]){const current=await getHomepageConfig();return serverApi('/admin/homepage',{method:'PUT',body:JSON.stringify({...current,sections})})}
export async function saveHomepage(input:HomeData){return serverApi('/admin/homepage',{method:'PUT',body:JSON.stringify(input)})}
export async function saveSettings<T>(settings:T){return serverApi('/admin/settings',{method:'PUT',body:JSON.stringify(settings)})}
