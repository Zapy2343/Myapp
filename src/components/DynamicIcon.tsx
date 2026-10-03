import React from 'react';
import {
  Landmark,
  PiggyBank,
  Coins,
  TrendingUp,
  Wallet,
  Home,
  Bitcoin,
  Car,
  Briefcase,
  Shield,
  Gem,
  Layers,
  CircleDollarSign,
  type LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const AVAILABLE_ICONS = [
  { name: 'Landmark', label: 'Bank' },
  { name: 'PiggyBank', label: 'Savings' },
  { name: 'Coins', label: 'Gold / Metals' },
  { name: 'TrendingUp', label: 'Stocks / Shares' },
  { name: 'Wallet', label: 'Cash / Wallet' },
  { name: 'Home', label: 'Real Estate' },
  { name: 'Bitcoin', label: 'Crypto' },
  { name: 'Car', label: 'Vehicles' },
  { name: 'Briefcase', label: 'Business Equity' },
  { name: 'Shield', label: 'Emergency / Safety' },
  { name: 'Gem', label: 'Jewelry / Luxury' },
  { name: 'Layers', label: 'Other Assets' },
];

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Landmark':
      return <Landmark {...props} />;
    case 'PiggyBank':
      return <PiggyBank {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Bitcoin':
      return <Bitcoin {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    case 'Gem':
      return <Gem {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <CircleDollarSign {...props} />;
  }
};
