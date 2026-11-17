'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Bus, 
  X, 
  CheckCircle2, 
  Settings, 
  Layers, 
  Check, 
  Wrench 
} from 'lucide-react';
import { IBusModel, BusCategory, BusSize, BusModelStatus } from '../../types';

interface BusModelsViewProps {
  busModels: IBusModel[];
  onUpdateFleet: (modelId: string, newCount: number, newStatus: BusModelStatus) => void;
  onAddModel: (newModel: Partial<IBusModel>) => void;
}

export default function BusModelsView({
  busModels,
  onUpdateFleet,
  onAddModel,
}: BusModelsViewProps) {
  const [selectedModel, setSelectedModel] = useState<IBusModel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Edit Fleet State
  const [editFleetCount, setEditFleetCount] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<BusModelStatus>('operational');

  // Add Model State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BusCategory>('first_class');
  const [newSize, setNewSize] = useState<BusSize>('large');
  const [newCapacity, setNewCapacity] = useState<number>(45);
  const [newPattern, setNewPattern] = useState('1 + 2');
  const [newFleetCount, setNewFleetCount] = useState<number>(5);

  const handleOpenEdit = (model: IBusModel) => {
    setSelectedModel(model);
    setEditFleetCount(model.totalBusesCount);
    setEditStatus(model.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) return;
    onUpdateFleet(selectedModel._id, editFleetCount, editStatus);
    showNotice(`تم تحديث أسطول ${selectedModel.title} بنجاح`);
    setSelectedModel(null);
  };

  const handleSaveNewModel = (e: React.FormEvent) => {
    e.preventDefault();
    onAddModel({
      title: newTitle,
      category: newCategory,
      size: newSize,
      capacity: Number(newCapacity),
      layoutDetails: {
        seatingPattern: newPattern,
        description: `توزيع مقاعد ${newPattern}`,
      },
      totalBusesCount: Number(newFleetCount),
      status: 'operational',
    });
    setIsAddModalOpen(false);
    showNotice('تمت إضافة نموذج البولمان الجديد إلى الأسطول');
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
            نماذج البولمان
          </h2>
          <p className="text-xs text-pullman-gray-muted mt-0.5">
            إدارة أنواع البولمانات وسعاتها وتخطيط المقاعد.
          </p>
        </div>

        {/* Action Button: Add Model */}
        <button
          onClick={() => {
            setNewTitle('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-pullman-orange hover:bg-pullman-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-pullman-orange/20 transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة نموذج</span>
        </button>
      </div>

      {/* Grid of Bus Model Cards matching Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {busModels.map((model, idx) => {
          // As shown in Figma Image 4: "بولمان سياحي" has an orange graphic panel, others have dark slate
          const isOrangeCard = model.title.includes('سياحي') || idx === 2;
          const isMaintenance = model.status === 'maintenance';

          return (
            <div
              key={model._id}
              className="bg-white rounded-2xl border border-pullman-gray-border shadow-sm overflow-hidden flex flex-col sm:flex-row justify-between hover:shadow-md transition-shadow group"
            >
              {/* Left / Content side in RTL */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Status Badge */}
                  <div>
                    {isMaintenance ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <Wrench className="w-3 h-3" />
                        <span>صيانة</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>تشغيل</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-pullman-gray-text tracking-tight">
                    {model.title}
                  </h3>

                  {/* Layout details & Fleet count */}
                  <p className="text-xs text-pullman-gray-muted font-medium">
                    تخطيط المقاعد {model.layoutDetails?.seatingPattern || '1 + 2'} • {model.totalBusesCount} بولمانات
                  </p>
                </div>

                {/* Manage Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenEdit(model)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-pullman-orange text-pullman-orange hover:bg-pullman-orange hover:text-white transition-all duration-200 font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>إدارة النموذج</span>
                  </button>
                </div>
              </div>

              {/* Right / Visual Graphic side in RTL */}
              <div 
                className={`w-full sm:w-44 p-6 flex flex-col items-center justify-between text-white shrink-0 ${
                  isOrangeCard 
                    ? 'bg-pullman-orange' 
                    : 'bg-pullman-dark-card'
                }`}
              >
                <div className="w-full flex justify-end">
                  {/* Optional indicator */}
                </div>

                {/* Central Bus Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner my-2">
                  <Bus className="w-8 h-8 text-white stroke-[1.8]" />
                </div>

                {/* Seat Capacity Badge */}
                <div className="text-xs font-bold text-white/90 tracking-wide">
                  {model.capacity} مقعداً
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODALS ================= */}

      {/* Modal 1: Manage Bus Model / Fleet */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">إدارة نموذج: {selectedModel.title}</h3>
                <p className="text-xs text-pullman-gray-muted">تعديل حجم الأسطول وحالة التشغيل</p>
              </div>
              <button onClick={() => setSelectedModel(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl space-y-1 text-gray-600">
                <div className="flex justify-between font-semibold">
                  <span>السعة الكلية:</span>
                  <span className="font-bold text-pullman-gray-text">{selectedModel.capacity} مقعداً</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>تخطيط المقاعد:</span>
                  <span className="font-bold text-pullman-gray-text">{selectedModel.layoutDetails?.seatingPattern}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">
                  عدد الباصات المتوفرة في الأسطول
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editFleetCount}
                  onChange={(e) => setEditFleetCount(Number(e.target.value))}
                  required
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-bold text-pullman-gray-text text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">
                  حالة الطراز
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('operational')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      editStatus === 'operational'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    تشغيل (جاهز للرحلات)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('maintenance')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      editStatus === 'maintenance'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    صيانة (موقوف مؤقتاً)
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModel(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pullman-orange hover:bg-pullman-orange-hover text-white font-bold shadow-md shadow-pullman-orange/20"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Bus Model Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-pullman-gray-text">إضافة نموذج بولمان جديد</h3>
                <p className="text-xs text-pullman-gray-muted">إضافة مواصفات الطراز الجديد وتوزيعه في الأسطول</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewModel} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-pullman-gray-text mb-1">اسم النموذج / الطراز</label>
                <input
                  type="text"
                  placeholder="مثال: بولمان درجة أولى بلاتينيوم"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">الفئة</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BusCategory)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value="first_class">درجة أولى (First Class)</option>
                    <option value="business_class">رجال أعمال (Business Class)</option>
                    <option value="economy_class">اقتصادية (Economy Class)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">الحجم</label>
                  <select
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value as BusSize)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value="large">كبير (Large)</option>
                    <option value="medium">وسط (Medium)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">السعة (المقاعد)</label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value={45}>45 مقعداً</option>
                    <option value={37}>37 مقعداً</option>
                    <option value={33}>33 مقعداً</option>
                    <option value={27}>27 مقعداً</option>
                    <option value={22}>22 مقعداً</option>
                    <option value={18}>18 مقعداً</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">تخطيط التوزيع</label>
                  <select
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  >
                    <option value="1 + 2">1 + 2 (فردي + مزدوج)</option>
                    <option value="1 + 1">1 + 1 (ممر عريض VIP)</option>
                    <option value="2 + 2">2 + 2 (اقتصادي/سياحي)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-pullman-gray-text mb-1">عدد الباصات</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newFleetCount}
                    onChange={(e) => setNewFleetCount(Number(e.target.value))}
                    required
                    className="w-full bg-pullman-gray-light border border-pullman-gray-border rounded-xl p-2.5 font-semibold text-pullman-gray-text"
                  />
                </div>
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
                  إضافة النموذج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

