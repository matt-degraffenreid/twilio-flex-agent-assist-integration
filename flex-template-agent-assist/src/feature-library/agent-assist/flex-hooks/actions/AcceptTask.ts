import * as Flex from '@twilio/flex-ui';

import {
  FlexActionEvent,
  FlexAction,
  AgentAssistAction,
  invokeAgentAssistAction,
} from '../../../../types/feature-loader';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function beforeAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const conversationSid = Flex.TaskHelper.getTaskConversationSid(payload.task);
    const agentAssistUtils = AgentAssistUtils.instance;

    logger.debug(`[Agent-Assist] Setting active conversation to ${conversationSid}`);
    const conversationName = agentAssistUtils.getConversationName(conversationSid);
    const request = {
      conversationName,
    };
    invokeAgentAssistAction(AgentAssistAction.activeConversationSelected, request);
  });
};
