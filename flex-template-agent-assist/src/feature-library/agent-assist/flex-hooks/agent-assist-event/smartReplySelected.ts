import { AgentAssistEvent } from '../../../../types/feature-loader';
import * as Flex from '@twilio/flex-ui';

export const agentAssistEventName = AgentAssistEvent.smartReplySelected;
export const agentAssistEventHook = function populateMessageInputWithSmartReplySuggestion(_flex: typeof Flex, _manager: Flex.Manager, event: any) {
    const taskSid = _flex.Manager.getInstance().store.getState().flex.view.selectedTaskSid;
    if(taskSid){
        const task = _flex.TaskHelper.getTaskByTaskSid(taskSid);
        const conversationSid = _flex.TaskHelper.getTaskConversationSid(task);
        const suggestion = event.detail.answer.reply
        _flex.Actions.invokeAction('SetInputText', {
            body: suggestion,
            conversationSid,
            selectionStart: suggestion.length,
            selectionEnd: suggestion.length,
        });
    }
}