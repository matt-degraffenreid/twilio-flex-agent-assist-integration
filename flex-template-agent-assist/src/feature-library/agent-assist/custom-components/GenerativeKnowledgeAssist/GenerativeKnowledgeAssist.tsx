// @ts-nocheck
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core/stack';

export const GenerativeKnowledgeAssist = () => {
  return (
    <Box padding="space80" overflowY="auto" width={'100%'} background="white">
      <Stack orientation="vertical" spacing="space60">
        <Box>
          <agent-assist-knowledge-assist-v2></agent-assist-knowledge-assist-v2>
        </Box>
      </Stack>
    </Box>
  );
};
