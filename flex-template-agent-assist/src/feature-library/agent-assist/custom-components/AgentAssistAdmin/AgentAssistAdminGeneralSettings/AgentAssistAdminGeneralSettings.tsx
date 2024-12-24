import { templates } from '@twilio/flex-ui';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Stack } from '@twilio-paste/core/stack';
import { Label } from '@twilio-paste/core/label';
import { Input } from '@twilio-paste/core/input';
import { HelpText } from '@twilio-paste/core/help-text';
import { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';

import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';
import { ValidationButton } from '../AgentAssistAdminComponents';
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';

interface OwnProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

interface ConfigItem {
  configItem: string;
  hasError: boolean;
  statusMessage: string;
}

export const AgentAssistAdminGeneralSettings = (props: OwnProps) => {
  const [conversationProfile, setConversationProfile] = useState<ConfigItem>({
    configItem: props.initialConfig?.conversation_profile ?? '',
    hasError: false,
    statusMessage: '',
  });
  const [hasConversationProfileValidationError, setHasConversationProfileValidationError] = useState<boolean>(false);
  const [customApiEndpoint, setCustomApiEndpoint] = useState<ConfigItem>({
    configItem: props.initialConfig?.custom_api_endpoint ?? '',
    hasError: false,
    statusMessage: '',
  });
  const manager = Flex.Manager.getInstance();
  const agentToken = manager.user.token;
  const agentAssistUtils = AgentAssistUtils.instance;

  const setAllowSave = () => {
    props.setAllowSave(props.feature, true);
  };

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      custom_api_endpoint: customApiEndpoint.configItem,
      conversation_profile: conversationProfile.configItem,
    });
  }, [customApiEndpoint, conversationProfile]);

  const validateCustomApiEndpoint = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const isValid = await agentAssistUtils.getStatus(customApiEndpoint.configItem);
      if (isValid) {
        setCustomApiEndpoint({
          ...customApiEndpoint,
          hasError: false,
          statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess](),
        });
      } else {
        setCustomApiEndpoint({
          ...customApiEndpoint,
          hasError: true,
          statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError](),
        });
      }
    } catch (error) {
      setCustomApiEndpoint({
        ...customApiEndpoint,
        hasError: true,
        statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError](),
      });
    }
  };

  const validateConversationProfileExisits = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const conversationProfileName = await agentAssistUtils.getConversationProfile(
        conversationProfile.configItem,
        customApiEndpoint.configItem,
      );
      if (conversationProfileName) {
        setConversationProfile({
          ...conversationProfile,
          hasError: false,
          statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileSuccess](),
        });
      } else {
        setConversationProfile({
          ...conversationProfile,
          hasError: true,
          statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError](),
        });
      }
    } catch (error) {
      setConversationProfile({
        ...conversationProfile,
        hasError: true,
        statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError](),
      });
    }
  };

  const conversationProfileHandler = (conversationProfile: string) => {
    const error = AgentAssistUtils.validateConversationProfile(conversationProfile);
    if (error) {
      setHasConversationProfileValidationError(false);
    } else {
      setHasConversationProfileValidationError(true);
    }
  };

  return (
    <FormSection>
      <FormSectionHeading>General Settings</FormSectionHeading>
      <FormControl key={'custom-api-endpoint-control'}>
        <Stack orientation="vertical" spacing="space60">
          <>
            <Label htmlFor={'custom-api-endpoint'}>{templates[AgentAssistStringTemplates.CustomApiEndpoint]()}</Label>
            <Input
              data-testid="custom-api-endpoint-input"
              id={'custom-api-endpoint'}
              name={'custom-api-endpoint'}
              type="text"
              value={customApiEndpoint.configItem}
              placeholder="Enter custom api endpoint"
              onChange={(e) => setCustomApiEndpoint({ ...customApiEndpoint, configItem: e.target.value })}
              required
            />
          </>
          <ValidationButton
            configItem={customApiEndpoint}
            testConnectionFunction={validateCustomApiEndpoint}
            label={templates[AdminUiStringTemplates.TestConnectionCTA]()}
            dataTestId="validate-custom-api-endpoint-btn"
          />
        </Stack>
      </FormControl>
      <FormControl key={'conversation-profile-control'}>
        <Stack orientation="vertical" spacing="space60">
          <>
            <Label htmlFor={'conversation-profile'}>
              {templates[AgentAssistStringTemplates.ConversationProfile]()}
            </Label>
            <Input
              data-testid="conversation-profile-input"
              id={'conversation-profile'}
              name={'conversation-profile'}
              type="text"
              value={conversationProfile.configItem}
              hasError={hasConversationProfileValidationError}
              onChange={(e) => conversationProfileHandler(e.target.value)}
              placeholder="Enter conversation profile id"
              required
            />
            {hasConversationProfileValidationError && (
              <HelpText data-testid="conversation-profile-error" variant="error" id={'conversation-profile-error'}>
                {templates[AdminUiStringTemplates.ConversationProfileErrorText]()}
              </HelpText>
            )}
          </>
          <ValidationButton
            dataTestId="validate-conversation-profile-btn"
            configItem={conversationProfile}
            testConnectionFunction={validateConversationProfileExisits}
            label={templates[AdminUiStringTemplates.TestConversationProfileCTA]()}
          />
        </Stack>
      </FormControl>
    </FormSection>
  );
};
