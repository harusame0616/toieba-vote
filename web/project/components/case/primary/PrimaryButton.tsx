import { Button } from '@mui/material';

export interface PrimaryButtonProp
  extends React.ComponentProps<typeof Button> {}

const PrimaryButton = (prop: PrimaryButtonProp) => {
  return <Button {...prop} variant="contained" />;
};

export default PrimaryButton;
