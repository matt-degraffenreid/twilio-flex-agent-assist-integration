import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Form, FormControl, FormActions } from '@twilio-paste/core/form';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { Label } from '@twilio-paste/core/label';
import { TextArea } from '@twilio-paste/core/textarea';
import { Input } from '@twilio-paste/core/input';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { ArrowBackIcon } from '@twilio-paste/icons/esm/ArrowBackIcon';

interface Props {
  currentStep: number;
  handleClose: () => void;
}

export const EditOrder = ({ currentStep, handleClose }: Props) => {
  const toaster = useToaster();
  if (currentStep !== 2) {
    return null;
  }

  const pause = async (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const handleCancelOrder = async (e: any) => {
    e.preventDefault();
    if (e.target.orderId.value === '1234') {
      toaster.push({
        message: 'Order cancelled successfully',
        variant: 'success',
        dismissAfter: 2000,
      });
      await pause(2000);
      handleClose();
    } else {
      toaster.push({
        message: 'Order does not exisit',
        variant: 'error',
        dismissAfter: 2000,
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      backgroundColor="colorBackground"
      paddingY="space120"
      paddingX="space180"
      borderRadius="borderRadius30"
      width="100%"
    >
      <Stack orientation="vertical" spacing={'space120'}>
        <Heading as="h6" variant="heading10">
          Order Management
        </Heading>
        <Form onSubmit={handleCancelOrder}>
          <FormControl>
            <Label htmlFor={'orderId'} required>
              Order ID
            </Label>
            <Input type="text" id={'orderId'} name="orderId" required />
          </FormControl>
          <FormControl>
            <Label htmlFor={'cancelationReason'} required>
              Cancelation Reason
            </Label>
            <TextArea id={'cancelationReason'} name="cancelationReason" required />
          </FormControl>
          <FormActions>
            <Button variant="primary" onClick={handleClose}>
              <ArrowBackIcon decorative />
              Back
            </Button>
            <Button variant="destructive_secondary" type={'submit'}>
              <DeleteIcon decorative />
              Cancel Order
            </Button>
          </FormActions>
        </Form>
      </Stack>
      <Toaster {...toaster} />
    </Box>
  );
};
