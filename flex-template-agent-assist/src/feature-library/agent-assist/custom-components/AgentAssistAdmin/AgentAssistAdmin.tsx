import React, { useEffect, useState } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { AppState } from '../../../../types/manager';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Input } from '@twilio-paste/core/input';
import { Separator } from '@twilio-paste/core/separator';
import { HelpText } from '@twilio-paste/core/help-text';
import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { KnowleadgeAssist, Transcription } from '../../types/ServiceConfiguration';
import { StringTemplates as AdminUiStringTemplates} from '../../flex-hooks/strings/AgentAssistAdmin';
import { StringTemplates as AgentAssistStringTemplates } from '../../flex-hooks/strings/AgentAssist';
import { templates } from '@twilio/flex-ui';

interface OwnProps {
    feature: string;
    initialConfig: any;
    setModifiedConfig: (featureName: string, newConfig: any) => void;
    setAllowSave: (featureName: string, allowSave: boolean) => void;
}

interface Endpoint {
  url: string,
  hasError: boolean;
  statusMessage: string;
}

interface ConversationProfile {
  hasError: boolean;
  name: string;
}

interface TestConncetionButtonProps {
  endpoint: Endpoint;
  testConnectionFunction: any;
}

const TestConncetionButton = ({ endpoint, testConnectionFunction }: TestConncetionButtonProps): JSX.Element => {
  return (
    <Stack orientation="horizontal" spacing="space30">
      <Button variant='primary' onClick={(e) => testConnectionFunction()} disabled={endpoint.url === ''}>{templates[AdminUiStringTemplates.TestConnectionCTA]}</Button>
      {endpoint.statusMessage !== '' && <HelpText id="custom-api-endpoint-help-text" variant={endpoint.hasError ? "error" : "success"}>{endpoint.statusMessage}</HelpText>}
    </Stack>
  )
}

export const AgentAssistAdmin = (props: OwnProps) => {
  const [conversationProfile, setConversationProfile] = useState<ConversationProfile>({ hasError: false, name: props.initialConfig?.conversation_profile ?? '' });
  const [customApiEndpoint, setCustomApiEndpoint] = useState<Endpoint>({
    url: props.initialConfig?.custom_api_endpoint ?? '',
    hasError: false,
    statusMessage: ''
  });

  const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
  const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(props.initialConfig?.conversation_summary ?? true);
  const [isKnowleadgeAssistEnabled, setIsKnowleadgeAssistEnabled] = useState<KnowleadgeAssist>(props.initialConfig?.knowleadge_assist ?? 
    {
      enabled: true,
      version: {
        generative_knowleadge_assist: false,
        proactive_generative_knowleadge_assist: true
      }
    });
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(props.initialConfig?.enable_voice ?? false);
  const [notifierServerEndpoint, setNotiferServerEndpoint] = useState<Endpoint>({
    url: props.initialConfig?.notifier_server_endpoint ?? '',
    hasError: false,
    statusMessage: ''
  });
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState<Transcription>(props.initialConfig?.transcription ?? 
    {
      enabled: false,
      version: {
        live_transcription: true,
        intermediate_transcription: false
      }
    });

  const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);

  const agentToken = useFlexSelector((state: AppState) => state.flex.session.ssoTokenPayload.token);

    //TODO: put condition for allowing a save to go through
  const setAllowSave = () => {

  }

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      custom_api_endpoint: customApiEndpoint.url,
      conversation_profile: conversationProfile.name,
      knowleadge_assist: isKnowleadgeAssistEnabled,
      agent_coaching: isAgentCoachingEnabled,
      conversation_summary: isConversationSummaryEnabled,
      smart_reply: isSmartReplyEnabled,
      transcription: isTranscriptionEnabled,
      enable_voice: isVoiceEnabled,
      notifier_server_endpoint: notifierServerEndpoint.url,
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
    isTranscriptionEnabled,
    isVoiceEnabled, 
    notifierServerEndpoint, 
    isTranscriptionEnabled, 
    isDebugEnabled,
    isKnowleadgeAssistEnabled
  ]);

  const validateConversationProfile = (conversationProfile: string): boolean => {
    const regExp = new RegExp("(^projects\/[^\/]+\/locations\/[^\/]+)\/conversationProfiles\/[^\/]+$");
    return regExp.test(conversationProfile);
  }

  const conversationProfileHandler = (conversationProfile: string) => {
    const error = validateConversationProfile(conversationProfile);
    if(error){
      setConversationProfile({ hasError: false, name: conversationProfile })
    }
    else {
      setConversationProfile({ hasError: true, name: conversationProfile })
    }
  }

  const customApiEndpointHandler = (endpoint: string) => {
    const protocalRegExp = new RegExp("^(http|https):\/\/");
    const hasProtocal = protocalRegExp.test(endpoint);
    const url = hasProtocal ? "" : "https://" + endpoint;
    setCustomApiEndpoint({...customApiEndpoint, url});
  }

  const testCustomApiEndpoint = async () => {
    try {
      const response = await fetch(`${customApiEndpoint}/register`, {
        method: 'POST',
        headers: [['Authorization', agentToken]],
      })
      if (response.ok) {
        setCustomApiEndpoint({ ...customApiEndpoint, hasError: false, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess]})
      } else {
        setCustomApiEndpoint({ ...customApiEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]})
      }
    }
    catch(error){
      setCustomApiEndpoint({ ...customApiEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]})
    }
  }

  //Todo: make this connect to the websocket
  const testNotifierServerEndpoint = async () => {
    try {
      const response = await fetch(`${customApiEndpoint}/register`, {
        method: 'POST',
        headers: [['Authorization', agentToken]],
      })
      if (response.ok) {
      } else {
      }
    }
    catch (error) {
    }
  }

  const knowleadgeAssistVersionHandler = (version: string) => {
    switch(version) {
      case templates[AgentAssistStringTemplates.GenerativeKnowleadgeAssist]: 
        setIsKnowleadgeAssistEnabled(
          {
            ...isKnowleadgeAssistEnabled, 
            version: {
              generative_knowleadge_assist: true,
              proactive_generative_knowleadge_assist: false
            }
          })
        break;
      case templates[AgentAssistStringTemplates.ProactiveGenerativeKnowleadgeAssist]:
      default:
        setIsKnowleadgeAssistEnabled(
          {
            ...isKnowleadgeAssistEnabled, 
            version: {
              generative_knowleadge_assist: false,
              proactive_generative_knowleadge_assist: true
            }
          })
        break;
    }
  }

  return(
    <>
      <FormSection>
        <FormSectionHeading>
          General Settings
        </FormSectionHeading>
        <FormControl key={'conversation-profile-control'}>
          <Label htmlFor={'conversation-profile'}>{templates[AgentAssistStringTemplates.ConversationProfile]}</Label>
          <Input
            id={'conversation-profile'}
            name={'conversation-profile'}
            type="text"
            value={conversationProfile.name}
            hasError={conversationProfile.hasError}
            onChange={(e) => conversationProfileHandler(e.target.value)}
            required
          />
          {conversationProfile.hasError && <HelpText variant="error" id={'conversation-profile-error'}>
            {templates[AdminUiStringTemplates.ConversationProfileErrorText]}
          </HelpText>}
        </FormControl>
      </FormSection>
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>
          Agent Assist Features
        </FormSectionHeading>
        <FormControl key={'custom-api-endpoint-control'}>
          <Stack orientation="vertical" spacing="space60">
            <>
              <Label htmlFor={'custom-api-endpoint'}>{templates[AgentAssistStringTemplates.CustomApiEndpoint]}</Label>
              <Input
                id={'custom-api-endpoint'}
                name={'custom-api-endpoint'}
                type="text"
                value={customApiEndpoint.url}
                onChange={(e) => customApiEndpointHandler(e.target.value)}
                required
              />
            </>
            <TestConncetionButton endpoint={customApiEndpoint} testConnectionFunction={testCustomApiEndpoint}/>
          </Stack>
        </FormControl>
        <FormControl key={'agent-assist-feature-control'}>
          <SwitchGroup
            name='agent-assist-features'
            legend={<></>}
            disabled={conversationProfile.hasError || conversationProfile.name === ''}
          >
            <Switch
              checked={isAgentCoachingEnabled}
              onChange={(e) => setIsAgentCoachingEnabled(e.target.checked)}
              helpText={templates[AdminUiStringTemplates.AgentCoachingHelperText]}
            >
              {templates[AgentAssistStringTemplates.AgentCoaching]}
            </Switch>
            <Switch
              checked={isConversationSummaryEnabled}
              onChange={(e) => setIsConversationSummaryEnabled(e.target.checked)}
              helpText={templates[AdminUiStringTemplates.ConversationSummarizationHelperText]}
            >
              {templates[AgentAssistStringTemplates.ConversationSummarization]}
            </Switch>
            <Switch
              checked={isKnowleadgeAssistEnabled.enabled}
              onChange={(e) => setIsKnowleadgeAssistEnabled({...isKnowleadgeAssistEnabled, enabled: e.target.checked})}
              helpText={
              <FormControl key={'knowleadge-assist-version'}>
                <RadioGroup
                  legend={<></>}
                  name="knowleadge-assist-version"
                  disabled={!isKnowleadgeAssistEnabled.enabled && (conversationProfile.hasError || conversationProfile.name === '')}
                  onChange={(e) =>  knowleadgeAssistVersionHandler(e)}
                >
                  <Radio
                    value={templates[AgentAssistStringTemplates.GenerativeKnowleadgeAssist]}
                      helpText={templates[AdminUiStringTemplates.GenerativeKnowleadgeAssistHelperText]}
                    defaultChecked
                  >
                      {templates[AgentAssistStringTemplates.GenerativeKnowleadgeAssist]}
                  </Radio>
                  <Radio
                      value={templates[AgentAssistStringTemplates.ProactiveGenerativeKnowleadgeAssist]}
                      helpText={templates[AdminUiStringTemplates.GenerativeKnowleadgeAssistHelperText]}
                    defaultChecked
                  >
                      {templates[AgentAssistStringTemplates.ProactiveGenerativeKnowleadgeAssist]}
                  </Radio>
                </RadioGroup>
              </FormControl>}
            >
              {templates[AgentAssistStringTemplates.KnowleadgeAssist]}
            </Switch>
            <Switch
              checked={isSmartReplyEnabled}
              onChange={(e) => setIsSmartReplyEnabled(e.target.checked)}
              helpText={templates[AdminUiStringTemplates.SmartReplyHelperText]}
            >
              {templates[AgentAssistStringTemplates.SmartReply]}
            </Switch>
          </SwitchGroup>
        </FormControl>
      </FormSection>
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>
          Voice Settings
        </FormSectionHeading>
        <FormControl key={'voice-control'}>
          <Switch
            checked={isVoiceEnabled}
            onChange={(e) => setIsVoiceEnabled(e.target.checked)}
          >
            Enable Voice
          </Switch>
        </FormControl>
        <FormControl key={'notifier-server-endpoint-control'}>
          <Stack orientation="vertical" spacing="space60">
            <>
              <Label htmlFor={'notifier-server-endpoint'}>{templates[AgentAssistStringTemplates.NotiferServerEnpoint]}</Label>
              <Input
                id={'notifier-server-endpoint'}
                name={'notifier-server-endpoint'}
                type="text"
                value={notifierServerEndpoint.url}
                onChange={(e) => setNotiferServerEndpoint({...notifierServerEndpoint, url: e.target.value})}
                disabled={!isVoiceEnabled}
                required={isVoiceEnabled}
              />
            </>
            <TestConncetionButton endpoint={notifierServerEndpoint} testConnectionFunction={testNotifierServerEndpoint} />
          </Stack>
        </FormControl>
        <FormControl key={'transcription-control'}>
          <Switch
            checked={isTranscriptionEnabled.enabled}
            onChange={(e) => setIsTranscriptionEnabled({ ...isTranscriptionEnabled, enabled: e.target.checked })}
            disabled={!isVoiceEnabled}
            helpText={
              <FormControl key={'voice-features'}>
                <RadioGroup
                  legend={<></>}
                  name="transcription-version"
                  disabled={!isTranscriptionEnabled.enabled && !isVoiceEnabled}
                >
                  <Radio
                    value={templates[AgentAssistStringTemplates.LiveTranscription]}
                    helpText={templates[AdminUiStringTemplates.LiveTranscriptionHelperText]}
                    defaultChecked
                  >
                    {templates[AgentAssistStringTemplates.LiveTranscription]}
                  </Radio>
                  <Radio
                    value={templates[AgentAssistStringTemplates.IntermediateTranscription]}
                    helpText={templates[AdminUiStringTemplates.IntermediateTranscriptionHelperText]}
                  >
                    {templates[AgentAssistStringTemplates.IntermediateTranscription]}
                  </Radio>
                </RadioGroup>
              </FormControl>
            }
          >
            {templates[AgentAssistStringTemplates.Transcription]}
          </Switch>
        </FormControl>
      </FormSection>
    </>
  )
}