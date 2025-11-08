'use client'

import { supabase } from '@/lib/supabase/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()

    setLoading(false)

    if (error) {
      console.error('Erro ao sair:', error.message)
      return
    }

    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {loading ? 'Saindo...' : 'Sair'}
    </button>
  )
}
