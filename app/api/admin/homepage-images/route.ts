import { proxyUpload } from '@/lib/upload-proxy'
export const POST=(request:Request)=>proxyUpload(request,'homepage')
