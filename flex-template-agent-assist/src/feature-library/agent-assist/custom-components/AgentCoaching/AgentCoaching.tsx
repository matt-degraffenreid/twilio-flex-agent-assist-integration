// @ts-nocheck
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core';

export const AgentCoaching = () => {
  return (
    <Box padding="space80" overflowY="auto" width={'100%'} background="white">
      <Stack orientation="vertical" spacing="space60">
        <Box>
          <agent-assist-agent-coaching></agent-assist-agent-coaching>
        </Box>
      </Stack>
    </Box>
  );
};
