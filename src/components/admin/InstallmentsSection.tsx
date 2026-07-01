import { Clock, CreditCard, Loader2 } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

interface InstallmentPlan {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  totalAmount: number;
  paidAmount: number;
  installmentsCount: number;
  paidInstallments: number;
  nextPaymentDate: string;
  status: string;
  createdAt: string;
}

interface InstallmentsSectionProps {
  installments: InstallmentPlan[];
}

export function InstallmentsSection({ installments }: InstallmentsSectionProps) {
  if (installments === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalFinanced = installments.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = installments.reduce((sum, i) => sum + i.paidAmount, 0);
  const outstanding = totalFinanced - totalPaid;
  const collectionRate = totalFinanced > 0 ? ((totalPaid / totalFinanced) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Financed</p>
          <h3 className="text-3xl font-black tracking-tighter">₦{totalFinanced.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Outstanding Balance</p>
          <h3 className="text-3xl font-black tracking-tighter text-accent">₦{outstanding.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Collection Rate</p>
          <h3 className="text-3xl font-black tracking-tighter text-green-600">{collectionRate}%</h3>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tight">Active Installment Contracts</h2>
        </div>
        {installments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={CreditCard}
              title="No Installment Plans"
              message="Active pay-small-small agreements will appear here once customers enroll."
            />
          </div>
        ) : (
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
                {installments.map((p) => {
                  const progress = p.totalAmount > 0 ? Math.round((p.paidAmount / p.totalAmount) * 100) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-sm uppercase">{p.customerName}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{p.productName}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-xs">Total: ₦{p.totalAmount.toLocaleString()}</p>
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Paid: ₦{p.paidAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-gray-100 w-32 relative">
                            <div className="h-full bg-accent" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black">{progress}%</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Next Due: {new Date(p.nextPaymentDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {p.status === 'active' ? 'Healthy' : p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
