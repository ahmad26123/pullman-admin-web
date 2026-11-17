'use client';

import React from 'react';
import { CircleDot } from 'lucide-react';

export type SeatStatus = 'available' | 'reserved' | 'confirmed';

export interface ISeatInfo {
  seatNumber: number;
  status: SeatStatus;
  bookingId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerUsername?: string;
  bookingDate?: string;
  price?: number;
}

interface SeatMapProps {
  seats: ISeatInfo[];
  selectedSeatNumbers?: number[];
  highlightedCustomerSeats?: number[];
  inspectedSeatNumber?: number | null;
  onSeatClick: (seat: ISeatInfo) => void;
}

export default function SeatMap({
  seats = [],
  selectedSeatNumbers = [],
  highlightedCustomerSeats = [],
  inspectedSeatNumber = null,
  onSeatClick,
}: SeatMapProps) {
  const rowsCount = 8;
  const seatsPerRow = 4;

  const getSeat = (num: number): ISeatInfo => {
    return (
      seats.find((s) => s.seatNumber === num) || {
        seatNumber: num,
        status: 'available',
      }
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs font-bold text-pullman-gray-text mb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border-2 border-gray-300 bg-white inline-block" />
          <span className="text-pullman-gray-muted">متاح</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-pullman-orange inline-block" />
          <span>محجوز (تطبيق)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-pullman-dark inline-block" />
          <span>مثبت (نقداً)</span>
        </div>
      </div>

      {/* Bus Container Mockup matching Figma Image 1 & 2 */}
      <div className="relative w-80 bg-white border-2 border-orange-200/80 rounded-[44px] p-6 shadow-sm select-none">
        {/* Top of Bus: Front glass & steering wheel */}
        <div className="flex items-center justify-between pb-5 mb-4 border-b border-gray-100 px-3">
          <span className="text-[10px] font-bold text-gray-400">مقدمة الباص</span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-[10px] font-semibold">السائق</span>
            <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <CircleDot className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Seats Grid: 8 rows of 4 seats */}
        <div className="space-y-3">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => {
            const s1 = rowIndex * seatsPerRow + 1;
            const s2 = rowIndex * seatsPerRow + 2;
            const s3 = rowIndex * seatsPerRow + 3;
            const s4 = rowIndex * seatsPerRow + 4;

            const seatObj1 = getSeat(s1);
            const seatObj2 = getSeat(s2);
            const seatObj3 = getSeat(s3);
            const seatObj4 = getSeat(s4);

            return (
              <div key={rowIndex} className="flex items-center justify-between">
                {/* Right side pair (seats 1, 2) in RTL */}
                <div className="flex items-center gap-2">
                  <SeatButton
                    seat={seatObj1}
                    isSelected={selectedSeatNumbers.includes(seatObj1.seatNumber)}
                    isHighlightedCustomer={highlightedCustomerSeats.includes(seatObj1.seatNumber)}
                    isInspected={inspectedSeatNumber === seatObj1.seatNumber}
                    onClick={() => onSeatClick(seatObj1)}
                  />
                  <SeatButton
                    seat={seatObj2}
                    isSelected={selectedSeatNumbers.includes(seatObj2.seatNumber)}
                    isHighlightedCustomer={highlightedCustomerSeats.includes(seatObj2.seatNumber)}
                    isInspected={inspectedSeatNumber === seatObj2.seatNumber}
                    onClick={() => onSeatClick(seatObj2)}
                  />
                </div>

                {/* Central Aisle */}
                <div className="w-7 text-center">
                  <span className="text-[9px] text-gray-300 font-bold">||</span>
                </div>

                {/* Left side pair (seats 3, 4) in RTL */}
                <div className="flex items-center gap-2">
                  <SeatButton
                    seat={seatObj3}
                    isSelected={selectedSeatNumbers.includes(seatObj3.seatNumber)}
                    isHighlightedCustomer={highlightedCustomerSeats.includes(seatObj3.seatNumber)}
                    isInspected={inspectedSeatNumber === seatObj3.seatNumber}
                    onClick={() => onSeatClick(seatObj3)}
                  />
                  <SeatButton
                    seat={seatObj4}
                    isSelected={selectedSeatNumbers.includes(seatObj4.seatNumber)}
                    isHighlightedCustomer={highlightedCustomerSeats.includes(seatObj4.seatNumber)}
                    isInspected={inspectedSeatNumber === seatObj4.seatNumber}
                    onClick={() => onSeatClick(seatObj4)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bus Entrance at bottom */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
            باب الصعود
          </span>
        </div>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  isSelected,
  isHighlightedCustomer,
  isInspected,
  onClick,
}: {
  seat: ISeatInfo;
  isSelected: boolean;
  isHighlightedCustomer: boolean;
  isInspected: boolean;
  onClick: () => void;
}) {
  let styleClasses = '';

  if (seat.status === 'confirmed') {
    styleClasses = 'bg-pullman-dark text-white border-pullman-dark shadow-sm';
  } else if (seat.status === 'reserved') {
    styleClasses = 'bg-pullman-orange text-white border-pullman-orange shadow-sm';
  } else if (isSelected) {
    styleClasses = 'bg-emerald-600 text-white border-emerald-600 shadow-md font-extrabold';
  } else {
    styleClasses = 'bg-gray-50 hover:bg-orange-50 text-pullman-gray-text border-gray-200';
  }

  let activeRing = '';
  if (isInspected) {
    activeRing = 'ring-4 ring-blue-600 scale-110 z-10';
  } else if (isHighlightedCustomer) {
    activeRing = 'ring-4 ring-blue-400/80 scale-105 animate-pulse';
  } else if (isSelected) {
    activeRing = 'ring-4 ring-emerald-400/60 scale-105';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-11 h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all duration-150 border ${styleClasses} ${activeRing}`}
      title={`مقعد ${seat.seatNumber} - ${
        seat.status === 'confirmed'
          ? `مثبت باسم: ${seat.customerName || 'زبون'}`
          : seat.status === 'reserved'
          ? `محجوز مؤقتاً باسم: ${seat.customerName || 'زبون'}`
          : isSelected
          ? 'محدد للحجز'
          : 'متاح للحجز'
      }`}
    >
      <div className="w-5 h-1 bg-current opacity-20 rounded-full mb-0.5" />
      <span>{seat.seatNumber}</span>
    </button>
  );
}
