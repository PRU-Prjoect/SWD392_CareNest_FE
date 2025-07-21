import React from 'react';

interface SecurityTabProps {
  account: Account | null;
  onChangePassword: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ account, onChangePassword }) => {
  // Component logic
};

export default SecurityTab;
