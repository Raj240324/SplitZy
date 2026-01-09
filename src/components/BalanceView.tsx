import { CheckCircle, ArrowRight, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberBalance } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import MemberAvatar from './MemberAvatar';
import { generateUpiLink } from '@/utils/payment';

interface BalanceViewProps {
  balances: MemberBalance[];
  totalSpend: number;
  memberUpiIds?: Record<string, string>;
}

const BalanceView = ({ balances, totalSpend, memberUpiIds }: BalanceViewProps) => {
  return (
    <div className="space-y-6">
      {/* Total Spending Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">Total Group Spending</p>
        <p className="text-4xl font-bold text-primary">{formatCurrency(totalSpend)}</p>
      </div>

      {/* Member Balances */}
      <div className="space-y-4">
        {balances.map(balance => {
          const isSettled = Math.abs(balance.netBalance) < 0.01;
          const isPositive = balance.netBalance > 0;

          return (
            <div 
              key={balance.member}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MemberAvatar name={balance.member} size="lg" />
                  <div>
                    <h4 className="font-semibold text-lg">{balance.member}</h4>
                    {isSettled ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <span>All settled up</span>
                      </div>
                    ) : (
                      <p className={`text-sm font-medium ${isPositive ? 'text-balance-positive' : 'text-balance-negative'}`}>
                        {isPositive ? 'Gets back ' : 'Owes '}
                        {formatCurrency(balance.netBalance)}
                      </p>
                    )}
                  </div>
                </div>
                {!isSettled && (
                  <span className={`text-2xl font-bold ${isPositive ? 'text-balance-positive' : 'text-balance-negative'}`}>
                    {isPositive ? '+' : '-'}{formatCurrency(balance.netBalance)}
                  </span>
                )}
              </div>

              {/* Who owes whom */}
              {balance.owesTo.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border">
                  {balance.owesTo.map(debt => (
                    <div key={debt.member} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{balance.member}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span>{debt.member}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-balance-negative">
                          {formatCurrency(debt.amount)}
                        </span>
                        {memberUpiIds?.[debt.member] ? (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="h-8 text-[10px] font-black uppercase tracking-widest gap-1.5 rounded-xl shadow-lg shadow-primary/20"
                            onClick={() => window.location.href = generateUpiLink(memberUpiIds[debt.member], debt.member, debt.amount)}
                          >
                            <Smartphone className="w-3 h-3" />
                            Pay UPI
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Remind
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {balance.getsFrom.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border">
                  {balance.getsFrom.map(credit => (
                    <div key={credit.member} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{credit.member}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span>{balance.member}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-balance-positive">
                          {formatCurrency(credit.amount)}
                        </span>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Settle Up
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isSettled && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-border text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">No pending settlements</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BalanceView;
