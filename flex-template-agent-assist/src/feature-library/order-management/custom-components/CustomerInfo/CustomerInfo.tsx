import { Template, templates } from '@twilio/flex-ui';
import {
  DescriptionList,
  DescriptionListSet,
  DescriptionListTerm,
  DescriptionListDetails,
} from '@twilio-paste/core/description-list';
import { Button } from '@twilio-paste/core/Button';
import { Heading } from '@twilio-paste/core/Heading';
import { Box } from '@twilio-paste/core/Box';

import { StringTemplates } from '../../flex-hooks/strings';

interface Props {
  currentStep: number;
  handleOrderManagement: () => void;
}

export const CustomerInfo = ({ currentStep, handleOrderManagement }: Props) => {
  if (currentStep !== 1) {
    return null;
  }

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
      <Box>
        <Heading as="h6" variant="heading10">
          <Template source={templates[StringTemplates.CustomerAttributesHeader]} />
        </Heading>
        <DescriptionList>
          <DescriptionListSet>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDetails>John Doe</DescriptionListDetails>
          </DescriptionListSet>
          <DescriptionListSet>
            <DescriptionListTerm>Phone number</DescriptionListTerm>
            <DescriptionListDetails>-</DescriptionListDetails>
          </DescriptionListSet>
          <DescriptionListSet>
            <DescriptionListTerm>Email address</DescriptionListTerm>
            <DescriptionListDetails>jdoe@google.com</DescriptionListDetails>
          </DescriptionListSet>
        </DescriptionList>
        <Button variant="primary" onClick={handleOrderManagement}>
          Order Management
        </Button>
      </Box>
    </Box>
  );
};
