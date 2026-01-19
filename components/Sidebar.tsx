
import React, { useState, useEffect } from 'react';
import { FAQ_DATA } from '../constants';
import { fetchUserProfile, UserProfile } from '../services/userService';

interface SidebarProps {
  onSelectTemplate: (prompt: string, templateId: string) => void;
  onParamsChange: (params: Record<string, string>) => void;
  params: Record<string, string>;
  isAiEnabled: boolean;
  onAiToggle: (enabled: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onSelectTemplate, 
  onParamsChange, 
  params, 
  isAiEnabled, 
  onAiToggle 
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>("Purchase Orders");
  const [dateType, setDateType] = useState<string>('preset');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile().then(data => {
      setUser(data);
      // Auto-populate UserID filter if empty
      if (!params['@UserID']) {
        onParamsChange({ ...params, '@UserID': data.user_id });
      }
    });
  }, []);

  const handleParamChange = (key: string, value: string) => {
    onParamsChange({ ...params, [key]: value });
  };

  const setDatePreset = (preset: string) => {
    const end = new Date();
    let start = new Date();
    
    switch(preset) {
      case 'last_week': start.setDate(end.getDate() - 7); break;
      case 'last_30': start.setDate(end.getDate() - 30); break;
      case 'last_90': start.setDate(end.getDate() - 90); break;
      case 'last_quarter': start.setMonth(end.getMonth() - 3); break;
      case 'last_year': start.setFullYear(end.getFullYear() - 1); break;
    }

    onParamsChange({ 
      ...params, 
      '@FromDate': start.toISOString().split('T')[0],
      '@ToDate': end.toISOString().split('T')[0],
      '@DatePreset': preset
    });
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 hidden lg:flex">
      {/* User Identity Section with Dropdown */}
      <div className="relative p-5 border-b border-slate-800 bg-slate-800/30">
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/50 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
            {user?.full_name.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.full_name || 'Loading...'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.role || 'Fetching profile...'}</p>
          </div>
          <svg className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {isProfileOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Teradata Profile Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Dept:</span>
                <span className="text-slate-200 font-medium">{user?.department}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-200 font-medium">{user?.location}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Last Login:</span>
                <span className="text-slate-200 font-medium">{user?.last_login}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-700 flex justify-center">
                <button className="text-[9px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Logout Session</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Mode Toggle */}
      <div className="p-4 border-b border-slate-800 bg-indigo-900/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Query Engine</h2>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isAiEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
            {isAiEnabled ? 'ADVANCED' : 'STANDARD'}
          </span>
        </div>
        <button 
          onClick={() => onAiToggle(!isAiEnabled)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
            isAiEnabled 
            ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-100' 
            : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <span className="text-xs font-semibold">{isAiEnabled ? 'Disable AI Gen' : 'Enable AI SQL Gen'}</span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isAiEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAiEnabled ? 'left-4.5' : 'left-0.5'}`} />
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          {/* FAQ / Library Section */}
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Query Library</h2>
            {FAQ_DATA.map((group) => (
              <div key={group.category} className="mb-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-800/20">
                <button 
                  onClick={() => setOpenCategory(openCategory === group.category ? null : group.category)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${openCategory === group.category ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40'}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span>{group.category}</span>
                  </div>
                  <svg className={`w-3 h-3 transition-transform ${openCategory === group.category ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openCategory === group.category && (
                  <div className="p-1 bg-slate-900/50">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectTemplate(item.prompt, item.id)}
                        className="w-full text-left px-3 py-1.5 text-[10px] text-slate-400 hover:text-white hover:bg-indigo-600/10 rounded transition-all block truncate"
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Filters Block */}
          <div className="pt-2 border-t border-slate-800">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Query Parameters</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-500 mb-1 ml-1 uppercase">PO Number / ID (@ID)</label>
                  <input
                    type="text"
                    value={params['@ID'] || ''}
                    onChange={(e) => handleParamChange('@ID', e.target.value)}
                    placeholder="Enter Document #"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 mb-1 ml-1 uppercase">Cost Center</label>
                  <input
                    type="text"
                    value={params['@CostCenterNumber'] || ''}
                    onChange={(e) => handleParamChange('@CostCenterNumber', e.target.value)}
                    placeholder="e.g. 100200"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 mb-1 ml-1 uppercase">Supplier ID</label>
                  <input
                    type="text"
                    value={params['@SupplierID'] || ''}
                    onChange={(e) => handleParamChange('@SupplierID', e.target.value)}
                    placeholder="e.g. SUP_8821"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 mb-1 ml-1 uppercase">Source System</label>
                  <select
                    value={params['@SourceSystem'] || ''}
                    onChange={(e) => handleParamChange('@SourceSystem', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option value="">Select System</option>
                    <option value="SAP">SAP ERP</option>
                    <option value="ORACLE">Oracle Cloud</option>
                    <option value="ARIBA">Ariba</option>
                    <option value="COUPA">Coupa</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/50">
                <h3 className="text-[9px] font-bold text-slate-500 uppercase mb-3">Timeline Context</h3>
                <div className="flex gap-1 mb-3 bg-slate-950 p-1 rounded-lg">
                  <button 
                    onClick={() => setDateType('preset')}
                    className={`flex-1 text-[9px] py-1 rounded transition-colors ${dateType === 'preset' ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >PRESETS</button>
                  <button 
                    onClick={() => setDateType('custom')}
                    className={`flex-1 text-[9px] py-1 rounded transition-colors ${dateType === 'custom' ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >CUSTOM</button>
                </div>

                {dateType === 'preset' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['last_week', 'last_30', 'last_90', 'last_quarter', 'last_year'].map(p => (
                      <button
                        key={p}
                        onClick={() => setDatePreset(p)}
                        className={`text-[9px] px-2 py-1.5 rounded bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all capitalize ${params['@DatePreset'] === p ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'text-slate-400'}`}
                      >
                        {p.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[8px] text-slate-600 mb-1 ml-1 uppercase">From</label>
                      <input
                        type="date"
                        value={params['@FromDate'] || ''}
                        onChange={(e) => handleParamChange('@FromDate', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-slate-600 mb-1 ml-1 uppercase">To</label>
                      <input
                        type="date"
                        value={params['@ToDate'] || ''}
                        onChange={(e) => handleParamChange('@ToDate', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 text-[10px] text-slate-600 text-center font-mono">
        &copy; 2025 PO-CHECK-AI • Enterprise v3.6
      </div>
    </aside>
  );
};

export default Sidebar;
