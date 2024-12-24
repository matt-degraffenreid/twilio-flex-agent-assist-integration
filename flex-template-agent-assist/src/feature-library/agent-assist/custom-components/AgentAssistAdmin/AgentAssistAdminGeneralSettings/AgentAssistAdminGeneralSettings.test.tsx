import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Flex from '@twilio/flex-ui';

import axe from '../../../../../../test-utils/axe-helper';
import { AgentAssistAdminGeneralSettings } from './AgentAssistAdminGeneralSettings';
import {
  setServiceConfiguration,
  getMockedServiceConfiguration,
} from '../../../../../../test-utils/flex-service-configuration';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';

describe('AgentAssistAdminGeneralSettings', () => {
  const ownProps = {
    feature: 'mockFeature',
    initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
    setModifiedConfig: jest.fn(),
    setAllowSave: jest.fn(),
  };
  describe('When configuration values are stored', () => {
    it('Should display store value from configuration service for custom api endpoint', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { custom_api_endpoint } = custom_data.features.agent_assist;

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('custom-api-endpoint-input');

      expect(input).toHaveProperty('value', custom_api_endpoint);
    });

    it('Should display store value from configuration service for custom api endpoint', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { conversation_profile } = custom_data.features.agent_assist;

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('conversation-profile-input');

      expect(input).toHaveProperty('value', conversation_profile);
    });

    it('should be able to replace custom api endpoint', async () => {
      const customApiEndpoint = 'https://8.8.8.8';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('custom-api-endpoint-input');
      await userEvent.clear(input);
      await userEvent.type(input, customApiEndpoint);

      expect(input).toHaveProperty('value', customApiEndpoint);
    });

    it('should be able to replace a conversation profile', async () => {
      const customApiEndpoint =
        'projects/mockGcpProject/locations/mockLocation/conversationProfiles/mockConversationProfileId';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('conversation-profile-input');
      await userEvent.clear(input);
      await userEvent.type(input, customApiEndpoint);

      expect(input).toHaveProperty('value', customApiEndpoint);
    });
  });

  describe('when validating configuration values', () => {
    it('should display an display success message when conversation profile exist', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { conversation_profile } = custom_data.features.agent_assist;

      const agentAssistUtils = AgentAssistUtils.instance;
      agentAssistUtils.getAgentAssistAuthToken = jest.fn().mockImplementationOnce(() => 'mockAuthToken');
      agentAssistUtils.getConversationProfile = jest.fn().mockImplementationOnce(() => conversation_profile);

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const button = await screen.findByTestId('validate-conversation-profile-btn');
      await userEvent.click(button);
      const successMessage = await screen.findByText(AdminUiStringTemplates.ValidateConversationProfileSuccess);

      expect(successMessage).toBeDefined();
    });

    it('should display an display error message when conversation profile does not exist', async () => {
      const agentAssistUtils = AgentAssistUtils.instance;
      agentAssistUtils.getAgentAssistAuthToken = jest.fn().mockImplementationOnce(() => 'mockAuthToken');
      agentAssistUtils.getConversationProfile = jest.fn().mockImplementationOnce(() => undefined);

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const button = await screen.findByTestId('validate-conversation-profile-btn');
      await userEvent.click(button);
      const errorMessage = await screen.findByText(AdminUiStringTemplates.ValidateConversationProfileError);

      expect(errorMessage).toBeDefined();
    });
  });

  describe('When no values are stored in the configuration service', () => {
    beforeEach(() => {
      setServiceConfiguration(
        {
          ui_attributes: {
            custom_data: {
              serverless_functions_protocol: 'https',
              serverless_functions_port: '443',
              serverless_functions_domain_agent_assist: 'mockServerlessFunctionsDomain',
              language: 'default',
              common: null,
              features: {
                agent_assist: {
                  custom_api_endpoint: null,
                  conversation_profile: null,
                },
              },
            },
          },
        },
        null,
      );
      ownProps.initialConfig = { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist };
    });

    it('should have placeholder text for custom api endpoint input', async () => {
      const placeholderText = 'Enter custom api endpoint';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByPlaceholderText(placeholderText);

      expect(input).toBeDefined();
    });

    it('should have placeholder text for conversation profile input', async () => {
      const placeholderText = 'Enter conversation profile id';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByPlaceholderText(placeholderText);

      expect(input).toBeDefined();
    });

    it('should be able to provide custom api endpoint', async () => {
      const customApiEndpoint = 'https://8.8.8.8';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('custom-api-endpoint-input');
      await userEvent.type(input, customApiEndpoint);

      expect(input).toHaveProperty('value', customApiEndpoint);
    });

    it('should be able to provide a conversation profile', async () => {
      const conversationProfile =
        'projects/mockGcpProject/locations/mockLocation/conversationProfiles/mockConversationProfileId';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('conversation-profile-input');

      await userEvent.type(input, conversationProfile);

      expect(input).toHaveProperty('value', conversationProfile);
    });
  });

  describe('When provided values are not in the correct format', () => {
    beforeEach(() => {
      setServiceConfiguration(
        {
          ui_attributes: {
            custom_data: {
              serverless_functions_protocol: 'https',
              serverless_functions_port: '443',
              serverless_functions_domain_agent_assist: 'mockServerlessFunctionsDomain',
              language: 'default',
              common: null,
              features: {
                agent_assist: {
                  custom_api_endpoint: null,
                  conversation_profile: null,
                },
              },
            },
          },
        },
        null,
      );
      ownProps.initialConfig = { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist };
    });

    it('should display an error message for conversation profile', async () => {
      const conversationProfile = 'not a valid conversation profile';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);

      const input = await screen.findByTestId('conversation-profile-input');
      await userEvent.type(input, conversationProfile);
      const conversationProfileErrorText = await screen.findAllByText(
        AdminUiStringTemplates.ConversationProfileErrorText,
      );
      expect(conversationProfileErrorText).toBeDefined();
    });

    it('should not be able to validate conversation profile', async () => {
      const conversationProfile = 'not a valid conversation profile';

      render(<AgentAssistAdminGeneralSettings {...ownProps} />);
      const input = await screen.findByTestId('conversation-profile-input');
      await userEvent.type(input, conversationProfile);
      const button = await screen.findByTestId('validate-conversation-profile-btn');

      expect(button).toHaveProperty('disabled', true);
    });
  });

  it('should pass accessibility test', async () => {
    const { container } = render(<AgentAssistAdminGeneralSettings {...ownProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
