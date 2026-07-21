import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    client.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateUser = async (id, updates) => {
    try {
      await client.patch(`/admin/users/${id}`, updates);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch { alert('Update failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await client.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert('Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.profile?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users…</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <h2 style={{ color: 'var(--navy)', fontSize: '1.4rem', margin: 0 }}>User Management</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none', minWidth: '240px' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Role', 'Tier', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--navy)', fontSize: '0.9rem' }}>{u.profile?.fullName || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={u.role}
                    onChange={e => updateUser(u.id, { role: e.target.value })}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    {['STUDENT', 'TEACHER', 'ADMIN', 'MAIN_ADMIN'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={u.tier}
                    onChange={e => updateUser(u.id, { tier: e.target.value })}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    {['PUBLIC', 'UNPAID', 'PAID'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => deleteUser(u.id)}
                    style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
