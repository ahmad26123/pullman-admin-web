'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  CheckCircle2, 
  X, 
  Trash2, 
  BadgeCheck 
} from 'lucide-react';
import { IBooking, ITrip } from '../../types';

interface BookingsViewProps {
  bookings: IBooking[];
  trips: ITrip[];
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCancelBooking: (bookingId: string) => Promise<boolean>;
  onCreateBooking: (tripId: string, seatNumbers: number[], customerName: string) => Promise<boolean>;
}

export default function BookingsView({
  bookings,
  trips,
  onConfirmBooking,
  onCancelBooking,
  onCreateBooking,
}: BookingsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenuBookingId, setActiveMenuBookingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Booking Form State
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?._id || '');
  const [seatNumberInput, setSeatNumberInput] = useState<number>(10);
  const [customerNameInput, setCustomerNameInput] = useState('حسام العلي');

  const filteredBookings = bookings.filter((b: any) => {
    const custName = b.customerId?.name || b.customerName || '';
    const tripRoute = typeof b.tripId === 'object' ? `${b.tripId.source} ← ${b.tripId.destination}` : '';
    const bId = b._id || '';

    const matchesSearch =
      custName.includes(searchTerm) ||
      tripRoute.includes(searchTerm) ||
      bId.includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const handleConfirm = async (id: string) => {
    setActiveMenuBookingId(null);
    const ok = await onConfirmBooking(id);
    if (ok) {
      showNotice('تم تأكيد الحجز واستلام الدفعة النقدية بنجاح');
    }
  };

  const handleCancel = async (id: string) => {
    setActiveMenuBookingId(null);
    if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز وتحرير المقاعد؟')) {
      const ok = await onCancelBooking(id);
      if (ok) {
        showNotice('تم إلغاء الحجز وتحرير المقاعد للزبائن');
      }
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onCreateBooking(selectedTripId, [Number(seatNumberInput)], customerNameInput);
    if (ok) {
      setIsAddModalOpen(false);
      showNotice(`تم إنشاء الحجز للزبون ${customerNameInput} بنجاح`);
    }
  };

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-pullman-dark text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-pullman-orange block mb-1">
            مساحة العمل
          </span>
          <h2 className="text-2xl font-extrabold text-pullman-gray-text tracking-tight">
            إدارة الحجوزات
          </h2>
          <p className="text-xs text-pullman-gray-muted mt-0.5">
            الحجوزات المؤكدة والمعلقة لجميع رحلات اليوم.
          </p>
        </div>

        {/* Action Button: Add Booking */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-pullman-orange hover:bg-pullman-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pullman-orange/20 transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>حجز جديد</span>
        </button>
      </div>

      {/* Search and Filter Bar matching Image 3 */}
      <div className="bg-white rounded-2xl p-4 border border-pullman-gray-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في إدارة الحجوزات..."
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
              <option value="reserved">محجوز مؤقتاً</option>
              <option value="confirmed">مثبت نقداً</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-semibold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              <option value="today">اليوم</option>
              <option value="all">الكل</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-pullman-gray-muted font-bold whitespace-nowrap mr-2">
            {filteredBookings.length} نتائج
          </span>
        </div>
      </div>

      {/* Bookings Table matching Image 3 */}
      <div className="bg-white rounded-2xl border border-pullman-gray-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-pullman-gray-muted font-bold">
                <th className="py-4 px-5">رقم الحجز</th>
                <th className="py-4 px-4">الزبون</th>
                <th className="py-4 px-4">الرحلة</th>
                <th className="py-4 px-4">المقعد</th>
                <th className="py-4 px-4">الموعد</th>
                <th className="py-4 px-4">الحالة</th>
                <th className="py-4 px-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredBookings.map((b: any, idx) => {
                const customer = b.customerId || {};
                const trip = b.tripId || {};
                const isConfirmed = b.status === 'confirmed';
                const seatStr = b.seatNumbers?.join(', ') || '09';
                const bookingCode = `#BK-${1021 - idx}`;

                return (
                  <tr key={b._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* رقم الحجز */}
                    <td className="py-4 px-5 font-bold font-mono text-pullman-gray-text" dir="ltr">
                      {bookingCode}
                    </td>

                    {/* الزبون */}
                    <td className="py-4 px-4 font-bold text-pullman-gray-text">
                      {customer.name || 'ليان أحمد'}
                    </td>

                    {/* الرحلة */}
                    <td className="py-4 px-4 text-pullman-gray-text font-semibold">
                      {trip.source || 'دمشق'} ← {trip.destination || 'حلب'}
                    </td>

                    {/* المقعد */}
                    <td className="py-4 px-4 font-mono font-bold text-pullman-gray-text">
                      {seatStr.padStart(2, '0')}
                    </td>

                    {/* الموعد */}
                    <td className="py-4 px-4 text-pullman-gray-muted font-mono" dir="ltr">
                      {trip.tripTime || '08:30'}
                    </td>

                    {/* الحالة */}
                    <td className="py-4 px-4">
                      {isConfirmed ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          مثبت نقداً
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          محجوز مؤقتاً
                        </span>
                      )}
                    </td>

                    {/* الإجراءات */}
                    <td className="py-4 px-5 text-center relative">
                      <button
                        onClick={() => setActiveMenuBookingId(activeMenuBookingId === b._id ? null : b._id)}
                        className="p-1.5 text-gray-400 hover:text-pullman-gray-text hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuBookingId === b._id && (
                        <div className="absolute left-6 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-right animate-in fade-in zoom-in-95">
                          {!isConfirmed && (
                            <button
                              onClick={() => handleConfirm(b._id)}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <BadgeCheck className="w-4 h-4 text-emerald-600" />
                              <span>تثبيت بعد استلام النقد</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(b._id)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>إلغاء الحجز</span>
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

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pullman-gray-muted">
          <div>
            عرض 1-{filteredBookings.length} من 24
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

      {/* Modal: New Booking */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">تسجيل حجز جديد</h3>
                <p className="text-xs text-pullman-gray-muted">حجز مقعد واستلام الدفعة النقدية</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">اسم الزبون</label>
                <input
                  type="text"
                  required
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                />
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">الرحلة</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                >
                  {trips.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.source} ← {t.destination} ({t.tripTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">رقم المقعد</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  required
                  value={seatNumberInput}
                  onChange={(e) => setSeatNumberInput(Number(e.target.value))}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-bold text-pullman-gray-text"
                />
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
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

