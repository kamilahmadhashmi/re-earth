import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  Package,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  X,
  FileText,
  User,
  Send,
  MessageSquare,
  RefreshCw,
  Award
} from 'lucide-react'
import {
  getApplicationsForUser,
  getApplicationMetrics,
  updateApplicationStatus,
  addApplicationInternalNote,
  formatInr,
  type SponsorApplication,
  type ApplicationStatus,
  type ApplicationMetrics
} from '../../../services/sponsorApplicationService'
import { useAuthStore } from '../../../store/useAuthStore'

export const CollegeAdminSponsorships: React.FC = () => {
  const { currentUser } = useAuthStore()

  // State
  const [applications, setApplications] = useState<SponsorApplication[]>([])
  const [metrics, setMetrics] = useState<ApplicationMetrics | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'funding_desc' | 'funding_asc'>('date_desc')

  // Selected application for detail drawer
  const [selectedApp, setSelectedApp] = useState<SponsorApplication | null>(null)

  // Modals for consequential actions
  const [confirmModal, setConfirmModal] = useState<{
    type: 'approve' | 'reject' | 'under_review' | 'request_info'
    app: SponsorApplication
  } | null>(null)

  const [rejectionReason, setRejectionReason] = useState('')
  const [actionNotes, setActionNotes] = useState('')
  const [newInternalNote, setNewInternalNote] = useState('')
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Refresh application data
  const refreshData = () => {
    if (!currentUser) return
    const apps = getApplicationsForUser(currentUser)
    setApplications(apps)
    setMetrics(getApplicationMetrics(currentUser))

    // If currently viewing an application in the drawer, sync its data
    if (selectedApp) {
      const refreshedSelected = apps.find((a) => a.id === selectedApp.id)
      if (refreshedSelected) setSelectedApp(refreshedSelected)
    }
  }

  useEffect(() => {
    refreshData()
  }, [currentUser])

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionFeedback])

  // Filtered and sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'under_review' && (app.status === 'under_review' || app.status === 'info_requested')) {
            // Include info_requested under review tab
          } else if (app.status !== statusFilter) {
            return false
          }
        }

        // Search query
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase().trim()
          const matchCompany = app.companyName.toLowerCase().includes(q)
          const matchContact = app.contactPerson.toLowerCase().includes(q)
          const matchRef = app.referenceCode.toLowerCase().includes(q)
          const matchCity = app.city.toLowerCase().includes(q)
          const matchCampus = app.targetCampusNames.some((n) => n.toLowerCase().includes(q))
          if (!matchCompany && !matchContact && !matchRef && !matchCity && !matchCampus) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        }
        if (sortBy === 'date_asc') {
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        }
        if (sortBy === 'funding_desc') {
          return (b.proposedFundingInr || 0) - (a.proposedFundingInr || 0)
        }
        if (sortBy === 'funding_asc') {
          return (a.proposedFundingInr || 0) - (b.proposedFundingInr || 0)
        }
        return 0
      })
  }, [applications, statusFilter, searchQuery, sortBy])

  // Handle Status Change execution
  const handleExecuteStatusChange = async () => {
    if (!confirmModal || !currentUser) return

    setIsProcessingAction(true)
    try {
      let targetStatus: ApplicationStatus = 'under_review'
      if (confirmModal.type === 'approve') targetStatus = 'approved'
      if (confirmModal.type === 'reject') targetStatus = 'rejected'
      if (confirmModal.type === 'request_info') targetStatus = 'info_requested'

      const updated = await updateApplicationStatus(
        confirmModal.app.id,
        targetStatus,
        currentUser,
        {
          reason: confirmModal.type === 'reject' ? rejectionReason : undefined,
          notes: actionNotes.trim().length > 0 ? actionNotes : undefined
        }
      )

      setSelectedApp(updated)
      refreshData()
      setActionFeedback({
        type: 'success',
        message:
          confirmModal.type === 'approve'
            ? `Partnership with ${confirmModal.app.companyName} officially approved and registered for ${currentUser.campusName}!`
            : confirmModal.type === 'reject'
            ? `Application from ${confirmModal.app.companyName} was rejected.`
            : `Application status updated to '${targetStatus}'.`
      })
      setConfirmModal(null)
      setRejectionReason('')
      setActionNotes('')
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update application status.'
      })
    } finally {
      setIsProcessingAction(false)
    }
  }

  // Add internal note
  const handleAddInternalNote = async () => {
    if (!selectedApp || !currentUser || !newInternalNote.trim()) return

    try {
      const updated = await addApplicationInternalNote(
        selectedApp.id,
        newInternalNote,
        currentUser
      )
      setSelectedApp(updated)
      setNewInternalNote('')
      refreshData()
      setActionFeedback({
        type: 'success',
        message: 'Internal note successfully appended.'
      })
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to append internal note.'
      })
    }
  }

  // Render Status Badge
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber/15 text-amber border border-amber/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            Pending Review
          </span>
        )
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan/15 text-cyan border border-cyan/30">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        )
      case 'info_requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-lavender/15 text-lavender border border-lavender/30">
            <HelpCircle className="w-3 h-3" />
            Info Requested
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald/15 text-emerald border border-emerald/30 shadow-emerald-glow/20">
            <CheckCircle2 className="w-3 h-3" />
            Approved Partner
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-pink/15 text-pink border border-pink/30">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/10 text-text-muted border border-white/15">
            Withdrawn
          </span>
        )
    }
  }

  const isCentralAdmin = currentUser?.role === 'central_admin'

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER: INSTITUTIONAL CONTEXT & AUDIT BANNER                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl liquid-glass border border-white/10 bg-white/[0.01]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              CAMPUS CORPORATE SPONSORSHIP PORTAL
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] font-mono text-cyan font-semibold">
              {isCentralAdmin ? 'Global Platform Secretariat' : currentUser?.campusName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-emerald" />
            <span>Sponsor Application Management</span>
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
            {isCentralAdmin
              ? 'Review unassigned corporate sponsorship applications, match global sustainability grants to recipient campuses, and oversee cross-collegiate recycling corridors.'
              : `Review incoming corporate sponsorship proposals directed to ${currentUser?.campusName}. Authorize verified campus partnerships, evaluate equipment allocations, and monitor funding agreements.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refreshData}
            title="Refresh database records"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary text-xs font-mono font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Toast */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              actionFeedback.type === 'success'
                ? 'bg-emerald/15 text-emerald border-emerald/40'
                : 'bg-pink/15 text-pink border-pink/40'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-semibold">{actionFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME SUMMARY METRICS CARDS (CALCULATED FROM ACTUAL DB RECORDS)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total Applications */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 bg-white/[0.02]">
          <span className="text-[10px] font-mono uppercase text-text-muted block">Total Applications</span>
          <div className="text-xl sm:text-2xl font-black text-text-primary mt-1 font-mono">
            {metrics?.total ?? 0}
          </div>
          <span className="text-[10px] text-text-muted mt-1 block">
            {metrics ? formatInr(metrics.totalProposedFundingInr) : '₹0'} pipeline
          </span>
        </div>

        {/* Pending Review */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-amber/30 bg-amber/[0.03]">
          <span className="text-[10px] font-mono uppercase text-amber block font-bold">Pending Review</span>
          <div className="text-xl sm:text-2xl font-black text-amber mt-1 font-mono">
            {metrics?.pending ?? 0}
          </div>
          <span className="text-[10px] text-amber/70 mt-1 block">Awaiting campus action</span>
        </div>

        {/* Under Review */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-cyan/30 bg-cyan/[0.03]">
          <span className="text-[10px] font-mono uppercase text-cyan block font-bold">Under Review</span>
          <div className="text-xl sm:text-2xl font-black text-cyan mt-1 font-mono">
            {metrics?.underReview ?? 0}
          </div>
          <span className="text-[10px] text-cyan/70 mt-1 block">In committee triage</span>
        </div>

        {/* Approved Partnerships */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-emerald/30 bg-emerald/[0.03]">
          <span className="text-[10px] font-mono uppercase text-emerald block font-bold">Approved Partners</span>
          <div className="text-xl sm:text-2xl font-black text-emerald mt-1 font-mono">
            {metrics?.approved ?? 0}
          </div>
          <span className="text-[10px] text-emerald/70 mt-1 block">Active on leaderboard</span>
        </div>

        {/* Rejected / Withdrawn */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 bg-white/[0.01] col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase text-text-muted block">Rejected / Archived</span>
          <div className="text-xl sm:text-2xl font-black text-text-muted mt-1 font-mono">
            {(metrics?.rejected ?? 0) + (metrics?.withdrawn ?? 0)}
          </div>
          <span className="text-[10px] text-text-muted mt-1 block">With audit reasons</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTROLS: SEARCH, FILTER TABS & SORTING                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto no-scrollbar text-xs font-mono">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => {
            const isActive = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald text-black shadow-emerald-glow'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, ref, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 text-xs text-text-primary pl-8 pr-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan font-mono placeholder:text-text-muted"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/50 text-text-secondary text-xs px-2.5 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan font-mono cursor-pointer"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="funding_desc">Funding: High to Low</option>
            <option value="funding_asc">Funding: Low to High</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. APPLICATIONS TABLE                                                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-white/10 liquid-glass overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-text-primary">No Applications Found</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              {searchQuery
                ? 'No sponsorship applications match the search term or status filter.'
                : 'No corporate sponsorship applications are currently registered for this campus view.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/[0.08] text-[10px] font-mono uppercase text-text-muted">
                <tr>
                  <th className="py-3 px-4">Company & Reference</th>
                  <th className="py-3 px-4">Pathway & Scope</th>
                  <th className="py-3 px-4">Proposed Funding</th>
                  <th className="py-3 px-4">In-Kind Resources</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredApplications.map((app) => {
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* Company Name & Ref */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-emerald shrink-0">
                            {app.companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-text-primary group-hover:text-cyan transition-colors block">
                              {app.companyName}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted block">
                              {app.referenceCode} • {app.city}, {app.country}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pathway & Scope */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-text-primary block">
                          {app.sponsorshipPathway === 'local_business'
                            ? 'Local Business'
                            : app.sponsorshipPathway === 'corporate_sustainability'
                            ? 'Corporate Sustainability'
                            : 'Global Impact'}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {app.targetCampusNames.map((name, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-cyan truncate max-w-[140px]"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Proposed Funding */}
                      <td className="py-3 px-4 font-mono font-bold text-text-primary">
                        {app.proposedFundingInr > 0 ? formatInr(app.proposedFundingInr) : 'To Discuss'}
                        <span className="text-[10px] text-text-muted font-normal block">
                          {app.proposedDuration}
                        </span>
                      </td>

                      {/* In-Kind Resources */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.inKindResources.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-text-secondary truncate max-w-[130px]"
                            >
                              {item}
                            </span>
                          ))}
                          {app.inKindResources.length > 2 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-text-muted">
                              +{app.inKindResources.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedApp(app)
                          }}
                          className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-cyan hover:text-cyan-bright border border-white/10 hover:border-cyan/30 text-xs font-mono font-bold transition-all cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. APPLICATION DETAIL DRAWER / MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-3xl my-auto rounded-3xl liquid-glass specular-rim border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald font-bold tracking-widest uppercase">
                      SPONSORSHIP PROPOSAL DOSSIER
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] font-mono text-text-muted">
                      REF: {selectedApp.referenceCode}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <span>{selectedApp.companyName}</span>
                    {renderStatusBadge(selectedApp.status)}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary border border-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                {/* Rejection Alert if already rejected */}
                {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
                  <div className="p-4 rounded-2xl bg-pink/10 border border-pink/30 space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-pink block">
                      Application Disqualification Reason
                    </span>
                    <p className="text-pink/90 leading-relaxed font-mono">
                      {selectedApp.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Company & Contact Details Grid */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block font-bold">
                    1. Corporate Identity & Contact Person
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text-secondary">
                    <div>
                      <span className="text-[10px] text-text-muted block font-mono">Contact Person</span>
                      <span className="text-text-primary font-semibold">
                        {selectedApp.contactPerson} {selectedApp.jobTitle ? `(${selectedApp.jobTitle})` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block font-mono">Work Email</span>
                      <a
                        href={`mailto:${selectedApp.workEmail}`}
                        className="text-cyan hover:underline font-mono"
                      >
                        {selectedApp.workEmail}
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block font-mono">Location</span>
                      <span className="text-text-primary">
                        {selectedApp.city}, {selectedApp.country}
                      </span>
                    </div>

                    {selectedApp.website && (
                      <div>
                        <span className="text-[10px] text-text-muted block font-mono">Website</span>
                        <a
                          href={selectedApp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>{selectedApp.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scope & Financial Commitment */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block font-bold">
                    2. Scope, Budget & In-Kind Commitments
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-text-muted block font-mono">Proposed Funding</span>
                      <span className="text-base font-bold text-emerald font-mono block mt-0.5">
                        {selectedApp.proposedFundingInr > 0 ? formatInr(selectedApp.proposedFundingInr) : 'In Discussion'}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">{selectedApp.proposedDuration}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-text-muted block font-mono">Sponsorship Category</span>
                      <span className="text-sm font-bold text-text-primary block mt-0.5 capitalize">
                        {selectedApp.sponsorshipPathway.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-cyan font-mono capitalize">
                        {selectedApp.targetScope.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] text-text-muted block font-mono">Targeted Campus(es)</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApp.targetCampusNames.map((name, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/20"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* In-Kind Resources */}
                  <div className="pt-2">
                    <span className="text-[10px] text-text-muted block font-mono mb-1.5">
                      Offered In-Kind Resources & Hardware
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.inKindResources.map((res, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-xs font-mono"
                        >
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Objectives & Application Message */}
                {(selectedApp.objectives || selectedApp.applicationMessage) && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block font-bold">
                      3. Partnership Objectives & Cover Message
                    </span>
                    {selectedApp.objectives && (
                      <p className="text-text-primary leading-relaxed">
                        <strong className="text-cyan">Objectives: </strong>
                        {selectedApp.objectives}
                      </p>
                    )}
                    {selectedApp.applicationMessage && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-text-secondary italic">
                        "{selectedApp.applicationMessage}"
                      </div>
                    )}
                  </div>
                )}

                {/* Status History Audit Trail */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block font-bold">
                    4. Verification Audit Trail & Status History
                  </span>
                  <div className="space-y-2">
                    {selectedApp.statusHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-[11px]"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary font-mono capitalize">
                              {hist.toStatus.replace('_', ' ')}
                            </span>
                            <span className="text-text-muted">•</span>
                            <span className="text-text-secondary">
                              by {hist.changedBy.name} ({hist.changedBy.role})
                            </span>
                          </div>
                          {hist.notes && <p className="text-text-muted font-mono">{hist.notes}</p>}
                          {hist.reason && (
                            <p className="text-pink font-mono">Reason: {hist.reason}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">
                          {new Date(hist.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Administrative Notes */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block font-bold">
                    5. Internal Campus Committee Notes
                  </span>
                  {selectedApp.internalNotes ? (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-text-secondary whitespace-pre-wrap leading-relaxed">
                      {selectedApp.internalNotes}
                    </div>
                  ) : (
                    <span className="text-text-muted italic block">No internal notes added yet.</span>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add an internal note (visible only to campus administrators)..."
                      value={newInternalNote}
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddInternalNote()
                      }}
                      className="flex-1 bg-black/50 text-xs text-text-primary px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan font-mono"
                    />
                    <button
                      onClick={handleAddInternalNote}
                      disabled={!newInternalNote.trim()}
                      className="px-3.5 py-2 rounded-xl bg-cyan text-black font-bold text-xs shadow-cyan-glow hover:brightness-105 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Consequential Action Buttons Footer */}
              <div className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-text-muted">
                  Current Status: <strong className="text-text-primary uppercase">{selectedApp.status}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedApp.status !== 'under_review' && selectedApp.status !== 'approved' && (
                    <button
                      onClick={() => setConfirmModal({ type: 'under_review', app: selectedApp })}
                      className="px-3.5 py-2 rounded-xl bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Mark Under Review
                    </button>
                  )}

                  {selectedApp.status !== 'info_requested' && (
                    <button
                      onClick={() => setConfirmModal({ type: 'request_info', app: selectedApp })}
                      className="px-3.5 py-2 rounded-xl bg-lavender/15 hover:bg-lavender/25 text-lavender border border-lavender/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Request Info
                    </button>
                  )}

                  {selectedApp.status !== 'rejected' && (
                    <button
                      onClick={() => setConfirmModal({ type: 'reject', app: selectedApp })}
                      className="px-3.5 py-2 rounded-xl bg-pink/15 hover:bg-pink/25 text-pink border border-pink/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Reject Proposal
                    </button>
                  )}

                  {selectedApp.status !== 'approved' && (
                    <button
                      onClick={() => setConfirmModal({ type: 'approve', app: selectedApp })}
                      className="px-4 py-2 rounded-xl bg-emerald hover:bg-emerald-bright text-black font-bold text-xs font-mono shadow-emerald-glow transition-all cursor-pointer"
                    >
                      Approve & Register Partner
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. CONSEQUENTIAL ACTION CONFIRMATION MODAL                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-60 overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md my-auto rounded-3xl liquid-glass specular-rim border border-white/20 p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    confirmModal.type === 'approve'
                      ? 'bg-emerald/20 text-emerald border border-emerald/40'
                      : confirmModal.type === 'reject'
                      ? 'bg-pink/20 text-pink border border-pink/40'
                      : 'bg-cyan/20 text-cyan border border-cyan/40'
                  }`}
                >
                  {confirmModal.type === 'approve' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : confirmModal.type === 'reject' ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-text-muted">
                    Confirmation Required
                  </span>
                  <h4 className="text-lg font-bold text-text-primary capitalize">
                    {confirmModal.type === 'approve'
                      ? 'Approve Sponsorship Partnership'
                      : confirmModal.type === 'reject'
                      ? 'Reject Sponsorship Application'
                      : confirmModal.type === 'request_info'
                      ? 'Request Additional Information'
                      : 'Move to Committee Review'}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {confirmModal.type === 'approve'
                  ? `You are authorizing ${confirmModal.app.companyName} as a verified corporate sustainability partner for ${currentUser?.campusName}. This will register the partner in the campus directory and activate their sponsorship on the global leaderboard.`
                  : confirmModal.type === 'reject'
                  ? `Please provide a formal rejection reason explaining why ${confirmModal.app.companyName} did not meet campus partnership criteria.`
                  : `Update status for ${confirmModal.app.companyName} to continue institutional evaluation.`}
              </p>

              {/* Mandatory Rejection Reason */}
              {confirmModal.type === 'reject' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-pink uppercase font-bold block">
                    Rejection Reason <span className="text-pink">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Applicant does not meet hazmat battery handling compliance or state recycling standards."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-black/60 text-xs text-text-primary p-3 rounded-xl border border-pink/40 focus:outline-none focus:ring-1 focus:ring-pink font-mono"
                  />
                </div>
              )}

              {/* Optional Administrative Note */}
              {confirmModal.type !== 'reject' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-text-secondary uppercase block">
                    Committee Audit Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scoped by dean committee meeting on Oct 14"
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="w-full bg-black/60 text-xs text-text-primary px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan font-mono"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal(null)
                    setRejectionReason('')
                    setActionNotes('')
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    isProcessingAction ||
                    (confirmModal.type === 'reject' && rejectionReason.trim().length < 5)
                  }
                  onClick={handleExecuteStatusChange}
                  className={`px-4 py-2 rounded-xl text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer ${
                    confirmModal.type === 'approve'
                      ? 'bg-emerald hover:bg-emerald-bright shadow-emerald-glow'
                      : confirmModal.type === 'reject'
                      ? 'bg-pink text-white hover:bg-pink-bright'
                      : 'bg-cyan hover:bg-cyan-bright shadow-cyan-glow'
                  }`}
                >
                  {isProcessingAction ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Action</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
