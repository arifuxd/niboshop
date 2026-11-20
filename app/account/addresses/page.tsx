import type {Metadata} from 'next'
import {PageHeader} from '@/components/dashboard/primitives'
import {AddressManager} from '@/components/dashboard/address-manager'
export const metadata:Metadata={title:'Addresses'}
export default function AddressesPage(){return <><PageHeader title="Addresses" description="Manage your saved delivery addresses."/><AddressManager/></>}
