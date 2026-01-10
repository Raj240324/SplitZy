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
  onPay?: (to: string, amount: number) => void;
}

const BalanceView = ({ balances, totalSpend, memberUpiIds, onPay }: BalanceViewProps) => {
  return (
    <div className="space-y-6">
      {/* Tip for UPI */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Smartphone className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5 whitespace-nowrap">Pro Tip</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Link UPI IDs in <span className="font-bold text-foreground">Settings</span> to unlock one-tap payments for everyone.
          </p>
        </div>
      </div>

      {/* Total Spending Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Group Spending</p>
        <p className="text-4xl font-black tracking-tight text-primary">{formatCurrency(totalSpend)}</p>
      </div>

      {/* Member Balances */}
      <div className="space-y-4">
        {balances.length === 0 ? (
          <div className="text-center py-12 px-4 bg-muted/20 rounded-3xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground italic">No members found in this group.</p>
          </div>
        ) : (
          balances.map(balance => {
            const isSettled = Math.abs(balance.netBalance) < 0.01;
            const isPositive = balance.netBalance > 0;

            return (
              <div 
                key={balance.member}
                className="bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 p-5 transition-all hover:border-primary/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={balance.member} size="lg" />
                    <div className="flex flex-col">
                      <h4 className="font-black text-base tracking-tight">{balance.member}</h4>
                      {isSettled ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <CheckCircle className="w-3 h-3" />
                          <span>Guilt Free</span>
                        </div>
                      ) : (
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? 'Receives ' : 'Must Pay '}
                          {formatCurrency(Math.abs(balance.netBalance))}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isSettled && (
                    <span className={`text-xl font-black tracking-tighter ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(Math.abs(balance.netBalance))}
                    </span>
                  )}
                </div>

                {/* Who owes whom */}
                {balance.owesTo.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">To be paid to</p>
                    {balance.owesTo.map(debt => (
                      <div key={debt.member} className="flex items-center justify-between text-sm bg-muted/30 p-2.5 rounded-xl border border-border/30">
                        <div className="flex items-center gap-2 font-bold text-muted-foreground">
                          <span className="text-foreground">{balance.member}</span>
                          <ArrowRight className="w-3 h-3 opacity-30" />
                          <span className="text-foreground">{debt.member}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-rose-500/80">
                            {formatCurrency(debt.amount)}
                          </span>
                          {memberUpiIds?.[debt.member] ? (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="h-8 text-[10px] font-black uppercase tracking-widest gap-1.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                              onClick={() => {
                                if (onPay) {
                                  onPay(debt.member, debt.amount);
                                } else {
                                  window.location.href = generateUpiLink(
                                    memberUpiIds[debt.member], 
                                    debt.member, 
                                    debt.amount, 
                                    `SplitZy: ${balance.member} to ${debt.member}`
                                  );
                                }
                              }}
                            >
                              <Smartphone className="w-3 h-3" />
                              Pay
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5">
                              Remind
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {balance.getsFrom.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Receiving from</p>
                    {balance.getsFrom.map(credit => (
                      <div key={credit.member} className="flex items-center justify-between text-sm bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 font-bold text-muted-foreground">
                          <span className="text-foreground">{credit.member}</span>
                          <ArrowRight className="w-3 h-3 opacity-30" />
                          <span className="text-foreground">{balance.member}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-500/80">
                            {formatCurrency(credit.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSettled && (
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50 text-muted-foreground/40">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">No pending bills</span>
                  </div>
                )}
              </div>
            );
          })
        )}
    </div>
  );
};

export default BalanceView;
