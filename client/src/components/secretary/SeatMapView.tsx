'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Bus, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  X, 
  BadgeCheck, 
  Trash2, 
  Check, 
  Info,
  UserPlus
} from 'lucide-react';
import SeatMap, { ISeatInfo } from './SeatMap';
import { ITrip, IBooking, IUser } from '../../types';

interface SeatMapViewProps {
  trips: ITrip[];
  selectedTripId: string;
  onSelectTrip: (tripId: string) => void;
  seats: ISeatInfo[];
  bookings: IBooking[];
  customers: IUser[];
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCancelBooking: (bookingId: string) => Promise<boolean>;
  onMultiSeatBooking: (
    tripId: string, 
    seatNumbers: number[], 
    customerId?: string, 
    customerUsername?: string
  ) => Promise<boolean>;
}

export default function SeatMapView({
  trips = [],
  selectedTripId,
  onSelectTrip,
  seats = [],
  bookings = [],
  customers = [],
  onConfirmBooking,
  onCancelBooking,
  onMultiSeatBooking,
}: SeatMapViewProps) {
  // Standalone multi-seat selection for new direct bookings
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);
  // Additional seats to add to an inspected customer's reservation
  const [additionalSeats, setAdditionalSeats] = useState<number[]>([]);
  // Inspected seat for customer inspection mode
  const [inspectedSeat, setInspectedSeat] = useState<ISeatInfo | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers?.[0]?._id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedTrip = trips.find((t) => t._id === selectedTripId) || trips[0];
  const tripPrice = selectedTrip?.price || 125000;

  // Compute all seat numbers belonging to the inspected customer across the current trip
  const highlightedCustomerSeats = inspectedSeat
    ? seats
        .filter((s) => {
          if (s.status === 'available') return false;
          if (inspectedSeat.customerId && s.customerId && s.customerId === inspectedSeat.customerId) return true;
          if (inspectedSeat.customerName && s.customerName && s.customerName === inspectedSeat.customerName) return true;
          if (inspectedSeat.bookingId && s.bookingId && s.bookingId === inspectedSeat.bookingId) return true;
          return false;
        })
        .map((s) => s.seatNumber)
    : [];

  const handleSeatClick = (seat: ISeatInfo) => {
    if (seat.status === 'available') {
      if (inspectedSeat) {
        // Toggle this available seat in additionalSeats for the inspected customer
        if (additionalSeats.includes(seat.seatNumber)) {
          setAdditionalSeats((prev) => prev.filter((s) => s !== seat.seatNumber));
        } else {
          setAdditionalSeats((prev) => [...prev, seat.seatNumber].sort((a, b) => a - b));
        }
      } else {
        // Normal multi-seat selection
        if (selectedSeatNumbers.includes(seat.seatNumber)) {
          setSelectedSeatNumbers((prev) => prev.filter((s) => s !== seat.seatNumber));
        } else {
          setSelectedSeatNumbers((prev) => [...prev, seat.seatNumber].sort((a, b) => a - b));
        }
      }
    } else {
      // Booked seat: switch inspection to this customer
      setInspectedSeat(seat);
      setAdditionalSeats([]);
      setSelectedSeatNumbers([]);
    }
  };

  const handleConfirmInspected = async () => {
    if (!inspectedSeat?.bookingId) return;
    setIsProcessing(true);
    try {
      const ok = await onConfirmBooking(inspectedSeat.bookingId);
      if (ok) {
        showNotice(`تم استلام المبلغ وتثبيت المقعد رقم ${inspectedSeat.seatNumber} للزبون ${inspectedSeat.customerName || ''}`);
        setInspectedSeat(null);
        setAdditionalSeats([]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelInspected = async () => {
    if (!inspectedSeat?.bookingId) return;
    if (confirm(`هل أنت متأكد من إلغاء حجز المقعد رقم ${inspectedSeat.seatNumber} للزبون ${inspectedSeat.customerName || ''}؟`)) {
      setIsProcessing(true);
      try {
        const ok = await onCancelBooking(inspectedSeat.bookingId);
        if (ok) {
          showNotice(`تم إلغاء الحجز وتحرير المقعد رقم ${inspectedSeat.seatNumber} بنجاح`);
          setInspectedSeat(null);
          setAdditionalSeats([]);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddSeatsToInspectedCustomer = async () => {
    if (additionalSeats.length === 0 || !selectedTrip || !inspectedSeat) return;
    setIsProcessing(true);
    try {
      const ok = await onMultiSeatBooking(
        selectedTrip._id,
        additionalSeats,
        inspectedSeat.customerId,
        inspectedSeat.customerUsername
      );
      if (ok) {
        showNotice(`تمت إضافة وحجز المقاعد [${additionalSeats.join(', ')}] بنجاح باسم ${inspectedSeat.customerName}!`);
        setAdditionalSeats([]);
        setInspectedSeat(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookSelectedSeats = async () => {
    if (selectedSeatNumbers.length === 0 || !selectedTrip) return;
    setIsProcessing(true);
    try {
      const ok = await onMultiSeatBooking(selectedTrip._id, selectedSeatNumbers, selectedCustomerId);
      if (ok) {
        showNotice(`تم تثبيت وحجز المقاعد [${selectedSeatNumbers.join(', ')}] نقداً بنجاح!`);
        setSelectedSeatNumbers([]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const showNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real-time seat counts for the selected trip
  const reservedCount = seats.filter((s) => s.status === 'reserved').length;
  const confirmedCount = seats.filter((s) => s.status === 'confirmed').length;
  const availableCount = seats.filter((s) => s.status === 'available').length;

  const activeSelectedSeats = inspectedSeat ? additionalSeats : selectedSeatNumbers;

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
            خريطة المقاعد
          </h2>
          <p className="text-xs text-pullman-gray-muted mt-0.5">
            راقب حالة كل مقعد وتلقى الحجوزات النقدية.
          </p>
        </div>

        {/* Action Button: Quick Direct Booking */}
        <button
          onClick={() => {
            const avail = seats.find((s) => s.status === 'available');
            if (avail) {
              setInspectedSeat(null);
              setAdditionalSeats([]);
              setSelectedSeatNumbers([avail.seatNumber]);
            }
          }}
          className="flex items-center gap-2 bg-pullman-orange hover:bg-pullman-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pullman-orange/20 transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>حجز مباشر</span>
        </button>
      </div>

      {/* Top Trip Selection Bar matching Image 2 with Real Counts */}
      <div className="bg-white rounded-2xl p-4 border border-pullman-gray-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dynamic Status Counts from DB */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-pullman-gray-text">
            <span className="w-3 h-3 rounded bg-pullman-orange" />
            <span>{reservedCount} محجوز (تطبيق)</span>
          </div>
          <div className="flex items-center gap-1.5 text-pullman-gray-text">
            <span className="w-3 h-3 rounded bg-pullman-dark" />
            <span>{confirmedCount} مثبت (نقداً)</span>
          </div>
          <div className="flex items-center gap-1.5 text-pullman-gray-muted">
            <span className="w-3 h-3 rounded border border-gray-300 bg-white" />
            <span>{availableCount} متاح</span>
          </div>
        </div>

        {/* Trip Dropdown */}
        <div className="relative w-full md:w-80">
          <label className="text-[10px] text-gray-400 font-bold block mb-1">
            الرحلة المختارة
          </label>
          <div className="relative">
            <select
              value={selectedTrip?._id}
              onChange={(e) => {
                onSelectTrip(e.target.value);
                setSelectedSeatNumbers([]);
                setAdditionalSeats([]);
                setInspectedSeat(null);
              }}
              className="appearance-none w-full bg-pullman-gray-light border border-pullman-gray-border text-xs rounded-xl pr-4 pl-9 py-2.5 text-pullman-gray-text font-bold focus:outline-none focus:border-pullman-orange cursor-pointer"
            >
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.source} ← {trip.destination} - {trip.tripTime} • {trip.tripNumber || '#1025'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Interactive Seat Map & Action Panel */}
      <div className="bg-white rounded-2xl p-6 border border-pullman-gray-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Subpanel: Customer Inspection OR Multi-seat Booking */}
          <div className="md:col-span-5 bg-pullman-gray-light/60 rounded-2xl p-6 border border-pullman-gray-border space-y-5">
            {inspectedSeat ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 block mb-0.5">
                      تفاصيل الحجز والزبون
                    </span>
                    <h4 className="text-xl font-black text-pullman-gray-text">
                      {inspectedSeat.customerName || 'زبون المحطة'}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setInspectedSeat(null);
                      setAdditionalSeats([]);
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white rounded-xl p-4 border border-pullman-gray-border space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pullman-gray-text font-bold">
                      <User className="w-4 h-4 text-pullman-orange" />
                      <span>{inspectedSeat.customerName || 'زبون تطبيق الموبايل'}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">@{inspectedSeat.customerUsername || 'customer'}</span>
                  </div>

                  {inspectedSeat.customerPhone && (
                    <div className="flex items-center gap-2 text-pullman-gray-muted font-mono" dir="ltr">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{inspectedSeat.customerPhone}</span>
                    </div>
                  )}

                  {/* All Booked Seats for this customer */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-500 font-medium block mb-1">
                      المقاعد المحجوزة باسمه ({highlightedCustomerSeats.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {highlightedCustomerSeats.map((num) => {
                        const sObj = seats.find((s) => s.seatNumber === num);
                        const isConf = sObj?.status === 'confirmed';
                        return (
                          <span
                            key={num}
                            className={`px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 ${
                              isConf
                                ? 'bg-pullman-dark text-white'
                                : 'bg-pullman-orange text-white'
                            }`}
                          >
                            <span>مقعد {num}</span>
                            <span className="text-[9px] opacity-80">
                              {isConf ? '(مثبت)' : '(مؤقت)'}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ADDING MORE SEATS FOR THIS CUSTOMER */}
                <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>إضافة مقاعد جديدة لهذا الزبون</span>
                    </div>
                    {additionalSeats.length > 0 && (
                      <button
                        onClick={() => setAdditionalSeats([])}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        إلغاء التحديد
                      </button>
                    )}
                  </div>

                  {additionalSeats.length === 0 ? (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      انقر على أي مقاعد فارغة (بيضاء) بالخريطة لإضافتها وحجزها باسم {inspectedSeat.customerName}
                    </p>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {additionalSeats.map((sNum) => (
                          <span
                            key={sNum}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-sm"
                          >
                            <span>+ مقعد {sNum}</span>
                            <button
                              type="button"
                              onClick={() => setAdditionalSeats((prev) => prev.filter((s) => s !== sNum))}
                              className="hover:bg-emerald-700 rounded p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-baseline justify-between text-xs pt-1 border-t border-emerald-200">
                        <span className="text-emerald-800 font-medium">المبلغ الإضافي المطلوب:</span>
                        <span className="text-base font-black text-emerald-900">
                          {(additionalSeats.length * tripPrice).toLocaleString()} ل.س
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleAddSeatsToInspectedCustomer}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>
                          {isProcessing
                            ? 'جاري إضافة المقاعد...'
                            : `تأكيد وحجز (${additionalSeats.length}) مقاعد إضافية باسمه نقداً`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions for current selected seat */}
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 block">
                    إجراءات المقعد الحالي (#{inspectedSeat.seatNumber}):
                  </span>

                  {inspectedSeat.status === 'reserved' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleConfirmInspected}
                      className="w-full py-3 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold text-xs shadow-md shadow-pullman-orange/20 transition-all flex items-center justify-center gap-2"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>{isProcessing ? 'جاري التثبيت...' : 'تثبيت واستلام نقدي'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCancelInspected}
                      className="flex-1 py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إلغاء حجز مقعد {inspectedSeat.seatNumber}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInspectedSeat(null);
                        setAdditionalSeats([]);
                      }}
                      className="py-2 px-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs font-bold"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= MODE 2: MULTI-SEAT NEW BOOKING ================= */
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-pullman-orange block mb-0.5">
                    ملخص الحجز
                  </span>
                  <h4 className="text-xl font-black text-pullman-gray-text">
                    {selectedTrip?.source} ← {selectedTrip?.destination}
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-pullman-gray-text font-semibold pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-pullman-gray-muted font-normal flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>التاريخ</span>
                    </span>
                    <span>{selectedTrip?.tripDate || '24 أيار 2025'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-pullman-gray-muted font-normal flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>الانطلاق</span>
                    </span>
                    <span>{selectedTrip?.tripTime} صباحاً</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-pullman-gray-muted font-normal flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-gray-400" />
                      <span>نوع البولمان</span>
                    </span>
                    <span>{selectedTrip?.busModelTitle || 'VIP رجال أعمال'}</span>
                  </div>
                </div>

                {/* Multi-seat selection display */}
                <div className="pt-2 border-t border-gray-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-pullman-gray-muted font-medium">
                      المقاعد المحددة ({selectedSeatNumbers.length})
                    </span>
                    {selectedSeatNumbers.length > 0 && (
                      <button
                        onClick={() => setSelectedSeatNumbers([])}
                        className="text-[11px] text-red-500 font-bold hover:underline"
                      >
                        مسح الكل
                      </button>
                    )}
                  </div>

                  {selectedSeatNumbers.length === 0 ? (
                    <div className="p-3 bg-white rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-400">
                      <Info className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <span>انقر على مقعد أو أكثر من الخريطة لحجزهم معاً</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeatNumbers.map((num) => (
                        <span
                          key={num}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-sm"
                        >
                          <span>مقعد {num}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedSeatNumbers((prev) => prev.filter((s) => s !== num))}
                            className="hover:bg-emerald-700 rounded p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Selection */}
                <div className="pt-2 border-t border-gray-200/80">
                  <label className="block text-xs font-bold text-pullman-gray-text mb-1.5">
                    حجز باسم الزبون
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-white border border-pullman-gray-border rounded-xl p-2.5 font-bold text-xs text-pullman-gray-text focus:outline-none focus:border-pullman-orange"
                  >
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.phone || c.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-200/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-pullman-gray-muted font-medium">المجموع الكلي</span>
                    <div className="text-2xl font-black text-pullman-gray-text tracking-tight">
                      {((selectedSeatNumbers.length || 1) * tripPrice).toLocaleString()}{' '}
                      <span className="text-xs font-bold text-pullman-gray-muted">ل.س</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing || selectedSeatNumbers.length === 0}
                  onClick={handleBookSelectedSeats}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    selectedSeatNumbers.length === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-pullman-orange hover:bg-pullman-orange-hover shadow-pullman-orange/20'
                  }`}
                >
                  <span>
                    {isProcessing
                      ? 'جاري الحجز والتثبيت...'
                      : selectedSeatNumbers.length === 0
                      ? 'حدد مقاعد للحجز'
                      : `تثبيت وحجز (${selectedSeatNumbers.length}) مقاعد نقداً`}
                  </span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>تثبيت نقدي فوري مع خصم مباشر من مقاعد الرحلة</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Subpanel: Seat Map Interactive (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="text-center mb-4">
              <span className="text-[11px] font-bold text-pullman-orange block">
                خريطة المقاعد التفاعلية
              </span>
              <h4 className="text-lg font-black text-pullman-gray-text">
                اختر المقاعد للحجز أو انقر لمعاينة الزبون
              </h4>
            </div>

            <SeatMap
              seats={seats}
              selectedSeatNumbers={activeSelectedSeats}
              highlightedCustomerSeats={highlightedCustomerSeats}
              inspectedSeatNumber={inspectedSeat?.seatNumber || null}
              onSeatClick={handleSeatClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
