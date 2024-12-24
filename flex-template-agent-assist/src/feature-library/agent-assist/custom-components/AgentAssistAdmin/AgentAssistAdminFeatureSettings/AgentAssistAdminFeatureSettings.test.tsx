import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Flex from '@twilio/flex-ui';

import { AgentAssistAdminFeatureSettings } from './AgentAssistAdminFeatureSettings';
import axe from '../../../../../../test-utils/axe-helper';
import {
  setServiceConfiguration,
  getMockedServiceConfiguration,
} from '../../../../../../test-utils/flex-service-configuration';
import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import defaultConfigurationValues from '../../../../../../../flex-config/ui_attributes.common.json';

describe('AgentAssistAdminFeatureSettings', () => {
  let ownProps = {
    feature: 'mockFeature',
    initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
    setModifiedConfig: jest.fn(),
    setAllowSave: jest.fn(),
  };

  describe('When configuration values are stored in the configuration service', () => {
    it('should display the saved value for agent coaching', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { agent_coaching } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const agentCoachingSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.AgentCoaching}-switch`,
      );

      expect(agentCoachingSwitch).toHaveProperty('checked', agent_coaching);
    });

    it('should display the saved value for conversation summary', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { conversation_summary } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const conversationSummarySwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.ConversationSummarization}-switch`,
      );

      expect(conversationSummarySwitch).toHaveProperty('checked', conversation_summary);
    });

    it('should display the saved value for smart reply', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { smart_reply } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const smartReplySwitch = await screen.findByTestId(`enable-${AgentAssistStringTemplates.SmartReply}-switch`);

      expect(smartReplySwitch).toHaveProperty('checked', smart_reply);
    });

    it('should display the saved value for knowleadge assist', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { knowledge_assist } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const knowleadgeAssistSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.KnowledgeAssist}-switch`,
      );

      expect(knowleadgeAssistSwitch).toHaveProperty('checked', knowledge_assist);
    });
  });

  describe('When no configuation values are stored in the configation server', () => {
    beforeEach(async () => {
      setServiceConfiguration({ ui_attributes: { ...defaultConfigurationValues } }, null);
      ownProps = {
        feature: 'mockFeature',
        initialConfig: { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist },
        setModifiedConfig: jest.fn(),
        setAllowSave: jest.fn(),
      };
    });

    it('should display the default value for agent coaching', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { agent_coaching } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const agentCoachingSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.AgentCoaching}-switch`,
      );

      expect(agentCoachingSwitch).toHaveProperty('checked', agent_coaching);
    });

    it('should display the default value for conversation summary', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { conversation_summary } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const conversationSummarySwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.ConversationSummarization}-switch`,
      );

      expect(conversationSummarySwitch).toHaveProperty('checked', conversation_summary);
    });

    it('should display the default value for smart reply', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { smart_reply } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const smartReplySwitch = await screen.findByTestId(`enable-${AgentAssistStringTemplates.SmartReply}-switch`);

      expect(smartReplySwitch).toHaveProperty('checked', smart_reply);
    });

    it('should display the default value for knowleadge assist', async () => {
      const { custom_data } = Flex.Manager.getInstance().configuration;
      const { knowledge_assist } = custom_data.features.agent_assist;

      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const knowleadgeAssistSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.KnowledgeAssist}-switch`,
      );

      expect(knowleadgeAssistSwitch).toHaveProperty('checked', knowledge_assist);
    });
  });

  describe('When the user edits values in admin panel', () => {
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
                  smart_reply: true,
                  conversation_summary: true,
                  agent_coaching: true,
                  knowledge_assist: true,
                },
              },
            },
          },
        },
        null,
      );
      ownProps.initialConfig = { ...getMockedServiceConfiguration().ui_attributes.custom_data.features.agent_assist };
    });

    it('should be able to toggle agent coaching', async () => {
      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const agentCoachingSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.AgentCoaching}-switch`,
      );
      await userEvent.click(agentCoachingSwitch);

      expect(agentCoachingSwitch).toHaveProperty('checked', false);
    });

    it('should be able to toggle conversation summary', async () => {
      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const conversationSummarySwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.ConversationSummarization}-switch`,
      );
      await userEvent.click(conversationSummarySwitch);

      expect(conversationSummarySwitch).toHaveProperty('checked', false);
    });

    it('should be able to toggle smart reply', async () => {
      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const smartReplySwitch = await screen.findByTestId(`enable-${AgentAssistStringTemplates.SmartReply}-switch`);
      await userEvent.click(smartReplySwitch);

      expect(smartReplySwitch).toHaveProperty('checked', false);
    });

    it('should be able to toggle knowleadge assist', async () => {
      render(<AgentAssistAdminFeatureSettings {...ownProps} />);

      const knowleadgeAssistSwitch = await screen.findByTestId(
        `enable-${AgentAssistStringTemplates.KnowledgeAssist}-switch`,
      );
      await userEvent.click(knowleadgeAssistSwitch);

      expect(knowleadgeAssistSwitch).toHaveProperty('checked', false);
    });
  });

  it('should pass accessibility test', async () => {
    const { container } = render(<AgentAssistAdminFeatureSettings {...ownProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
