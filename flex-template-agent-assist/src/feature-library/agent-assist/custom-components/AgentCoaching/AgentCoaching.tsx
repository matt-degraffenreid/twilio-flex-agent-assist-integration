// @ts-nocheck
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';

export const AgentCoaching = () => {
  return (
    <Card padding="space120">
      <Heading as="h2" variant="heading20">
        Agent Coaching
      </Heading>
      <Paragraph>
        <agent-assist-agent-coaching></agent-assist-agent-coaching>
      </Paragraph>
    </Card>
  );
};
