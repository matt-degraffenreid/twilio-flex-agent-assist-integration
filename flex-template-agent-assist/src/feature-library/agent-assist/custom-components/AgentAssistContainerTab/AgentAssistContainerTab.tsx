// @ts-nocheck
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core/stack';

import { AgentCoaching } from '../AgentCoaching/AgentCoaching';
import { GenerativeKnowledgeAssist } from '../GenerativeKnowledgeAssist/GenerativeKnowledgeAssist';

export const AgentAssistContainerTab = () => {
  return (
    <Box padding="space80" overflowY="auto" width={'100%'} background="white">
      <Stack orientation="vertical" spacing="space60">
        <AgentCoaching />
        <GenerativeKnowledgeAssist />
      </Stack>
    </Box>
  );
};
