import { Button } from '@mui/material';

export interface Prop extends React.ComponentProps<typeof Button> {}

const SecondaryButton = (prop: Prop) => {
  return <Button {...prop} variant="outlined" />;
};

export default SecondaryButton;
