import { templates, useFlexSelector } from '@twilio/flex-ui';
import { FormSection, FormSectionHeading, FormControl, Stack, Label, Input, HelpText } from '@twilio-paste/core';
import { useEffect, useState } from 'react';

import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';
import { ValidationButton } from './ValidationButton';
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';
import { AppState } from '../../../../../types/manager';

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
  const [customApiEndpoint, setCustomApiEndpoint] = useState<ConfigItem>({
    configItem: props.initialConfig?.custom_api_endpoint ?? '',
    hasError: false,
    statusMessage: '',
  });

  const agentToken = useFlexSelector((state: AppState) => state.flex.session.ssoTokenPayload.token);
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
      setConversationProfile({ hasError: false, configItem: conversationProfile, statusMessage: '' });
    } else {
      setConversationProfile({ hasError: true, configItem: conversationProfile, statusMessage: '' });
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
              id={'custom-api-endpoint'}
              name={'custom-api-endpoint'}
              type="text"
              value={customApiEndpoint.configItem}
              onChange={(e) => setCustomApiEndpoint({ ...customApiEndpoint, configItem: e.target.value })}
              required
            />
          </>
          <ValidationButton
            configItem={customApiEndpoint}
            testConnectionFunction={validateCustomApiEndpoint}
            label={templates[AdminUiStringTemplates.TestConnectionCTA]()}
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
              id={'conversation-profile'}
              name={'conversation-profile'}
              type="text"
              value={conversationProfile.configItem}
              hasError={conversationProfile.hasError}
              onChange={(e) => conversationProfileHandler(e.target.value)}
              required
            />
            {conversationProfile.hasError && (
              <HelpText variant="error" id={'conversation-profile-error'}>
                {templates[AdminUiStringTemplates.ConversationProfileErrorText]()}
              </HelpText>
            )}
          </>
          <ValidationButton
            configItem={conversationProfile}
            testConnectionFunction={validateConversationProfileExisits}
            label={templates[AdminUiStringTemplates.TestConversationProfileCTA]()}
          />
        </Stack>
      </FormControl>
    </FormSection>
  );
};
