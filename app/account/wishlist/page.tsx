import type {Metadata} from 'next'
import {PageHeader} from '@/components/dashboard/primitives'
import {getProducts} from '@/lib/data'
import {WishlistProducts} from '@/components/dashboard/wishlist-products'
export const metadata:Metadata={title:'Wishlist'}
export default async function WishlistPage(){const products=await getProducts();return <><PageHeader title="Wishlist" description="Products you saved for later."/><WishlistProducts products={products}/></>}
