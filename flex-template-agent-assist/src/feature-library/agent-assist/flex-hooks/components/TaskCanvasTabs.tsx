import * as Flex from '@twilio/flex-ui';

import ConversationSummarization from '../../custom-components/ConversationSummarization';
import { FlexComponent } from '../../../../types/feature-loader';
import { StringTemplates } from '../strings/AgentAssist';
import { isConversationSummaryEnabled } from '../../config';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addConversationSummarizationTab(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab
      key="conversationSummarization"
      uniqueName="conversationSummarization"
      label={(manager.strings as any)[StringTemplates.ConversationSummarization]}
    >
      <ConversationSummarization key="agent-assist-conversation-summarization-tab-content" />
    </Flex.Tab>,
    {
      sortOrder: 1000,
      if: ({ task }) =>
        isConversationSummaryEnabled() &&
        (Flex.TaskHelper.isTaskAccepted(task) || Flex.TaskHelper.isInWrapupMode(task)),
    },
  );
};
