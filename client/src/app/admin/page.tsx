'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { AdminTab } from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import OverviewView from '../../components/dashboard/OverviewView';
import TripsView from '../../components/trips/TripsView';
import BusModelsView from '../../components/bus-models/BusModelsView';
import UsersView from '../../components/users/UsersView';
import { 
  INITIAL_BUS_MODELS, 
  INITIAL_TRIPS, 
  INITIAL_USERS 
} from '../../data/mockData';
import { ITrip, IBusModel, IUser, IBooking, BusModelStatus } from '../../types';
import { api } from '../../services/api';

export default function AdminDashboardPage() {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [trips, setTrips] = useState<ITrip[]>(INITIAL_TRIPS);
  const [busModels, setBusModels] = useState<IBusModel[]>(INITIAL_BUS_MODELS);
  const [users, setUsers] = useState<IUser[]>(INITIAL_USERS);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Authenticate as Admin if not already logged in
  const ensureAdminAuth = async () => {
    try {
      const storedRole = localStorage.getItem('user_role');
      const token = localStorage.getItem('token');
      if (!token || storedRole !== 'admin') {
        await api.auth.login({ username: 'ahmad_admin', password: 'password123' });
      }
    } catch (err) {
      console.warn('Auto-login as admin failed:', err);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoadingBackend(true);
      await ensureAdminAuth();

      // 1. Bus Models
      const busRes = await api.busModels.getAll().catch(() => null);
      if (busRes?.data && Array.isArray(busRes.data) && busRes.data.length > 0) {
        setBusModels(busRes.data);
      }

      // 2. Trips
      const tripsRes = await api.trips.getAll().catch(() => null);
      if (tripsRes?.data && Array.isArray(tripsRes.data) && tripsRes.data.length > 0) {
        setTrips(tripsRes.data.map((t: any, idx: number) => ({
          ...t,
          tripNumber: t.tripNumber || `#${1025 + idx}`,
          busModelTitle: typeof t.busModelId === 'object' ? t.busModelId?.title : 'بولمان VIP',
          occupancyRate: t.bookedSeatsCount ? Math.round((t.bookedSeatsCount / 32) * 100) : (t.occupancyRate || 75),
          hasBookings: (t.bookedSeatsCount && t.bookedSeatsCount > 0) || false,
        })));
      }

      // 3. Users
      const usersRes = await api.users.getAll().catch(() => null);
      if (usersRes?.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
        setUsers(usersRes.data);
      }

      // 4. Bookings for live analytics
      const bookingsRes = await api.bookings.getAll().catch(() => null);
      if (bookingsRes?.data && Array.isArray(bookingsRes.data)) {
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      console.warn('Backend load failed, using local fallback:', err);
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers for Trips
  const handleCreateTrip = async (newTripData: Partial<ITrip>) => {
    const nextNumber = `#${1025 + trips.length}`;
    const model = busModels.find(m => m._id === newTripData.busModelId) || busModels[0];

    const payload = {
      source: newTripData.source || 'دمشق',
      destination: newTripData.destination || 'حلب',
      busModelId: model?._id || busModels[0]?._id,
      price: Number(newTripData.price) || 85000,
      tripDate: newTripData.tripDate || '2025-05-25',
      tripTime: newTripData.tripTime || '10:00',
      scheduleType: newTripData.scheduleType || 'daily',
    };

    try {
      await api.trips.create(payload);
      await loadData();
    } catch (err) {
      console.warn('Backend create trip error, using local state:', err);
      const newTrip: ITrip = {
        _id: `trip-${Date.now()}`,
        tripNumber: nextNumber,
        source: payload.source,
        destination: payload.destination,
        busModelId: payload.busModelId,
        busModelTitle: model?.title || 'بولمان سياحي',
        price: payload.price,
        tripDate: payload.tripDate,
        tripTime: payload.tripTime,
        scheduleType: payload.scheduleType,
        status: 'scheduled',
        occupancyRate: 0,
        hasBookings: false,
        totalBookings: 0,
      };
      setTrips((prev) => [newTrip, ...prev]);
    }
  };

  const handleRescheduleTrip = async (tripId: string, newDate: string, newTime: string) => {
    try {
      await api.trips.reschedule(tripId, { newTripDate: newDate, newTripTime: newTime });
      await loadData();
    } catch (err) {
      console.warn('Backend reschedule error, updating local state:', err);
      setTrips((prev) =>
        prev.map((t) =>
          t._id === tripId ? { ...t, tripDate: newDate, tripTime: newTime } : t
        )
      );
    }
  };

  const handleUpdateTripPrice = (tripId: string, newPrice: number): { success: boolean; error?: string } => {
    const trip = trips.find((t) => t._id === tripId);
    if (!trip) return { success: false, error: 'الرحلة غير موجودة' };

    // Strict Business Rule check:
    if (trip.hasBookings) {
      return {
        success: false,
        error: 'وفق قواعد العمل الصارمة (TC-003): لا يمكن تعديل سعر الرحلة لوجود حجوزات سابقة أو نشطة عليها.',
      };
    }

    api.trips.update(tripId, { price: newPrice }).then(() => loadData()).catch(() => {
      setTrips((prev) =>
        prev.map((t) => (t._id === tripId ? { ...t, price: newPrice } : t))
      );
    });

    return { success: true };
  };

  const handleDeleteTrip = (tripId: string): { success: boolean; error?: string } => {
    const trip = trips.find((t) => t._id === tripId);
    if (!trip) return { success: false, error: 'الرحلة غير موجودة' };

    // Strict Business Rule check:
    if (trip.hasBookings) {
      return {
        success: false,
        error: 'وفق قواعد العمل الصارمة (TC-004): يمنع منعاً باتاً حذف رحلة مرتبطة بأي حجز نشط أو سابق لحماية السجلات.',
      };
    }

    api.trips.delete(tripId).then(() => loadData()).catch(() => {
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
    });

    return { success: true };
  };

  // Handlers for Bus Models
  const handleUpdateFleet = async (modelId: string, newCount: number, newStatus: BusModelStatus) => {
    try {
      await api.busModels.updateFleet(modelId, newCount);
      await loadData();
    } catch (err) {
      console.warn('Backend fleet update error, updating local state:', err);
      setBusModels((prev) =>
        prev.map((m) =>
          m._id === modelId ? { ...m, totalBusesCount: newCount, status: newStatus } : m
        )
      );
    }
  };

  const handleAddBusModel = async (newModelData: Partial<IBusModel>) => {
    try {
      await api.busModels.create(newModelData);
      await loadData();
    } catch (err) {
      console.warn('Backend add bus model error, updating local state:', err);
      const newModel: IBusModel = {
        _id: `bus-${Date.now()}`,
        title: newModelData.title || 'بولمان جديد',
        category: newModelData.category || 'first_class',
        size: newModelData.size || 'large',
        capacity: newModelData.capacity || 45,
        layoutDetails: newModelData.layoutDetails || { seatingPattern: '1 + 2' },
        totalBusesCount: newModelData.totalBusesCount || 5,
        status: 'operational',
      };
      setBusModels((prev) => [newModel, ...prev]);
    }
  };

  // Handlers for Users
  const handleAddUser = async (newUserData: Partial<IUser>) => {
    try {
      await api.auth.register({
        name: newUserData.name,
        username: newUserData.username,
        phone: newUserData.phone?.replace(/[^0-9]/g, '') || `09${Date.now().toString().slice(-8)}`,
        password: 'password123',
      });
      await loadData();
    } catch (err) {
      const newUser: IUser = {
        _id: `user-${Date.now()}`,
        name: newUserData.name || 'مستخدم جديد',
        username: newUserData.username || `user_${Date.now()}`,
        phone: newUserData.phone || '000••••09',
        role: newUserData.role || 'customer',
        status: 'active',
        lastActive: 'الآن',
      };
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  return (
    <div className="min-h-screen bg-pullman-gray-bg flex flex-row">
      {/* Right Sidebar (RTL layout) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        tripsCount={trips.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header adminName="أحمد الخطيب" adminRole="مدير النظام" />

        {/* Dynamic View Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewView
              trips={trips}
              bookings={bookings}
              users={users}
              onOpenCreateTrip={() => setCurrentTab('trips')}
              onNavigateToTrips={() => setCurrentTab('trips')}
            />
          )}

          {currentTab === 'trips' && (
            <TripsView
              trips={trips}
              busModels={busModels}
              onCreateTrip={handleCreateTrip}
              onRescheduleTrip={handleRescheduleTrip}
              onUpdateTripPrice={handleUpdateTripPrice}
              onDeleteTrip={handleDeleteTrip}
            />
          )}

          {currentTab === 'bus-models' && (
            <BusModelsView
              busModels={busModels}
              onUpdateFleet={handleUpdateFleet}
              onAddModel={handleAddBusModel}
            />
          )}

          {currentTab === 'users' && (
            <UsersView
              users={users}
              onAddUser={handleAddUser}
              onToggleUserStatus={handleToggleUserStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}
