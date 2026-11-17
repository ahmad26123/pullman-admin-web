'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { ITrip, IBusModel, ScheduleType } from '../../types';

interface TripsViewProps {
  trips: ITrip[];
  busModels: IBusModel[];
  onCreateTrip: (newTrip: Partial<ITrip>) => void;
  onRescheduleTrip: (tripId: string, newDate: string, newTime: string) => void;
  onUpdateTripPrice: (tripId: string, newPrice: number) => { success: boolean; error?: string };
  onDeleteTrip: (tripId: string) => { success: boolean; error?: string };
}

export default function TripsView({
  trips,
  busModels,
  onCreateTrip,
  onRescheduleTrip,
  onUpdateTripPrice,
  onDeleteTrip,
}: TripsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenuTripId, setActiveMenuTripId] = useState<string | null>(null);

  // Reschedule Modal
  const [rescheduleTrip, setRescheduleTrip] = useState<ITrip | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Edit Price Modal
  const [priceTrip, setPriceTrip] = useState<ITrip | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Delete Trip Modal
  const [deleteTripTarget, setDeleteTripTarget] = useState<ITrip | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Success notification
  const [notification, setNotification] = useState<string | null>(null);

  // Form state for creating trip
  const [source, setSource] = useState('دمشق');
  const [destination, setDestination] = useState('حلب');
  const [selectedBusModelId, setSelectedBusModelId] = useState(busModels[0]?._id || '');
  const [price, setPrice] = useState<number>(85000);
  const [tripDate, setTripDate] = useState('24 أيار');
  const [tripTime, setTripTime] = useState('09:00');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.source.includes(searchTerm) ||
      trip.destination.includes(searchTerm) ||
      (trip.busModelTitle && trip.busModelTitle.includes(searchTerm));
    
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && trip.status !== statusFilter) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const model = busModels.find(m => m._id === selectedBusModelId) || busModels[0];

    onCreateTrip({
      source,
      destination,
      busModelId: selectedBusModelId,
      busModelTitle: model?.title || 'بولمان سياحي',
      price: Number(price),
      tripDate,
      tripTime,
      scheduleType,
      status: 'scheduled',
      occupancyRate: 0,
      hasBookings: false,
      totalBookings: 0,
    });

    setIsCreateModalOpen(false);
    showNotice('تم إنشاء الرحلة وجدولتها بنجاح');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTrip) return;
    onRescheduleTrip(rescheduleTrip._id, newDate, newTime);
    setRescheduleTrip(null);
    showNotice(`تمت إعادة جدولة الرحلة ${rescheduleTrip.tripNumber} وتحويل الحجوزات المؤكدة للمتابعة`);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceTrip) return;
    const res = onUpdateTripPrice(priceTrip._id, newPrice);
    if (!res.success) {
      setPriceError(res.error || 'فشل التعديل');
    } else {
      setPriceTrip(null);
      setPriceError(null);
      showNotice(`تم تعديل سعر الرحلة ${priceTrip.tripNumber} بنجاح`);
    }
  };

  const handleDeleteSubmit = () => {
    if (!deleteTripTarget) return;
    const res = onDeleteTrip(deleteTripTarget._id);
    if (!res.success) {
      setDeleteError(res.error || 'فشل الحذف');
    } else {
      setDeleteTripTarget(null);
      setDeleteError(null);
      showNotice(`تم حذف الرحلة ${deleteTripTarget.tripNumber} بنجاح`);
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
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
            إدارة الرحلات
          </h2>
          <p className="text-xs text-pullman-gray-muted mt-0.5">
            جدولة الرحلات ومتابعة حالتها ونسب الإشغال.
          </p>
        </div>

        {/* Action Button: Create Trip */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-pullman-orange hover:bg-pullman-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pullman-orange/20 transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إنشاء رحلة</span>
        </button>
      </div>

      {/* Filter and Search Bar matching Figma */}
      <div className="bg-white rounded-2xl p-4 border border-pullman-gray-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input on Right in RTL */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في إدارة الرحلات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-10 pl-4 py-2.5 text-pullman-gray-text focus:outline-none focus:border-pullman-orange transition-colors"
          />
        </div>

        {/* Dropdowns & Count */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-semibold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="scheduled">مجدولة</option>
              <option value="active">نشطة</option>
              <option value="completed">مكتملة</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-semibold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              <option value="today">اليوم</option>
              <option value="this_week">هذا الأسبوع</option>
              <option value="this_month">هذا الشهر</option>
              <option value="all_dates">كل التواريخ</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Results Count Badge */}
          <span className="text-xs text-pullman-gray-muted font-bold whitespace-nowrap mr-2">
            {filteredTrips.length} نتائج
          </span>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-pullman-gray-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-pullman-gray-muted font-bold">
                <th className="py-4 px-5">رقم الرحلة</th>
                <th className="py-4 px-4">خط السير</th>
                <th className="py-4 px-4">التاريخ والموعد</th>
                <th className="py-4 px-4">البولمان</th>
                <th className="py-4 px-4">الإشغال</th>
                <th className="py-4 px-4">الحالة</th>
                <th className="py-4 px-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-semibold">
                    لا توجد رحلات مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* رقم الرحلة */}
                    <td className="py-4 px-5 font-bold text-pullman-gray-text">
                      {trip.tripNumber}
                    </td>

                    {/* خط السير */}
                    <td className="py-4 px-4 text-pullman-gray-text font-bold">
                      {trip.source} ← {trip.destination}
                    </td>

                    {/* التاريخ والموعد */}
                    <td className="py-4 px-4 text-pullman-gray-muted">
                      {trip.tripDate} • {trip.tripTime}
                    </td>

                    {/* البولمان */}
                    <td className="py-4 px-4 text-pullman-gray-text">
                      {trip.busModelTitle}
                    </td>

                    {/* الإشغال */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-pullman-gray-text w-7">
                          {trip.occupancyRate}%
                        </span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pullman-orange rounded-full transition-all duration-300"
                            style={{ width: `${trip.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* الحالة */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {trip.status === 'scheduled' ? 'مجدولة' : trip.status === 'active' ? 'نشطة' : 'مكتملة'}
                      </span>
                    </td>

                    {/* الإجراءات */}
                    <td className="py-4 px-5 text-center relative">
                      <button
                        onClick={() => setActiveMenuTripId(activeMenuTripId === trip._id ? null : trip._id)}
                        className="p-1.5 text-gray-400 hover:text-pullman-gray-text hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuTripId === trip._id && (
                        <div className="absolute left-6 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-right animate-in fade-in zoom-in-95">
                          {/* Reschedule Button */}
                          <button
                            onClick={() => {
                              setRescheduleTrip(trip);
                              setNewDate(trip.tripDate);
                              setNewTime(trip.tripTime);
                              setActiveMenuTripId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-pullman-orange transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-pullman-orange" />
                            <span>إعادة جدولة الموعد</span>
                          </button>

                          {/* Edit Price Button */}
                          <button
                            onClick={() => {
                              setPriceTrip(trip);
                              setNewPrice(trip.price);
                              setPriceError(null);
                              setActiveMenuTripId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-pullman-orange transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-pullman-orange" />
                            <span>تعديل سعر التذكرة</span>
                          </button>

                          <div className="h-[1px] bg-gray-100 my-1" />

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setDeleteTripTarget(trip);
                              setDeleteError(null);
                              setActiveMenuTripId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف الرحلة</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching Figma */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pullman-gray-muted">
          <div>
            عرض 1-{filteredTrips.length} من 24
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

      {/* ======================= MODALS ======================= */}

      {/* Modal 1: Create Trip Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">إنشاء رحلة جديدة</h3>
                <p className="text-xs text-pullman-gray-muted">حدد تفاصيل خط السير والبولمان والجدولة الدورية</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">نقطة الانطلاق</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value="دمشق">دمشق</option>
                    <option value="حلب">حلب</option>
                    <option value="حمص">حمص</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                    <option value="حماة">حماة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">نقطة الوصول</label>
                  <select 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value="حلب">حلب</option>
                    <option value="دمشق">دمشق</option>
                    <option value="حمص">حمص</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                    <option value="حماة">حماة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">طراز البولمان المخصص</label>
                <select
                  value={selectedBusModelId}
                  onChange={(e) => setSelectedBusModelId(e.target.value)}
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                >
                  {busModels.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.title} ({model.capacity} مقعداً - {model.layoutDetails?.seatingPattern})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">سعر المقعد (ل.س)</label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">تاريخ المغادرة</label>
                  <input
                    type="text"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    required
                    placeholder="مثال: 24 أيار"
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">وقت المغادرة</label>
                  <input
                    type="text"
                    value={tripTime}
                    onChange={(e) => setTripTime(e.target.value)}
                    required
                    placeholder="08:30"
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">الجدولة الدورية</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['manual', 'daily', 'weekly', 'monthly'] as ScheduleType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setScheduleType(type)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        scheduleType === type
                          ? 'border-pullman-orange bg-pullman-orange-light text-pullman-orange'
                          : 'border-pullman-gray-border bg-white text-pullman-gray-muted hover:bg-gray-50'
                      }`}
                    >
                      {type === 'manual' ? 'يدوي' : type === 'daily' ? 'يومي' : type === 'weekly' ? 'أسبوعي' : 'شهري'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold shadow-md shadow-pullman-orange/20"
                >
                  إنشاء وحفظ الرحلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Reschedule Trip Modal */}
      {rescheduleTrip && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">إعادة جدولة الرحلة {rescheduleTrip.tripNumber}</h3>
                <p className="text-xs text-pullman-gray-muted">{rescheduleTrip.source} ← {rescheduleTrip.destination}</p>
              </div>
              <button onClick={() => setRescheduleTrip(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4 text-xs">
              {/* Alert about business rules */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">تنبيه آلي:</span> سيؤدي تغيير موعد الرحلة إلى تحويل كافة الحجوزات المؤكدة تلقائياً إلى حالة معلقة (Reserved) وإنشاء سجل متابعة لموظف الاستقبال للتواصل مع الزبائن وتأكيد الموعد الجديد.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">التاريخ الجديد</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">وقت المغادرة الجديد</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTrip(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold shadow-md shadow-pullman-orange/20"
                >
                  تأكيد إعادة الجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Price Modal */}
      {priceTrip && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">تعديل سعر الرحلة {priceTrip.tripNumber}</h3>
                <p className="text-xs text-pullman-gray-muted">السعر الحالي: {priceTrip.price.toLocaleString()} ل.س</p>
              </div>
              <button onClick={() => setPriceTrip(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePriceSubmit} className="p-6 space-y-4 text-xs">
              {priceTrip.hasBookings ? (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2.5 text-red-800">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold">قيد إداري صارم:</span> لا يمكن تعديل سعر الرحلة إطلاقاً لأن هناك حجوزات نشطة أو مؤكدة مرتبطة بها وفق قواعد النظام (Rule TC-003).
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">السعر الجديد (ل.س)</label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    required
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
              )}

              {priceError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
                  {priceError}
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPriceTrip(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إغلاق
                </button>
                {!priceTrip.hasBookings && (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold shadow-md shadow-pullman-orange/20"
                  >
                    حفظ السعر الجديد
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Trip Modal */}
      {deleteTripTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">حذف الرحلة {deleteTripTarget.tripNumber}</h3>
                <p className="text-xs text-pullman-gray-muted">{deleteTripTarget.source} ← {deleteTripTarget.destination}</p>
              </div>
              <button onClick={() => setDeleteTripTarget(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {deleteTripTarget.hasBookings ? (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2.5 text-red-800">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold">قيد نظام صارم (TC-004):</span> يمنع حذف أي رحلة ارتبط بها أي حجز حالي أو تاريخي لحماية السجلات المالية وحقوق الركاب.
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed font-medium">
                  هل أنت متأكد من رغبتك في حذف الرحلة <span className="font-bold text-pullman-gray-text">{deleteTripTarget.tripNumber}</span> نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
                </p>
              )}

              {deleteError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
                  {deleteError}
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTripTarget(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                {!deleteTripTarget.hasBookings && (
                  <button
                    type="button"
                    onClick={handleDeleteSubmit}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
                  >
                    تأكيد الحذف
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

