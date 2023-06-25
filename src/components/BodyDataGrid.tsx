import { ReactNode } from 'react';

interface BodyDataGridProps {
  children: ReactNode;
}

const BodyDataGrid: React.FC<BodyDataGridProps> = ({ children }) => {
  return (
    <div style={{ height: 400, width: '50%', marginTop: '2rem', alignItems: 'center' }}>
      {children}
    </div>
  );
};

export default BodyDataGrid;