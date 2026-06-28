export function CustomersSection() {
  const customers = [
    { id: '1', name: 'Tunde Afolabi', email: 'tunde@example.com', spent: '₦450,000', orders: 12, membership: 'Platinum' },
    { id: '2', name: 'Chioma Okeke', email: 'chioma@example.com', spent: '₦120,000', orders: 4, membership: 'Gold' },
    { id: '3', name: 'Abubakar Musa', email: 'musa@example.com', spent: '₦85,000', orders: 2, membership: 'Silver' },
    { id: '4', name: 'Olumide Bakare', email: 'olu@example.com', spent: '₦1,200,000', orders: 25, membership: 'Platinum' },
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xl font-black uppercase tracking-tight">Customer CRM</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
            <tr>
              <th className="px-8 py-5">Profile</th>
              <th className="px-8 py-5">Membership</th>
              <th className="px-8 py-5">Purchase History</th>
              <th className="px-8 py-5">LTV (Life-time Value)</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-black text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-widest">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                    c.membership === 'Platinum' ? 'bg-purple-100 text-purple-700' : 
                    c.membership === 'Gold' ? 'bg-amber-100 text-amber-700' :
                    c.membership === 'Silver' ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-muted-foreground'
                  }`}>
                    {c.membership} Tier
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-xs">{c.orders} Orders</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Last order: 2 days ago</p>
                </td>
                <td className="px-8 py-6 font-black text-sm">{c.spent}</td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Full Analytics</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
