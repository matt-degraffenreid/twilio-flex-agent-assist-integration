
import * as Flex from '@twilio/flex-ui';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function beforeAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    console.log("Accepted a task");
    console.log(Flex.TaskHelper.getTaskConversationSid(payload.task))
    const agentAssistUtils = AgentAssistUtils.instance;
    agentAssistUtils.activeConversationSelected(Flex.TaskHelper.getTaskConversationSid(payload.task))
  });
};