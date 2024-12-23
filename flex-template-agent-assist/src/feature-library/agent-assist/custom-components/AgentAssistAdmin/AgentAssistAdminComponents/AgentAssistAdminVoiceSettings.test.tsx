import { render, screen } from '@testing-library/react';

import { AgentAssistAdminVoiceSettings } from './AgentAssistAdminVoiceSettings';
import axe from '../../../../../../test-utils/axe-helper';
import {
  setServiceConfiguration,
  getMockedServiceConfiguration,
} from '../../../../../../test-utils/flex-service-configuration';

describe('AgentAssistAdminVoiceSettings', () => {
  const ownProps = {
    feature: 'mockFeature',
    initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
    setModifiedConfig: jest.fn(),
    setAllowSave: jest.fn(),
  };

  it('should pass accessibility test', async () => {
    const { container } = render(<AgentAssistAdminVoiceSettings {...ownProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
