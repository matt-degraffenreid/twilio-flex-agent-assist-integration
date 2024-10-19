import * as Flex from '@twilio/flex-ui';
import { isAgentAssistEnabled } from 'feature-library/agent-assist/utils/helpers';

import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addAgentAssistToMainHeader(flex: typeof Flex, manager: Flex.Manager) {
  if (!isAgentAssistEnabled()) {
    return;
  }

  // Add alert button to the main header
  flex.MainHeader.Content.add(<AdminSideLink viewName="template-admin" key="template-admin-side-nav" />, {
    sortOrder: -1,
    align: 'end',
  });
};
