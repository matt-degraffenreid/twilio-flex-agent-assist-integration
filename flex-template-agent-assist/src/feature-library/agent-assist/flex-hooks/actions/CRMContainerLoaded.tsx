import * as Flex from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Stack } from '@twilio-paste/core/stack';

import { FlexActionEvent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings/AgentAssist';
import { isAgentCoachingEnabled, isKnowledgeAssistEnabled } from '../../config';
import { AgentCoaching } from '../../custom-components/AgentCoaching/AgentCoaching';
import { GenerativeKnowledgeAssist } from '../../custom-components/GenerativeKnowledgeAssist/GenerativeKnowledgeAssist';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addAgentAssistContainerToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (
      !payload.task ||
      !Flex.TaskHelper.isChatBasedTask(payload.task) ||
      Flex.TaskHelper.isInWrapupMode(payload.task)
    ) {
      return;
    }

    payload.components = [
      ...payload.components,
      {
        title: (manager.strings as any)[StringTemplates.AgentAssist],
        order: 0,
        component: (
          <Box padding="space80" overflowY="auto" width={'100%'}>
            <Stack orientation="vertical" spacing="space60">
              {isAgentCoachingEnabled() && <AgentCoaching />}
              {isKnowledgeAssistEnabled() && <GenerativeKnowledgeAssist />}
            </Stack>
          </Box>
        ),
      },
    ];
  });
};
