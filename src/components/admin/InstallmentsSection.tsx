import { Clock } from 'lucide-react';

export function InstallmentsSection() {
  const plans = [
    { id: '1', customer: 'Tunde Afolabi', product: 'Royal Gold Necklace', total: '₦250,000', paid: '₦125,000', progress: 50, nextPayment: '2026-07-10', status: 'Healthy' },
    { id: '2', customer: 'Chioma Okeke', product: 'Silver Bracelet', total: '₦45,000', paid: '₦11,250', progress: 25, nextPayment: '2026-06-28', status: 'Healthy' },
    { id: '3', customer: 'Olumide Bakare', product: 'Diamond Studs', total: '₦850,000', paid: '₦637,500', progress: 75, nextPayment: '2026-07-05', status: 'Healthy' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Financed</p>
          <h3 className="text-3xl font-black tracking-tighter">₦12.5M</h3>
        </div>
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Outstanding Balance</p>
          <h3 className="text-3xl font-black tracking-tighter text-accent">₦4.2M</h3>
        </div>
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Collection Rate</p>
          <h3 className="text-3xl font-black tracking-tighter text-green-600">98.2%</h3>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tight">Active Installment Contracts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-muted-foreground uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-8 py-5">Agreement</th>
                <th className="px-8 py-5">Financial Summary</th>
                <th className="px-8 py-5">Repayment Progress</th>
                <th className="px-8 py-5 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-sm uppercase">{p.customer}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{p.product}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-xs">Total: {p.total}</p>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Paid: {p.paid}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-gray-100 w-32 relative">
                        <div className="h-full bg-accent" style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black">{p.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Next Due: {p.nextPayment}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-700">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
