import { render, screen } from '@testing-library/react';

import { AgentAssistAdminFeatureSettings } from './AgentAssistAdminFeatureSettings';
import axe from '../../../../../../test-utils/axe-helper';
import {
  setServiceConfiguration,
  getMockedServiceConfiguration,
} from '../../../../../../test-utils/flex-service-configuration';

describe('AgentAssistAdminFeatureSettings', () => {
  const ownProps = {
    feature: 'mockFeature',
    initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
    setModifiedConfig: jest.fn(),
    setAllowSave: jest.fn(),
  };

  it('should pass accessibility test', async () => {
    const { container } = render(<AgentAssistAdminFeatureSettings {...ownProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
