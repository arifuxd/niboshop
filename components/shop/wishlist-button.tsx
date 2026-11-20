'use client'
import {HeartIcon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useWishlist} from '@/lib/wishlist'
import {toast} from 'sonner'
export function WishlistButton({productId}:{productId:string}){const{ids,toggle}=useWishlist();const active=ids.includes(productId);return <Button type="button" size="icon" variant="secondary" aria-label={active?'Remove from wishlist':'Add to wishlist'} className="absolute right-2 top-2 z-10 size-9 rounded-full" onClick={e=>{e.preventDefault();e.stopPropagation();toggle(productId);toast.success(active?'Removed from wishlist':'Saved to wishlist')}}><HeartIcon className={active?'fill-current text-primary':''}/></Button>}
