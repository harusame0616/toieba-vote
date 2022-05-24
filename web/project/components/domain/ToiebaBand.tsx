import { ReactNode } from 'react';
import Band from '../base/Band';

interface Prop {
  children: ReactNode;
}

const ToiebaBand = ({ children }: Prop) => {
  return (
    <Band>
      <div>{children}</div>
      <div>といえば・・・</div>
    </Band>
  );
};

export default ToiebaBand;
