import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  change?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  change,
  isLoading = false
}) => {
  // Map of color classes
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100'
    }
  };
  
  const { bg, text, iconBg } = colorClasses[color];
  
  return (
    <div className={`${bg} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className={`text-2xl font-bold ${text} mt-1`}>{value}</p>
          )}
          
          {change && !isLoading && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">so với tháng trước</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${iconBg} p-3 rounded-full`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard; 