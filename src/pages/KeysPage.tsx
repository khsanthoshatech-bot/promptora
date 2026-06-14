import React, { useEffect, useState } from 'react';
import { useUser } from '../lib/auth';
import { Copy, Plus, Trash2, KeyRound, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ApiKey } from '../types';

export default function KeysPage() {
  const { user } = useUser();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchKeys();
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchKeys = () => {
    if (!user) return;
    fetch(`/api/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setKeys(data.apiKeys || []);
        setLoading(false);
      });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newKeyName) return;
    setCreating(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id, name: newKeyName })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create key');
      }

      setNewRawKey(data.rawKey);
      setNewKeyName('');
      showToast('API Key created successfully', 'success');
      fetchKeys();
    } catch (err: any) {
      console.error('Error creating key:', err);
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this key?')) return;
    try {
      await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (newRawKey) {
      navigator.clipboard.writeText(newRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading keys...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-slate-300 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.message}
        </div>
      )}

      <header className="flex items-center justify-between bg-black/20 p-6 rounded-xl border border-white/5 mt-[-10px] shadow-sm">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight">API Keys & Access Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create, manage, and secure API credentials for your applications.</p>
        </div>
      </header>

      {newRawKey && (
        <div className="p-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 mb-8 animate-in fade-in slide-in-from-top-4 shadow-lg">
          <h3 className="text-lg font-medium text-indigo-400 flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5" />
            New API Key Generated
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Please copy this key immediately. You will not be able to see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-[#050505] p-3 rounded font-mono text-sm overflow-x-auto text-white border border-white/5 shadow-inner">
              {newRawKey}
            </code>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition border border-transparent hover:border-white/5"
            >
              {copied ? <Check className="w-5 h-5 text-indigo-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
          <button 
            onClick={() => setNewRawKey(null)}
            className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-white transition"
          >
            I have saved it securely
          </button>
        </div>
      )}

      <div className="p-6 rounded-xl border border-white/5 bg-[#0f0f0f] shadow-sm">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-6">Create New Key</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Key Name (e.g. Production Server)"
            className="flex-1 bg-[#050505] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 transition"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            disabled={creating}
            required
          />
          <button 
            type="submit" 
            disabled={creating || !newKeyName}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Creating...' : 'Create Key'}
          </button>
        </form>
      </div>

      <div>
         <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1 px-2">Active Keys</h2>
         <p className="text-sm text-slate-500 mb-4 px-2">{keys.length} active key(s)</p>
         <div className="space-y-3">
           {keys.length === 0 ? (
             <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-[#0f0f0f]">
               <p className="font-medium text-white mb-2">No API Keys Yet</p>
               <p className="text-sm text-slate-500">Create your first API key to start making requests through Promptora.</p>
             </div>
           ) : (
             keys.map(key => (
               <div key={key.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-[#0f0f0f] hover:bg-white/5 transition shadow-sm">
                 <div>
                   <p className="font-medium text-sm mb-1 text-white">{key.name}</p>
                   <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                     <span>{key.prefix}</span>
                     <span>•</span>
                     <span>Created {new Date(key.createdAt).toLocaleDateString()}</span>
                     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md uppercase tracking-wider text-[9px] font-sans">● Active</span>
                   </div>
                 </div>
                 <button 
                   onClick={() => handleDelete(key.id)}
                   className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                   title="Revoke Key"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
}