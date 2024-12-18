import React, { useEffect, useState } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { AppState } from '../../../../types/manager';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Input } from '@twilio-paste/core/input';
import { Separator } from '@twilio-paste/core/separator';
import { HelpText } from '@twilio-paste/core/help-text';
import { Stack } from '@twilio-paste/core/stack';
import { Transcription } from '../../types/ServiceConfiguration';
import { StringTemplates as AdminUiStringTemplates} from '../../flex-hooks/strings/AgentAssistAdmin';
import { StringTemplates as AgentAssistStringTemplates } from '../../flex-hooks/strings/AgentAssist';
import { templates } from '@twilio/flex-ui';
import { ValidationButton, SwitchWithOptions } from './AgentAssistAdminComponents';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import { AgentAssistAdminVoiceSettings } from './AgentAssistAdminComponents/AgentAssistAdminVoiceSettings';

interface OwnProps {
    feature: string;
    initialConfig: any;
    setModifiedConfig: (featureName: string, newConfig: any) => void;
    setAllowSave: (featureName: string, allowSave: boolean) => void;
}

interface ConfigItem {
  configItem: string,
  hasError: boolean;
  statusMessage: string;
}


export const AgentAssistAdmin = (props: OwnProps) => {
  const [conversationProfile, setConversationProfile] = useState<ConfigItem>({ configItem: props.initialConfig?.conversation_profile ?? '', hasError: false, statusMessage: '' });
  const [customApiEndpoint, setCustomApiEndpoint] = useState<ConfigItem>({
    configItem: props.initialConfig?.custom_api_endpoint ?? '',
    hasError: false,
    statusMessage: ''
  });

  const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
  const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(props.initialConfig?.conversation_summary ?? true);
  const [isKnowledgeAssistEnabled, setIsKnowledgeAssistEnabled] = useState(props.initialConfig?.knowledge_assist ?? true);
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

  const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);

  const agentToken = useFlexSelector((state: AppState) => state.flex.session.ssoTokenPayload.token);
  const agentAssistUtils = AgentAssistUtils.instance

  const agentAssistFeatures = [
    {
      checked: isAgentCoachingEnabled,
      onChange: () => setIsAgentCoachingEnabled(!isAgentCoachingEnabled),
      helpText: templates[AdminUiStringTemplates.AgentCoachingHelperText](),
      label: templates[AgentAssistStringTemplates.AgentCoaching]()
    },
    {
      checked: isConversationSummaryEnabled,
      onChange: () => setIsConversationSummaryEnabled(!isConversationSummaryEnabled),
      helpText: templates[AdminUiStringTemplates.ConversationSummarizationHelperText](),
      label: templates[AgentAssistStringTemplates.ConversationSummarization]()
    },
    {
      checked: isSmartReplyEnabled,
      onChange: () => setIsSmartReplyEnabled(!isSmartReplyEnabled),
      helpText: templates[AdminUiStringTemplates.SmartReplyHelperText](),
      label: templates[AgentAssistStringTemplates.SmartReply]()
    },
    {
      checked: isKnowledgeAssistEnabled,
      onChange: () => setIsKnowledgeAssistEnabled(!isKnowledgeAssistEnabled),
      helpText: templates[AdminUiStringTemplates.KnowledgeAssistHelperText](),
      label: templates[AgentAssistStringTemplates.KnowledgeAssist]()
    }
  ]

  const setAllowSave = () => {
    props.setAllowSave(props.feature, true);
  }

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      custom_api_endpoint: customApiEndpoint.configItem,
      conversation_profile: conversationProfile.configItem,
      knowledge_assist: isKnowledgeAssistEnabled,
      agent_coaching: isAgentCoachingEnabled,
      conversation_summary: isConversationSummaryEnabled,
      smart_reply: isSmartReplyEnabled,
      debug: isDebugEnabled
      },
    );
  }, 
  [
    customApiEndpoint, 
    conversationProfile, 
    isAgentCoachingEnabled, 
    isConversationSummaryEnabled,
    isSmartReplyEnabled,
    isDebugEnabled,
    isKnowledgeAssistEnabled
  ]);

  const validateConversationProfileExisits = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const conversationProfileName = await agentAssistUtils.getConversationProfile(conversationProfile.configItem, customApiEndpoint.configItem);
      if (conversationProfileName) {
        setConversationProfile({ ...conversationProfile, hasError: false, statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileSuccess]() })
      } else {
        setConversationProfile({ ...conversationProfile, hasError: true, statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError]() })
      }
    }
    catch (error) {
      setConversationProfile({ ...conversationProfile, hasError: true, statusMessage: templates[AdminUiStringTemplates.ValidateConversationProfileError]() })
    }
  }

  const conversationProfileHandler = (conversationProfile: string) => {
    const error = AgentAssistUtils.validateConversationProfile(conversationProfile);
    if(error){
      setConversationProfile({ hasError: false, configItem: conversationProfile, statusMessage: "" })
    }
    else {
      setConversationProfile({ hasError: true, configItem: conversationProfile, statusMessage: "" })
    }
  }

  const validateCustomApiEndpoint = async () => {
    try {
      await agentAssistUtils.getAgentAssistAuthToken(agentToken);
      const isValid = await agentAssistUtils.getStatus(customApiEndpoint.configItem)
      if (isValid) {
        setCustomApiEndpoint({ ...customApiEndpoint, hasError: false, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess]()})
      } else {
        setCustomApiEndpoint({ ...customApiEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]() })
      }
    }
    catch(error){
      setCustomApiEndpoint({ ...customApiEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]() })
    }
  }

  return(
    <>
      <FormSection>
        <FormSectionHeading>
          General Settings
        </FormSectionHeading>
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
            <ValidationButton configItem={customApiEndpoint} testConnectionFunction={validateCustomApiEndpoint} label={templates[AdminUiStringTemplates.TestConnectionCTA]()} />
          </Stack>
        </FormControl>
        <FormControl key={'conversation-profile-control'}>
          <Stack orientation="vertical" spacing="space60">
            <>
              <Label htmlFor={'conversation-profile'}>{templates[AgentAssistStringTemplates.ConversationProfile]()}</Label>
              <Input
                id={'conversation-profile'}
                name={'conversation-profile'}
                type="text"
                value={conversationProfile.configItem}
                hasError={conversationProfile.hasError}
                onChange={(e) => conversationProfileHandler(e.target.value)}
                required
              />
              {conversationProfile.hasError && <HelpText variant="error" id={'conversation-profile-error'}>
                {templates[AdminUiStringTemplates.ConversationProfileErrorText]()}
              </HelpText>}
            </>
            <ValidationButton configItem={conversationProfile} testConnectionFunction={validateConversationProfileExisits} label={templates[AdminUiStringTemplates.TestConversationProfileCTA]()}/>
          </Stack>
        </FormControl>
      </FormSection>
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>
          Agent Assist Features
        </FormSectionHeading>
        <FormControl key={'agent-assist-feature-control'}>
          <SwitchGroup
            name='agent-assist-features'
            legend={<></>}
            disabled={conversationProfile.hasError || conversationProfile.configItem === ''}
          >
            {
              agentAssistFeatures.map(feature => {
                const {label, ...props} = feature;
                return (<Switch {...props}>{label}</Switch>)
              })
            }
          </SwitchGroup>
        </FormControl>
      </FormSection>
      <Separator orientation="horizontal" />
            <AgentAssistAdminVoiceSettings {...props}/>
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>
          Troubleshooting
        </FormSectionHeading>
        <FormControl key={'debug-control'}>
            <Switch checked={isDebugEnabled} onChange={() => setIsDebugEnabled(!isDebugEnabled)}>{templates[AgentAssistStringTemplates.Debug]()}</Switch>
        </FormControl>
      </FormSection>
    </>
  )
}