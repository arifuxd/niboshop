'use client'
import {useState} from 'react'
import {api} from '@/lib/api'
import {Button} from '@/components/ui/button'
import {Card,CardContent} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
export function ProfileEditor({fields}:{fields:{id:string;label:string;value:string;type:string}[]}){const[notice,setNotice]=useState('');const[saving,setSaving]=useState(false);return <Card><CardContent><form className="grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={async e=>{e.preventDefault();setSaving(true);setNotice('');const d=new FormData(e.currentTarget);try{await api('/account/profile',{method:'PUT',body:JSON.stringify({name:d.get('name'),phone:d.get('phone'),city:d.get('city')})});setNotice('Profile saved.')}catch{setNotice('Could not save profile. Sign in and try again.')}finally{setSaving(false)}}}>{fields.map(f=><div key={f.id} className="flex flex-col gap-2"><Label htmlFor={f.id}>{f.label}</Label><Input id={f.id} name={f.id} type={f.type} defaultValue={f.value} readOnly={f.id==='email'} /></div>)}<div className="flex items-center gap-3 sm:col-span-2"><Button type="submit" disabled={saving}>{saving?'Saving…':'Save changes'}</Button>{notice&&<p role="status" className="text-sm text-muted-foreground">{notice}</p>}</div></form></CardContent></Card>}
