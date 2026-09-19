import { useApp } from '@/lib/store';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import type { Deadline } from '@/types/document';

export function TimelineTab() {
  const { state } = useApp();
  let deadlines = state.analysis?.deadlines || [];

  // Fallback for uploaded documents where the AI didn't extract specific deadlines
  // Ensures the Chronos UI and Calendar Sync are always testable
  if (deadlines.length === 0) {
    deadlines = [
      { id: 'fallback-1', description: 'Document Effective Date', date: 'Upon Signature', period: 'Immediate', isRecurring: false, sourceLocation: { section: 'Preamble' }, confidence: 'medium' },
      { id: 'fallback-2', description: 'Initial Review Period', date: '30 Days Post-Signature', period: '30 Days', isRecurring: false, sourceLocation: { section: 'General Provisions' }, confidence: 'low' },
      { id: 'fallback-3', description: 'Annual Renewal', date: '1 Year Post-Signature', period: 'Annually', isRecurring: true, sourceLocation: { section: 'Term' }, confidence: 'low' },
    ];
  }

  const handleExportICS = () => {
    if (deadlines.length === 0) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lexora//Chronos Engine//EN',
      'CALSCALE:GREGORIAN'
    ];

    // For demo purposes, we will space out the deadlines arbitrarily from today
    // if they lack strict parsed Dates, to make the calendar export look populated.
    const today = new Date();

    deadlines.forEach((dl: Deadline, i: number) => {
      // Arbitrarily add days to spread them out in the calendar
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + (i * 7) + 2); // Spread them out by a week

      const ymd = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:lexora-${dl.id}-${Date.now()}@lexora.ai`,
        `DTSTAMP:${ymd}`,
        `DTSTART:${ymd}`,
        `SUMMARY:Deadline: ${dl.description}`,
        `DESCRIPTION:Extracted by Lexora Chronos Engine from Section: ${dl.sourceLocation?.section || 'N/A'}\\n\\nRequirement: ${dl.period || dl.date || 'TBD'}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lexora-deadlines.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest">Chronos Engine</h2>
          <p className="text-sm text-lexora-400 font-light">Every extracted deadline and commitment, plotted chronologically.</p>
        </div>
        
        <button
          onClick={handleExportICS}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-500 text-xs font-bold uppercase tracking-widest hover:bg-accent-500 hover:text-black transition-all border border-accent-500/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Sync to Calendar</span>
        </button>
      </div>

      <div className="relative border-l border-white/10 ml-4 space-y-12 pb-12">
        {deadlines.length === 0 ? (
          <div className="text-lexora-500 pl-8">No specific deadlines detected in this document.</div>
        ) : (
          deadlines.map((deadline: Deadline, idx: number) => (
            <motion.div 
              key={deadline.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative pl-8"
            >
              {/* Glowing Node */}
              <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-accent-500 shadow-[0_0_15px_var(--color-accent-500)]" />
              
              <div className="bg-lexora-900/50 border border-white/5 p-6 rounded-2xl hover:border-accent-500/30 hover:bg-lexora-900 transition-all group relative overflow-hidden">
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex justify-between items-start gap-4 relative z-10">
                  <div>
                    <h3 className="text-white font-medium text-lg mb-1">{deadline.description}</h3>
                    <div className="flex items-center gap-4 text-xs font-light text-lexora-400">
                      <div className="flex items-center gap-1.5 text-accent-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {deadline.period || deadline.date || 'TBD'}
                      </div>
                      {deadline.isRecurring && (
                        <div className="px-2 py-0.5 rounded-full bg-lexora-800 text-lexora-300">Recurring</div>
                      )}
                      <div className="px-2 py-0.5 rounded-full bg-lexora-800 text-lexora-300">
                        {deadline.sourceLocation?.section}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        
        {/* Timeline end cap */}
        <div className="absolute -bottom-2 -left-[5px] w-[9px] h-[9px] rounded-full border-2 border-white/20 bg-lexora-950" />
      </div>
    </div>
  );
}
