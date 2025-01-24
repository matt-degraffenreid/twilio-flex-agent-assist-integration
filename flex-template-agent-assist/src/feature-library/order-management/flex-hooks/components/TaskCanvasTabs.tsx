import * as Flex from '@twilio/flex-ui';

import { OrderManagementModule } from '../../custom-components/OrderManagementModule/OrderManagementModule';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.TaskCanvasTabs;
export const componentHook = function addCustomerInfoTab(flex: typeof Flex, manager: Flex.Manager) {
  flex.TaskCanvasTabs.Content.add(
    <Flex.Tab key="customerInfo" uniqueName="customerInfo" label="Customer Info">
      <OrderManagementModule />
    </Flex.Tab>,
  );
};
