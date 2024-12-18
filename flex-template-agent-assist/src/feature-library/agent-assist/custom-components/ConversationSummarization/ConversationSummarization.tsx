// @ts-nocheck
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core';
import { Actions, ITask } from '@twilio/flex-ui';
import { useEffect } from 'react';

import logger from '../../../../utils/logger';

export interface OwnProps {
  task?: ITask;
}

export const ConversationSummarization = ({ task }: OwnProps) => {
  if (!task) {
    return null;
  }

  useEffect(() => {
    if (task?.status === 'wrapping') {
      logger.debug(
        '[Agent-Assist][Conversation-Summarization] Entering task wrapup, switching to conversation summarization tab',
      );
      Actions.invokeAction('SetComponentState', {
        name: 'AgentTaskCanvasTabs',
        state: { selectedTabName: 'conversationSummarization' },
      });
    }
  }, [task?.status]);

  return (
    <Box padding="space80" overflowY="auto">
      <Stack orientation="vertical" spacing="space60">
        <Box>
          <agent-assist-summarization></agent-assist-summarization>
        </Box>
      </Stack>
    </Box>
  );
};
