import { templates } from '@twilio/flex-ui';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Stack } from '@twilio-paste/core/stack';
import { Label } from '@twilio-paste/core/label';
import { Input } from '@twilio-paste/core/input';
import { HelpText } from '@twilio-paste/core/help-text';
import { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../../../../types/manager';
import { reduxNamespace } from '../../../../../utils/state';
import { AgentAssistAdminState, updateAgentAssistAdminState } from '../../../flex-hooks/states/AgentAssistAdmin';
import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';
import { ValidationButton } from '../AgentAssistAdminComponents';
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';

interface ConfigError {
  hasError: boolean;
  statusMessage: string;
}

export const AgentAssistAdminGeneralSettings = () => {
  const dispatch = useDispatch();
  const { conversationProfile, customApiEndpoint } = useSelector(
    (state: AppState) => state[reduxNamespace].agentAssistAdmin as AgentAssistAdminState,
  );
  const [hasConversationApiError, setHasConversationApiError] = useState<ConfigError>({
    hasError: false,
    statusMessage: '',
  });
  const [hasConversationProfileValidationError, setHasConversationProfileValidationError] = useState<boolean>(false);
  const [hasCustomApiEndpointApiError, setCustomApiEndpointApiError] = useState<ConfigError>({
    hasError: false,
    statusMessage: '',
  });

  const manager = Flex.Manager.getInstance();
  const agentToken = manager.user.token;
  const agentAssistUtils = AgentAssistUtils.instance;

  useEffect(() => {}, [customApiEndpoint, conversationProfile]);

  const validateCustomApiEndpoint = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const isValid = await agentAssistUtils.getStatus(customApiEndpoint);
      if (!isValid) {
        setHasConversationApiError({
          hasError: true,
          statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError](),
        });
      }
    } catch (error) {
      setHasConversationApiError({
        hasError: true,
        statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError](),
      });
    }
  };

  const validateConversationProfileExisits = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const conversationProfileName = await agentAssistUtils.getConversationProfile(
        conversationProfile,
        customApiEndpoint,
      );
      if (!conversationProfileName) {
        setCustomApiEndpointApiError({
          hasError: true,
          statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError](),
        });
      }
    } catch (error) {
      setCustomApiEndpointApiError({
        hasError: true,
        statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError](),
      });
    }
  };

  const conversationProfileHandler = (conversationProfile: string) => {
    const isValid = AgentAssistUtils.validateConversationProfile(conversationProfile);
    if (isValid) {
      dispatch(updateAgentAssistAdminState({ conversationProfile }));
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
              value={customApiEndpoint}
              placeholder="Enter custom api endpoint"
              onChange={(e) => dispatch(updateAgentAssistAdminState({ customApiEndpoint: e.target.value }))}
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
              value={conversationProfile}
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
