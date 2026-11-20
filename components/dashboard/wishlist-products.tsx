'use client'
import {useWishlist} from '@/lib/wishlist'
import {ProductGrid} from '@/components/shop/product-section'
import type {Product} from '@/lib/data/types'
export function WishlistProducts({products}:{products:Product[]}){const{ids}=useWishlist();return <ProductGrid products={products.filter(p=>ids.includes(p.id))}/>}
