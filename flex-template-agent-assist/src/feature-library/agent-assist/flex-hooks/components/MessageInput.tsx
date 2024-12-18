import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { isSmartReplyEnabled } from '../../config';
import { SmartReply } from '../../custom-components/SmartReply/SmartReply';

export const componentName = FlexComponent.MessageInputV2;
export const componentHook = function addSmartReplyToMessageInput(flex: typeof Flex, _manager: Flex.Manager) {
  const options: Flex.ContentFragmentProps = {
    sortOrder: -1,
    align: 'end',
  };
  /**
   * TODO: Check if we can move this statement to the if prop and if I wrap the the task in a context provider that I can access the task
   */
  if (isSmartReplyEnabled()) {
    flex.MessageInputV2.Content.add(<SmartReply key="template-agent-assist-message-input" />, options);
  }
};
