'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  X, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';
import { IUser, UserRole, UserStatus } from '../../types';

interface UsersViewProps {
  users: IUser[];
  onAddUser: (newUser: Partial<IUser>) => void;
  onToggleUserStatus: (userId: string) => void;
}

export default function UsersView({
  users,
  onAddUser,
  onToggleUserStatus,
}: UsersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Add User State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.includes(searchTerm) ||
      user.username.includes(searchTerm) ||
      user.phone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      name,
      username,
      phone: phone ? `${phone.slice(-3)}••••09` : '000••••09',
      role,
      status: 'active',
      lastActive: 'الآن',
    });

    setIsAddModalOpen(false);
    setName('');
    setUsername('');
    setPhone('');
    setPassword('');
    showNotice(`تم إنشاء حساب المستخدم "${name}" بنجاح`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'admin': return 'مدير';
      case 'secretary': return 'سكرتاريا';
      case 'customer': return 'زبون';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-pullman-dark text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-pullman-orange block mb-1">
            مساحة العمل
          </span>
          <h2 className="text-2xl font-extrabold text-pullman-gray-text tracking-tight">
            إدارة المستخدمين
          </h2>
          <p className="text-xs text-pullman-gray-muted mt-0.5">
            الحسابات والصلاحيات وسجل نشاط المستخدمين.
          </p>
        </div>

        {/* Action Button: Add User */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-pullman-orange hover:bg-pullman-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pullman-orange/20 transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-pullman-gray-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في إدارة المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-10 pl-4 py-2.5 text-pullman-gray-text focus:outline-none focus:border-pullman-orange transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-semibold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">معلق</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-semibold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              <option value="today">اليوم</option>
              <option value="this_week">هذا الأسبوع</option>
              <option value="all">الكل</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-pullman-gray-muted font-bold whitespace-nowrap mr-2">
            {filteredUsers.length} نتائج
          </span>
        </div>
      </div>

      {/* Users Table matching Figma */}
      <div className="bg-white rounded-2xl border border-pullman-gray-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-pullman-gray-muted font-bold">
                <th className="py-4 px-5">الاسم</th>
                <th className="py-4 px-4">رقم الهاتف</th>
                <th className="py-4 px-4">الصلاحية</th>
                <th className="py-4 px-4">آخر نشاط</th>
                <th className="py-4 px-4">الحالة</th>
                <th className="py-4 px-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredUsers.map((user) => {
                const isActive = user.status === 'active';

                return (
                  <tr key={user._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* الاسم */}
                    <td className="py-4 px-5 font-bold text-pullman-gray-text">
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        {user.role === 'admin' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-pullman-orange" />
                        )}
                      </div>
                    </td>

                    {/* رقم الهاتف */}
                    <td className="py-4 px-4 text-pullman-gray-muted font-mono" dir="ltr">
                      {user.phone}
                    </td>

                    {/* الصلاحية */}
                    <td className="py-4 px-4 text-pullman-gray-text font-semibold">
                      {getRoleLabel(user.role)}
                    </td>

                    {/* آخر نشاط */}
                    <td className="py-4 px-4 text-pullman-gray-muted">
                      {user.lastActive || 'غير محدد'}
                    </td>

                    {/* الحالة */}
                    <td className="py-4 px-4">
                      {isActive ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          معلق
                        </span>
                      )}
                    </td>

                    {/* الإجراءات */}
                    <td className="py-4 px-5 text-center relative">
                      <button
                        onClick={() => setActiveMenuUserId(activeMenuUserId === user._id ? null : user._id)}
                        className="p-1.5 text-gray-400 hover:text-pullman-gray-text hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuUserId === user._id && (
                        <div className="absolute left-6 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-right animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              onToggleUserStatus(user._id);
                              setActiveMenuUserId(null);
                              showNotice(`تم تغيير حالة الحساب للعميل ${user.name}`);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-pullman-orange transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-pullman-orange" />
                            <span>{isActive ? 'تعليق الحساب' : 'تنشيط الحساب'}</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching Figma */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pullman-gray-muted">
          <div>
            عرض 1-{filteredUsers.length} من 24
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <button className="px-3 py-1.5 rounded-lg border border-pullman-gray-border text-pullman-gray-muted hover:bg-gray-50 transition-colors">
              السابق
            </button>
            <button className="w-7 h-7 rounded-lg bg-pullman-orange text-white flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-pullman-gray-border text-pullman-gray-text hover:bg-gray-50 flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-pullman-gray-border text-pullman-gray-text hover:bg-gray-50 flex items-center justify-center transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-pullman-gray-border text-pullman-gray-text hover:bg-gray-50 transition-colors">
              التالي
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: ADD USER ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">إضافة مستخدم جديد</h3>
                <p className="text-xs text-pullman-gray-muted">إنشاء حساب جديد وتعيين الصلاحيات</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حسام العلي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">اسم المستخدم (Username)</label>
                  <input
                    type="text"
                    required
                    placeholder="hossam_user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">رقم الهاتف (اختياري)</label>
                  <input
                    type="text"
                    placeholder="0991234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">كلمة المرور</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                />
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">الدور والصلاحية</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                >
                  <option value="customer">زبون (Customer)</option>
                  <option value="secretary">موظف استقبال / سكرتاريا (Secretary)</option>
                  <option value="admin">مدير نظام (Admin)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold shadow-md shadow-pullman-orange/20"
                >
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

