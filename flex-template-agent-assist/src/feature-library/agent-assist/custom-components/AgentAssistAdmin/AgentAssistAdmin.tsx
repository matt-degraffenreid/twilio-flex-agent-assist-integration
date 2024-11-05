import { useEffect, useState } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { AppState } from '../../../../types/manager';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Input } from '@twilio-paste/core/input';
import { Text } from '@twilio-paste/core/text';
import { Separator } from '@twilio-paste/core/separator';
import { HelpText } from '@twilio-paste/core/help-text';
import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';

interface OwnProps {
    feature: string;
    initialConfig: any;
    setModifiedConfig: (featureName: string, newConfig: any) => void;
    setAllowSave: (featureName: string, allowSave: boolean) => void;
}

interface EndpointConnectionStatus {
  hasError: boolean;
  statusMessage: string;
}

interface ConversationProfile {
  hasError: boolean;
  name: string;
}

export const AgentAssistAdmin = (props: OwnProps) => {
  const [conversationProfile, setConversationProfile] = useState<ConversationProfile>({ hasError: false, name: props.initialConfig?.conversation_profile ?? '' });
  const [customApiEndpoint, setCustomApiEndpoint] = useState(props.initialConfig?.scustom_api_endpoint ?? '');
  const [customApiEndpointConnectionStatus, setCustomApiEndpointConnectionStatus] = useState<EndpointConnectionStatus>({
    hasError: false,
    statusMessage: ''
  });

  const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
  const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(props.initialConfig?.conversation_summary ?? true);
  const [isProactiveGenerativeKnowleadgeAssistEnabled, setIsProactiveGenerativeKnowleadgeAssistEnabled] = useState(props.initialConfig?.proactive_generative_knowleadge_assist ?? true);
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(props.initialConfig?.enable_voice ?? false);
  const [notifierServerEndpoint, setNotiferServerEndpoint] = useState(props.initialConfig?.notifier_server_endpoint ?? '');
  const [notifierServerEndpointStatus, setNotifierServerEndpointStatus] = useState<EndpointConnectionStatus>({
    hasError: false,
    statusMessage: ''
  });
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(props.initialConfig?.transcription ?? false);
  const [isIntermediateTranscriptionEnabled, setIsIntermediateTranscriptionEnabled] = useState(props.initialConfig?.intermediate_transcription ?? false);

  const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);

  const agentToken = useFlexSelector((state: AppState) => state.flex.session.ssoTokenPayload.token);

    //TODO: put condition for allowing a save to go through
  const setAllowSave = () => {

  }

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      custom_api_endpoint: customApiEndpoint,
      conversation_profile: conversationProfile.name,
      agent_coaching: isAgentCoachingEnabled,
      conversation_summary: isConversationSummaryEnabled,
      smart_reply: isSmartReplyEnabled,
      proactive_generative_knowleadge_assist: isProactiveGenerativeKnowleadgeAssistEnabled,
      enable_voice: isVoiceEnabled,
      notifier_server_endpoint: notifierServerEndpoint,
      transcription: isTranscriptionEnabled,
      intermediate_transcription: isIntermediateTranscriptionEnabled,
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
    isProactiveGenerativeKnowleadgeAssistEnabled, 
    isVoiceEnabled, 
    notifierServerEndpoint, 
    isTranscriptionEnabled, 
    isIntermediateTranscriptionEnabled, 
    isDebugEnabled 
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

  const testCustomApiEndpoint = async () => {
    try {
      const response = await fetch(`${customApiEndpoint}/register`, {
        method: 'POST',
        headers: [['Authorization', agentToken]],
      })
      if (response.ok) {
        setCustomApiEndpointConnectionStatus({ hasError: false, statusMessage: "Connecting to the custom api endpoint successful" })
      } else {
        setCustomApiEndpointConnectionStatus({ hasError: true, statusMessage: "Error connecting to the custom api endpoint" })
      }
    }
    catch(error){
      setCustomApiEndpointConnectionStatus({ hasError: true, statusMessage: "Error connecting to the custom api endpoint" })
    }
  }

  const testNotifierServerEndpointEndpoint = async () => {
    try {
      const response = await fetch(`${customApiEndpoint}/register`, {
        method: 'POST',
        headers: [['Authorization', agentToken]],
      })
      if (response.ok) {
        setCustomApiEndpointConnectionStatus({ hasError: false, statusMessage: "Connecting to the custom api endpoint successful" })
      } else {
        setCustomApiEndpointConnectionStatus({ hasError: true, statusMessage: "Error connecting to the custom api endpoint" })
      }
    }
    catch (error) {
      setCustomApiEndpointConnectionStatus({ hasError: true, statusMessage: "Error connecting to the custom api endpoint" })
    }
  }

  return(
    <>
      <FormSection>
        <FormSectionHeading>
          General Settings
        </FormSectionHeading>
        <FormControl key={'conversation-profile-control'}>
          <Label htmlFor={'conversation-profile'}>Conversation Profile</Label>
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
            Enter a conversation profile with the format projects/PROJECT_ID/locations/global/conversationProfiles/PROFILE_ID
          </HelpText>}
        </FormControl>
        <FormControl key={'custom-api-endpoint-control'}>
          <Stack orientation="vertical" spacing="space60">
            <>
              <Label htmlFor={'custom-api-endpoint'}>Custom API Endpoint</Label>
              <Input
                id={'custom-api-endpoint'}
                name={'custom-api-endpoint'}
                type="text"
                value={customApiEndpoint}
                onChange={(e) => setCustomApiEndpoint(e.target.value)}
                required
              />
            </>
            <Stack orientation="horizontal" spacing="space30">
              <Button variant='primary' onClick={(e) => testCustomApiEndpoint()} disabled={customApiEndpoint === ''}>Test Connection</Button>
              {customApiEndpointConnectionStatus.statusMessage !== '' && <HelpText id="custom-api-endpoint-help-text" variant={customApiEndpointConnectionStatus.hasError ? "error" : "success"}>{customApiEndpointConnectionStatus.statusMessage}</HelpText>}
            </Stack>
          </Stack>
        </FormControl>
        <FormControl key={'agent-assist-feature-control'}>
          <SwitchGroup
            name='agent-assist-features'
            legend={
              <Text as="span" color="currentColor">
                Enable agent assist features
              </Text>
            }
            disabled={conversationProfile.hasError || conversationProfile.name === ''}
          >
            <Switch
              checked={isAgentCoachingEnabled}
              onChange={(e) => setIsAgentCoachingEnabled(e.target.checked)}
            >
              Agent Coaching
            </Switch>
            <Switch
              checked={isConversationSummaryEnabled}
              onChange={(e) => setIsConversationSummaryEnabled(e.target.checked)}
            >
              Conversation Summarization
            </Switch>
            <Switch
              checked={isProactiveGenerativeKnowleadgeAssistEnabled}
              onChange={(e) => setIsProactiveGenerativeKnowleadgeAssistEnabled(e.target.checked)}
            >
              Proactive Generative Knowleadge Assist
            </Switch>
            <Switch
              checked={isSmartReplyEnabled}
              onChange={(e) => setIsSmartReplyEnabled(e.target.checked)}
            >
              Smart Reply
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
              <Label htmlFor={'notifier-server-endpoint'}>Notifier Server Endpoint</Label>
              <Input
                id={'notifier-server-endpoint'}
                name={'notifier-server-endpoint'}
                type="text"
                value={notifierServerEndpoint}
                onChange={(e) => setNotiferServerEndpoint(e.target.value)}
                disabled={!isVoiceEnabled}
                required={isVoiceEnabled}
              />
            </>
            <Stack orientation="horizontal" spacing="space30">
              <Button variant='primary' onClick={(e) => testCustomApiEndpoint()} disabled={notifierServerEndpoint === ''}>Test Connection</Button>
              {notifierServerEndpointStatus.statusMessage !== '' && <HelpText id="custom-api-endpoint-help-text" variant={notifierServerEndpointStatus.hasError ? "error" : "success"}>{notifierServerEndpointStatus.statusMessage}</HelpText>}
            </Stack>
          </Stack>
        </FormControl>
        <FormControl key={''}>
          <Switch
            checked={isTranscriptionEnabled}
            onChange={(e) => setIsTranscriptionEnabled(e.target.checked)}
            disabled={!isVoiceEnabled}
          >
            Enable Transcription
          </Switch>
        </FormControl>
        <FormControl key={'voice-features'}>
          <RadioGroup
            legend="Transcription Version"
            name="transcription-version"
            disabled={!isTranscriptionEnabled}
          >
            <Radio
              value="Live Transcription"
              helpText="Support transcription after a user is done speaking."
            >
              Live Transcription
            </Radio>
            <Radio
              value="Intermediate Transcription"
              helpText="Supports transcription as a user is speaking."
            >
              Intermediate Transcription
            </Radio>
          </RadioGroup>
        </FormControl>
      </FormSection>
    </>
  )
}

