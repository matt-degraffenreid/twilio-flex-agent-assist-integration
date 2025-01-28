import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { Form, FormControl, FormActions } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { TextArea } from '@twilio-paste/core/textarea';
import { Input } from '@twilio-paste/core/input';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { ArrowBackIcon } from '@twilio-paste/icons/esm/ArrowBackIcon';
import { Callout, CalloutHeading, CalloutText } from '@twilio-paste/core/callout';
import { useState } from 'react';

interface Props {
  currentStep: number;
  handleClose: () => void;
}

export const EditOrder = ({ currentStep, handleClose }: Props) => {
  const [status, setStatus] = useState({ error: false, success: false, msg: '' });

  if (currentStep !== 2) {
    return null;
  }

  const handleCancelOrder = async (e: any) => {
    e.preventDefault();
    if (e.target.orderId.value === '1234') {
      setStatus({ error: false, success: true, msg: `The order was cancelled.` });
    } else {
      setStatus({
        error: true,
        success: false,
        msg: `Order ${e.target.orderId.value} cannot be found, so it cannot be cancelled`,
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
            <Button
              variant="primary"
              onClick={() => {
                setStatus({ error: false, success: false, msg: '' });
                handleClose();
              }}
            >
              <ArrowBackIcon decorative />
              Back
            </Button>
            <Button variant="destructive_secondary" type={'submit'}>
              <DeleteIcon decorative />
              Cancel Order
            </Button>
          </FormActions>
        </Form>
        {status.success && (
          <Callout variant="success">
            <CalloutHeading as="h2">Success!</CalloutHeading>
            <CalloutText>{status.msg}</CalloutText>
          </Callout>
        )}
        {status.error && (
          <Callout variant="error">
            <CalloutHeading as="h2">Error!</CalloutHeading>
            <CalloutText>{status.msg}</CalloutText>
          </Callout>
        )}
      </Stack>
    </Box>
  );
};
