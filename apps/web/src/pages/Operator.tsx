import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OperatorTourSummary,
  OperatorTourDetail,
  VendorInventoryItem,
  PaymentStatus,
} from '../types/itinerary';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Search,
  DollarSign,
  Briefcase,
  Radio,
  Building2,
  Edit3,
  X,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';

export default function Operator() {
  const { user, role, isOperator, switchRole } = useAuth();

  // Active view tab: 'tours' | 'vendors'
  const [activeTab, setActiveTab] = useState<'tours' | 'vendors'>('tours');

  // Tours data state
  const [tours, setTours] = useState<OperatorTourSummary[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);

  // Vendor inventory state
  const [vendors, setVendors] = useState<VendorInventoryItem[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'disrupted' | 'in_progress' | 'confirmed'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'has_escrow' | 'paid_only'>('all');

  // Tour detail slide-over state
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tourDetail, setTourDetail] = useState<OperatorTourDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Vendor edit modal state
  const [editingVendor, setEditingVendor] = useState<VendorInventoryItem | null>(null);
  const [isNewVendorModal, setIsNewVendorModal] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    vendorName: '',
    category: 'stay',
    serviceTitle: '',
    location: '',
    unitCost: 150,
    capacityPerDay: 20,
    contactEmail: '',
    slaStatus: 'healthy',
    contractStatus: 'active',
  });

  // Action status message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (isOperator) {
      loadTours();
      loadVendors();
    }
  }, [isOperator]);

  const loadTours = async () => {
    try {
      setLoadingTours(true);
      const data = await api.getOperatorOverview();
      setTours(data);
    } catch (err) {
      console.error('Failed loading operator tours:', err);
    } finally {
      setLoadingTours(false);
    }
  };

  const loadVendors = async () => {
    try {
      setLoadingVendors(true);
      const data = await api.getVendorInventory();
      setVendors(data);
    } catch (err) {
      console.error('Failed loading vendor inventory:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const openTourDetail = async (tripId: string) => {
    setSelectedTripId(tripId);
    setLoadingDetail(true);
    try {
      const detail = await api.getOperatorTourDetail(tripId);
      setTourDetail(detail);
    } catch (err) {
      console.error('Failed loading tour detail:', err);
      showToast('Error loading tour details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdatePaymentStatus = async (
    tripId: string,
    componentId: string,
    newStatus: PaymentStatus
  ) => {
    try {
      const res = await api.updateComponentBooking(tripId, componentId, {
        paymentStatus: newStatus,
      });
      setTourDetail(res.tour);
      showToast(`Booking updated to ${newStatus.toUpperCase()}`);
      // Refresh list to update escrow totals
      loadTours();
    } catch (err) {
      console.error('Failed updating payment status:', err);
      showToast('Failed to update booking payment status.');
    }
  };

  const handleResolveDisruption = async (tripId: string, componentId: string) => {
    try {
      const res = await api.resolveDisruptionAsOperator(
        tripId,
        componentId,
        'Authorized operational reroute & confirmed replacement by Elena Rostova.'
      );
      setTourDetail(res.tour);
      showToast('Disruption marked resolved by operator.');
      loadTours();
    } catch (err) {
      console.error('Failed resolving disruption:', err);
      showToast('Failed to resolve disruption.');
    }
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        const updated = await api.updateVendorInventory(editingVendor.id, {
          unitCost: Number(vendorForm.unitCost),
          capacityPerDay: Number(vendorForm.capacityPerDay),
          slaStatus: vendorForm.slaStatus as any,
          contractStatus: vendorForm.contractStatus as any,
          serviceTitle: vendorForm.serviceTitle,
          location: vendorForm.location,
        });
        showToast(`Vendor ${updated.vendorName} updated successfully.`);
      } else if (isNewVendorModal) {
        const created = await api.createVendorInventory({
          ...vendorForm,
          unitCost: Number(vendorForm.unitCost),
          capacityPerDay: Number(vendorForm.capacityPerDay),
          category: vendorForm.category as any,
          slaStatus: vendorForm.slaStatus as any,
          contractStatus: vendorForm.contractStatus as any,
        });
        showToast(`Vendor ${created.vendorName} created.`);
      }
      setEditingVendor(null);
      setIsNewVendorModal(false);
      loadVendors();
    } catch (err) {
      console.error('Failed saving vendor:', err);
      showToast('Failed saving vendor.');
    }
  };

  // Filtered tours calculation
  const filteredTours = tours.filter((t) => {
    const matchesSearch =
      t.travelerName.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.tripId.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'disrupted' && !t.hasActiveDisruption) return false;
    if (statusFilter === 'in_progress' && t.status !== 'in_progress') return false;
    if (statusFilter === 'confirmed' && t.status !== 'confirmed') return false;

    if (paymentFilter === 'has_escrow' && t.escrowTotal <= 0) return false;
    if (paymentFilter === 'paid_only' && (t.escrowTotal > 0 || t.pendingRefundTotal > 0)) return false;

    return true;
  });

  const activeDisruptionCount = tours.filter((t) => t.hasActiveDisruption).length;
  const totalRevenue = tours.reduce((sum, t) => sum + t.totalCost, 0);
  const totalEscrow = tours.reduce((sum, t) => sum + (t.escrowTotal || 0), 0);
  const slaCompliance = vendors.length > 0
    ? Math.round((vendors.filter((v) => v.slaStatus === 'healthy').length / vendors.length) * 100)
    : 100;

  // 1. Role-based authorization gate
  if (!isOperator) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5">
          <div className="size-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="size-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Role Authorization Required
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Operator Access Restricted
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This console provides fleet management, live disruption overrides, financial escrow releases, and vendor inventory pricing. You are currently in <strong>{role.toUpperCase()}</strong> mode.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => switchRole('operator')}
              className="w-full py-3 rounded-xl bg-[#1F4E79] hover:bg-[#183e60] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="size-4 text-emerald-300" />
              Authenticate as Operator (Elena Rostova - Ops Alpha)
            </button>

            <Link
              to="/"
              className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Return to Traveler Portal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/70 pb-24">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-[3000] bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700"
          >
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Operations Header */}
      <div className="bg-[#1F4E79] text-white px-4 sm:px-8 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white/10 text-amber-300 shadow-xs">
                <Briefcase className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    Tour Operations Center
                  </h1>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <Radio className="size-3 animate-pulse" />
                    Live Telemetry
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-200">
                  Fleet itinerary oversight, vendor contracts & SLAs, bookings & simulated escrow clearance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Role Switcher & Refresh */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-300 block">Logged In As</span>
              <span className="text-xs font-bold text-white">{user?.displayName || 'Elena Rostova (Ops Alpha)'}</span>
            </div>

            <button
              onClick={() => switchRole('traveler')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition"
              title="Test Traveler view"
            >
              Switch to Traveler View
            </button>

            <button
              onClick={() => {
                loadTours();
                loadVendors();
                showToast('Telemetry refreshed.');
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* KPI Metrics Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Fleet Tours
              </span>
              <Users className="size-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {tours.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              100% persistent synchronized
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Disruptions
              </span>
              <AlertTriangle className="size-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-600 flex items-center gap-2">
              <span>{activeDisruptionCount}</span>
              {activeDisruptionCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  Action Required
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Adapt Engine resolving
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Simulated Escrow Balance
              </span>
              <DollarSign className="size-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              ${totalEscrow.toLocaleString()}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
              Pending Tour Completion
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vendor SLA Health
              </span>
              <CheckCircle className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {slaCompliance}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {vendors.length} Partner contracts active
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'tours'
                ? 'bg-[#1F4E79] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="size-3.5" />
            Active Tours & Fleet Manifest ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-[#1F4E79] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="size-3.5" />
            Vendor Inventory & SLAs ({vendors.length})
          </button>
        </div>

        {/* TAB 1: TOURS MANIFEST */}
        {activeTab === 'tours' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
            {/* Table Filters Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Operational Tour Manifest
                </h3>
                <span className="text-xs text-slate-500">
                  ({filteredTours.length} tours displayed)
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search traveler, destination, ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-[#1F4E79] outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      statusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('disrupted')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      statusFilter === 'disrupted'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Disrupted ({tours.filter((t) => t.hasActiveDisruption).length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('confirmed')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      statusFilter === 'confirmed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Confirmed
                  </button>
                </div>

                {/* Payment Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setPaymentFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      paymentFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Any Escrow
                  </button>
                  <button
                    onClick={() => setPaymentFilter('has_escrow')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      paymentFilter === 'has_escrow'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Escrow Active
                  </button>
                </div>
              </div>
            </div>

            {/* Tours Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Traveler & Tour ID</th>
                    <th className="py-3.5 px-6">Destination</th>
                    <th className="py-3.5 px-6">Dates & Days</th>
                    <th className="py-3.5 px-6">Components</th>
                    <th className="py-3.5 px-6">Status & Alerts</th>
                    <th className="py-3.5 px-6">Simulated Escrow</th>
                    <th className="py-3.5 px-6">Total Gross</th>
                    <th className="py-3.5 px-6 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTours.map((tour) => (
                    <tr
                      key={tour.id}
                      className="hover:bg-slate-50/80 transition"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div>
                          <span>{tour.travelerName}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {tour.tripId} • {tour.travelerEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {tour.destination}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {tour.startDate} → {tour.endDate}
                        <span className="block text-[10px] text-slate-400">
                          {tour.durationDays} Days
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {tour.componentCount || 0} nodes
                      </td>
                      <td className="py-4 px-6">
                        {tour.hasActiveDisruption ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="size-3 text-rose-600" />
                            {tour.disruptionCount} Disruption Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="size-3 text-emerald-600" />
                            On Schedule
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {tour.escrowTotal > 0 ? (
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ${tour.escrowTotal} in Escrow
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            Cleared
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        ${tour.totalCost}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openTourDetail(tour.tripId)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F4E79] text-white hover:bg-[#183e60] font-semibold transition shadow-xs text-xs"
                          >
                            <SlidersHorizontal className="size-3" />
                            Manage Tour
                          </button>
                          <Link
                            to={`/trip/${tour.tripId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-xs"
                            title="Traveler View"
                          >
                            <ArrowUpRight className="size-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTours.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-xs text-slate-500"
                      >
                        {loadingTours ? 'Loading tours manifest...' : 'No tours match your current filter criteria.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VENDOR INVENTORY & SLAS */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
            {/* Header Bar */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Partner Vendor Inventory & SLAs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage vendor capacity limits, service catalog pricing, and SLA health ratings.
                </p>
              </div>

              <button
                onClick={() => {
                  setVendorForm({
                    vendorName: '',
                    category: 'stay',
                    serviceTitle: '',
                    location: '',
                    unitCost: 150,
                    capacityPerDay: 20,
                    contactEmail: '',
                    slaStatus: 'healthy',
                    contractStatus: 'active',
                  });
                  setIsNewVendorModal(true);
                  setEditingVendor(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#183e60] transition shadow-xs"
              >
                <Plus className="size-3.5" />
                Add Partner Vendor
              </button>
            </div>

            {/* Vendor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Vendor Name & Contact</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Service Offering & Location</th>
                    <th className="py-3.5 px-6">Base Unit Price</th>
                    <th className="py-3.5 px-6">Daily Capacity</th>
                    <th className="py-3.5 px-6">SLA Status</th>
                    <th className="py-3.5 px-6">Contract</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div>
                          <span>{v.vendorName}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {v.contactEmail} • {v.rating}★
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded uppercase tracking-wider font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {v.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        <span className="font-medium block">{v.serviceTitle}</span>
                        <span className="text-[11px] text-slate-400">{v.location}</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        ${v.unitCost} {v.currency}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{v.bookedSlots} / {v.capacityPerDay}</span>
                          <span className="text-[10px] text-slate-400">
                            ({Math.round((v.bookedSlots / v.capacityPerDay) * 100)}% used)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            v.slaStatus === 'healthy'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : v.slaStatus === 'warning'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {v.slaStatus === 'healthy' && <CheckCircle className="size-3 text-emerald-600" />}
                          {v.slaStatus === 'warning' && <AlertTriangle className="size-3 text-amber-600" />}
                          <span className="capitalize">{v.slaStatus}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="capitalize font-medium text-slate-600">
                          {v.contractStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setEditingVendor(v);
                            setVendorForm({
                              vendorName: v.vendorName,
                              category: v.category,
                              serviceTitle: v.serviceTitle,
                              location: v.location,
                              unitCost: v.unitCost,
                              capacityPerDay: v.capacityPerDay,
                              contactEmail: v.contactEmail,
                              slaStatus: v.slaStatus,
                              contractStatus: v.contractStatus,
                            });
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1F4E79] hover:text-white text-slate-700 font-semibold transition"
                        >
                          <Edit3 className="size-3" />
                          Edit Inventory
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* TOUR DETAIL SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {selectedTripId && (
          <div className="fixed inset-0 z-[2500] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTripId(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-full max-w-3xl bg-white shadow-2xl h-full flex flex-col z-10 overflow-hidden"
            >
              {loadingDetail || !tourDetail ? (
                <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="size-10 rounded-full border-4 border-[#1F4E79] border-t-transparent animate-spin mb-3" />
                  <p className="text-xs font-semibold text-slate-600">Loading tour operational breakdown...</p>
                </div>
              ) : (
                <>
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-[#1F4E79] text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                          Tour Operations Detail
                        </span>
                        <h3 className="text-lg font-bold mt-1.5">
                          {tourDetail.title}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Traveler: {tourDetail.travelerName} ({tourDetail.travelerEmail}) • {tourDetail.destination}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedTripId(null)}
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    {/* Financial Escrow Status Strip */}
                    <div className="mt-4 grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-xs">
                      <div>
                        <span className="text-slate-300 block text-[10px]">Total Tour Cost</span>
                        <strong className="text-white text-sm font-black">${tourDetail.totalCost}</strong>
                      </div>
                      <div>
                        <span className="text-slate-300 block text-[10px]">Simulated Escrow</span>
                        <strong className="text-amber-300 text-sm font-black">${tourDetail.escrowTotal}</strong>
                      </div>
                      <div>
                        <span className="text-slate-300 block text-[10px]">Settled / Paid</span>
                        <strong className="text-emerald-300 text-sm font-black">${tourDetail.paidTotal}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Body */}
                  <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Active Disruption Alert if any */}
                    {tourDetail.hasActiveDisruption && tourDetail.disruptions?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-rose-600" />
                            <strong className="text-xs font-bold">Active Operational Disruption</strong>
                          </div>
                          <button
                            onClick={() => handleResolveDisruption(tourDetail.tripId, tourDetail.disruptions[0].componentId)}
                            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs transition"
                          >
                            Mark Disruption Resolved
                          </button>
                        </div>
                        <p className="text-xs text-rose-800">
                          {tourDetail.disruptions[0].description}
                        </p>
                      </div>
                    )}

                    {/* Bookings & Itinerary Components Breakdown */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Itinerary Components, Vendors & Simulated Payments ({tourDetail.bookings.length})
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Click status to toggle payment state
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tourDetail.bookings.map((booking) => {
                          const isDisrupted = booking.status === 'disrupted';

                          return (
                            <div
                              key={booking.bookingId}
                              className={`p-4 rounded-2xl border transition-all ${
                                isDisrupted
                                  ? 'bg-rose-50/50 border-rose-200'
                                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                      Day {booking.day} • {booking.componentType}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">
                                      {booking.time} ({booking.duration})
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-slate-900 text-sm mt-1">
                                    {booking.componentName}
                                  </h5>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span>Vendor: <strong className="text-slate-800">{booking.vendor}</strong> ({booking.vendorRating}★)</span>
                                    <span>Ref: <strong className="font-mono text-slate-700">{booking.bookingRef}</strong></span>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-sm font-black text-slate-900 block">
                                    ${booking.cost}
                                  </span>

                                  {/* Interactive simulated payment status selector */}
                                  <div className="mt-2 flex items-center gap-1.5">
                                    <select
                                      value={booking.paymentStatus}
                                      onChange={(e) =>
                                        handleUpdatePaymentStatus(
                                          tourDetail.tripId,
                                          booking.componentId,
                                          e.target.value as PaymentStatus
                                        )
                                      }
                                      className={`px-2.5 py-1 rounded-xl text-xs font-bold outline-none border transition cursor-pointer ${
                                        booking.paymentStatus === 'paid'
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                          : booking.paymentStatus === 'escrow'
                                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                                          : booking.paymentStatus === 'refunded'
                                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                                          : 'bg-amber-50 text-amber-800 border-amber-200'
                                      }`}
                                    >
                                      <option value="paid">✓ Paid</option>
                                      <option value="escrow">🔒 Escrow</option>
                                      <option value="pending">⏳ Pending</option>
                                      <option value="refunded">↩ Refunded</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Assigned Operator: <strong>{tourDetail.assignedOperator}</strong>
                    </span>
                    <Link
                      to={`/trip/${tourDetail.tripId}`}
                      className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#183e60] transition"
                    >
                      Open Full DAG Inspector
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VENDOR INVENTORY EDIT / CREATE MODAL */}
      <AnimatePresence>
        {(editingVendor || isNewVendorModal) && (
          <div className="fixed inset-0 z-[2800] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setEditingVendor(null);
                setIsNewVendorModal(false);
              }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingVendor ? `Edit Inventory: ${editingVendor.vendorName}` : 'Add New Partner Vendor'}
                </h3>
                <button
                  onClick={() => {
                    setEditingVendor(null);
                    setIsNewVendorModal(false);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Vendor Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorForm.vendorName}
                    disabled={Boolean(editingVendor)}
                    onChange={(e) => setVendorForm({ ...vendorForm, vendorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#1F4E79]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={vendorForm.category}
                      onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                    >
                      <option value="stay">Stay</option>
                      <option value="transport">Transport</option>
                      <option value="activity">Activity</option>
                      <option value="dining">Dining</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Unit Base Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={vendorForm.unitCost}
                      onChange={(e) => setVendorForm({ ...vendorForm, unitCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Service Catalog Title
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorForm.serviceTitle}
                    onChange={(e) => setVendorForm({ ...vendorForm, serviceTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Daily Capacity Slots
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={vendorForm.capacityPerDay}
                      onChange={(e) => setVendorForm({ ...vendorForm, capacityPerDay: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      SLA Health Status
                    </label>
                    <select
                      value={vendorForm.slaStatus}
                      onChange={(e) => setVendorForm({ ...vendorForm, slaStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                    >
                      <option value="healthy">Healthy (Optimal SLA)</option>
                      <option value="warning">Warning (Delayed Telemetry)</option>
                      <option value="suspended">Suspended (Service Breach)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVendor(null);
                      setIsNewVendorModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1F4E79] text-white font-bold hover:bg-[#183e60] transition shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
