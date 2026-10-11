import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react'
import { SPONSOR_FAQS } from '../../data/sponsorProgramData'

export const SponsorshipFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald">
          Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Clear, candid answers regarding operational mechanics, verification, financial allocation,
          and Indian CSR guidelines.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {SPONSOR_FAQS.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'liquid-glass border-emerald/40 bg-emerald/[0.02] shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-text-primary">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 border ${
                    isOpen
                      ? 'bg-emerald/15 text-emerald border-emerald/30 rotate-180'
                      : 'bg-white/5 text-text-muted border-white/10'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* CSR Indian Legal Disclaimer Banner */}
      <div className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-text-muted flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-secondary font-medium">
            Note on Corporate Social Responsibility (CSR):
          </strong>{' '}
          In accordance with the Companies Act 2013 and CSR Rules, eligibility depends on project structuring,
          authorized implementing agencies, and specific program agreements. We do not provide blanket legal
          or tax certification without project-specific review.
        </div>
      </div>
    </section>
  )
}
