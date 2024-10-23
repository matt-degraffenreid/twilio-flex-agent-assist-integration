// @ts-nocheck
import * as Flex from '@twilio/flex-ui';
import { Flex as PasteFlexComponent } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Card } from '@twilio-paste/core/card';
import { useEffect } from 'react';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import {  useFlexSelector } from '@twilio/flex-ui';
import AppState from '../../../../types/manager/AppState';

export const SmartReply = () => {
    const taskSid = useFlexSelector((state: AppState) => state.flex.view.selectedTaskSid);

    useEffect(() => {
        if(taskSid){
            const agentAssistUtils = AgentAssistUtils.instance
            const task = Flex.TaskHelper.getTaskByTaskSid(taskSid);
            const conversationSid = Flex.TaskHelper.getTaskConversationSid(task);
            const onClickInsert = (inputText: string) => {
                Flex.Actions.invokeAction('SetInputText', {
                    body: inputText,
                    conversationSid,
                    selectionStart: inputText.length,
                    selectionEnd: inputText.length,
                });
            };
            agentAssistUtils.addSmartReplyHook(onClickInsert)
        }
    }, [taskSid]);

    return (
        <Box margin="space30">
            <Card padding="space50">
                <PasteFlexComponent vAlignContent="center" height={'100%'} overflowY={'scroll'}>
                    <agent-assist-smart-reply></agent-assist-smart-reply>
                </PasteFlexComponent>
            </Card>
        </Box>
    )
}