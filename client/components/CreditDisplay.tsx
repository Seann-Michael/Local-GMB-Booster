import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Zap, 
  CreditCard, 
  History, 
  Plus, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { useCredits } from '@/components/CreditProvider';
import { formatCredits } from '@/lib/creditSystem';
import { useNavigate } from 'react-router-dom';

export function CreditDisplay() {
  const { balance, isLoading } = useCredits();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Zap className="h-4 w-4 mr-1" />
        <span className="text-sm">Loading...</span>
      </Button>
    );
  }

  const getBalanceColor = () => {
    if (balance.remaining < 1000) return 'text-red-600';
    if (balance.remaining < 5000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBalanceVariant = () => {
    if (balance.remaining < 1000) return 'destructive';
    if (balance.remaining < 5000) return 'secondary';
    return 'default';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          <Badge variant={getBalanceVariant()} className="gap-1">
            {formatCredits(balance.remaining)}
          </Badge>
          {balance.remaining < 1000 && (
            <AlertTriangle className="h-3 w-3 text-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Credit Balance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-3 space-y-3">
          {/* Current Balance */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Available</span>
            <span className={`font-semibold ${getBalanceColor()}`}>
              {formatCredits(balance.remaining)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Used</span>
            <span className="text-sm text-gray-900">
              {formatCredits(balance.used)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Credits</span>
            <span className="text-sm text-gray-900">
              {formatCredits(balance.total)}
            </span>
          </div>

          {/* Usage Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Usage</span>
              <span>{((balance.used / balance.total) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((balance.used / balance.total) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Low Balance Warning */}
          {balance.remaining < 5000 && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-800">
                    {balance.remaining < 1000 ? 'Critical Low Balance' : 'Low Balance Warning'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Consider purchasing more credits to continue scanning.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/admin/credits/purchase')}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Purchase Credits</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/admin/credits/history')}>
          <History className="mr-2 h-4 w-4" />
          <span>Usage History</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/admin/credits/analytics')}>
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Usage Analytics</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
