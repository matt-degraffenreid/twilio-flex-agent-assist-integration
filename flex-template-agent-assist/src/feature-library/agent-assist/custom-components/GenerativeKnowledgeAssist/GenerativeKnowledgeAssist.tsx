// @ts-nocheck
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';

export const GenerativeKnowledgeAssist = () => {
  return (
    <Card padding="space120">
      <Heading as="h2" variant="heading20">
        Generative Knowledge Assist
      </Heading>
      <Paragraph>
        <agent-assist-knowledge-assist-v2></agent-assist-knowledge-assist-v2>
      </Paragraph>
    </Card>
  );
};
