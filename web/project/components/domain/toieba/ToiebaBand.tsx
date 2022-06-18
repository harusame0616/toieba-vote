import { Box } from '@mui/material';
import { ReactNode } from 'react';
import Band from '../../base/Band';

interface Prop {
  children: ReactNode;
}

const ToiebaBand = ({ children }: Prop) => {
  return (
    <Band>
      <Box sx={{ wordBreak: 'break-all', minWidth: '0' }}>{children}</Box>
      <div>といえば・・・</div>
    </Band>
  );
};

export default ToiebaBand;
