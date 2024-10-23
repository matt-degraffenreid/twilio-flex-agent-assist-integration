import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isSmartReplyEnabled } from '../../config';
import { SmartReply } from '../../custom-components/SmartReply/SmartReply';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';

export const componentName = FlexComponent.MessageInputV2;
export const componentHook = function addSmartReplyToMessageInput(
    flex: typeof Flex,
    _manager: Flex.Manager,
) {
    const options: Flex.ContentFragmentProps = {
        sortOrder: -1,
        align: 'end',
    };

    if (isSmartReplyEnabled()) {
        flex.MessageInputV2.Content.add(<SmartReply key="template-agent-assist-message-input" />, options);
    
    }
};