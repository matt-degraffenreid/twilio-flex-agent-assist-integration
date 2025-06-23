import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';

import { FlexEvent, AgentAssistAction, invokeAgentAssistAction } from '../../../../types/feature-loader';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import logger from '../../../../utils/logger';

async function selectAndAcceptTask(flex: typeof Flex, task: ITask) {
  console.log('im firing');
  const { sid, taskChannelUniqueName } = task;
  const agentAssistUtils = AgentAssistUtils.instance;
  // we don't want to auto accept outbound voice tasks as they are already auto
  // accepted
  let conversationSid;
  console.log('task status:');
  console.log(task.status);
  if (taskChannelUniqueName === 'voice') {
    conversationSid = task.attributes.call_sid;
  } else {
    conversationSid = Flex.TaskHelper.getTaskConversationSid(task);
  }

  logger.debug(`[Agent-Assist] Setting active conversation to ${conversationSid}`);

  const conversationName = agentAssistUtils.getConversationName(`${conversationSid}`);
  const request = {
    conversationName,
  };
  invokeAgentAssistAction(AgentAssistAction.activeConversationSelected, request);
  if (taskChannelUniqueName === 'voice') {
    console.log(`[Agent-Assist] Listening for suggestions to conversation ${conversationName}`);
    agentAssistUtils.subscribeToConversation(conversationName);
  }
}

export const eventName = FlexEvent.taskAccepted;
export const eventHook = function autoSelectAndAcceptTask(flex: typeof Flex, manager: Flex.Manager, task: ITask) {
  selectAndAcceptTask(flex, task);
};
