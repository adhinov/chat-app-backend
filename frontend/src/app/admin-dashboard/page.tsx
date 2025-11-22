'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  phone: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [lastLogin, setLastLogin] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      const now = new Date();
      setLastLogin(now.toLocaleString('id-ID', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }));

      fetchUsers();
    } catch (error) {
      console.error('Error parsing token:', error);
      router.push('/');
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    // 1. BACKGROUND MEDIUM GREY (bg-gray-300)
    <div className="min-h-screen bg-gray-300 py-10 px-4 flex justify-center items-start">
      
      {/* Container Card */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header Card */}
        <div className="px-6 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/80">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Last Login: {lastLogin} WIB
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full sm:w-auto">
            Logout
          </Button>
        </div>

        {/* Body Card */}
        <div className="p-6">
          {/* Bagian Search & Judul Data */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Data Pengguna <span className="text-sm font-normal text-gray-500">({filteredUsers.length} users)</span>
            </h2>
            
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="text"
                placeholder="Cari user..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* 2. TOMBOL REFRESH BIRU (bg-blue-600 text-white) */}
              <Button 
                onClick={fetchUsers} 
                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Tabel Wrapper */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* 3. TABLE HEADER COMPACT (px-3 py-2) - Tetap satu baris string */}
                <thead className="bg-gray-800 text-white text-xs uppercase tracking-wider"><tr><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Email</th><th className="px-3 py-2 text-left font-medium">Username</th><th className="px-3 py-2 text-left font-medium">Role</th><th className="px-3 py-2 text-left font-medium">Created At</th><th className="px-3 py-2 text-left font-medium">Phone</th></tr></thead>
                
                <tbody className="text-sm divide-y divide-gray-100 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        {/* 4. TABLE BODY COMPACT (px-3 py-2) - Font tetap standar, padding dikurangi */}
                        <td className="px-3 py-2 text-gray-600 font-medium">{user.id}</td>
                        <td className="px-3 py-2 text-gray-600">{user.email}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{user.username}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-500 text-xs">
                          {new Date(user.createdAt).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-3 py-2 text-gray-500">{user.phone || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                        Tidak ada data pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}