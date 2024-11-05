import { useEffect, useState } from 'react';
import { FormControl } from '@twilio-paste/core/form';
import { Label } from '@twilio-paste/core/label';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Input } from '@twilio-paste/core/input';
import { Text } from '@twilio-paste/core/text';

interface OwnProps {
    feature: string;
    initialConfig: any;
    setModifiedConfig: (featureName: string, newConfig: any) => void;
    setAllowSave: (featureName: string, allowSave: boolean) => void;
}

export const AgentAssistAdmin = (props: OwnProps) => {
    const [conversationProfile, setConversationProfile] = useState(props.initialConfig?.conversation_profile ?? '');
    const [customApiEndpoint, setCustomApiEndpoint] = useState(props.initialConfig?.scustom_api_endpoint ?? '');

    const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
    const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(props.initialConfig?.conversation_summary ?? true);
    const [isProactiveGenerativeKnowleadgeAssistEnabled, setIsProactiveGenerativeKnowleadgeAssistEnabled] = useState(props.initialConfig?.proactive_generative_knowleadge_assist ?? true);
    const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

    const [isVoiceEnabled, setIsVoiceEnabled] = useState(props.initialConfig?.enable_voice ?? false);
    const [notifierServerEndpoint, setNotiferServerEndpoint] = useState(props.initialConfig?.notifier_server_endpoint ?? '');
    const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(props.initialConfig?.transcription ?? false);
    const [isIntermediateTranscriptionEnabled, setIsIntermediateTranscriptionEnabled] = useState(props.initialConfig?.intermediate_transcription ?? false);

    const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);

    //TODO: put condition for allowing a save to go through
  const setAllowSave = () => {

    }

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      custom_api_endpoint: customApiEndpoint,
      conversation_profile: conversationProfile,
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

  return(
    <>
      <FormControl key={'conversation-profile-control'}>
        <Label htmlFor={'conversation-profile'}>Conversation Profile</Label>
        <Input
          id={'conversation-profile'}
          name={'conversation-profile'}
          type="text"
          value={conversationProfile}
          onChange={(e) => setConversationProfile(e.target.value)}
        />
      </FormControl>
      <FormControl key={'custom-api-endpoint-control'}>
        <Label htmlFor={'custom-api-endpoint'}>Custom API Endpoint</Label>
        <Input
          id={'custom-api-endpoint'}
          name={'custom-api-endpoint'}
          type="text"
          value={customApiEndpoint}
          onChange={(e) => setCustomApiEndpoint(e.target.value)}
        />
      </FormControl>
      <FormControl key={'agent-coaching-control'}>
        <Switch
          checked={isAgentCoachingEnabled}
          onChange={(e) => setIsAgentCoachingEnabled(e.target.checked)}
        >
          Agent Coaching
        </Switch>
      </FormControl>
      <FormControl key={'conversation-summary-control'}>
        <Switch
          checked={isConversationSummaryEnabled}
          onChange={(e) => setIsConversationSummaryEnabled(e.target.checked)}
        >
          Conversation Summarization
        </Switch>
      </FormControl>
      <FormControl key={'proactive-generative-knowleadge-assist-control'}>
        <Switch
          checked={isProactiveGenerativeKnowleadgeAssistEnabled}
          onChange={(e) => setIsProactiveGenerativeKnowleadgeAssistEnabled(e.target.checked)}
        >
          Proactive Generative Knowleadge Assist
        </Switch>
      </FormControl>
      <FormControl key={'smart-reply-control'}>
        <Switch
          checked={isSmartReplyEnabled}
          onChange={(e) => setIsSmartReplyEnabled(e.target.checked)}
        >
          Smart Reply
        </Switch>
      </FormControl>
      <FormControl key={'voice-control'}>
        <Switch
          checked={isVoiceEnabled}
          onChange={(e) => setIsVoiceEnabled(e.target.checked)}
        >
          Voice
        </Switch>
      </FormControl>
      <FormControl key={'notifier-server-endpoint-control'}>
        <Label htmlFor={'notifier-server-endpoint'}>Notifier Server Endpoint</Label>
        <Input
          id={'notifier-server-endpoint'}
          name={'notifier-server-endpoint'}
          type="text"
          value={notifierServerEndpoint}
          onChange={(e) => setNotiferServerEndpoint(e.target.value)}
          disabled={isVoiceEnabled}
        />
      </FormControl>
      <FormControl key={'voice-features'}> 
        <SwitchGroup 
          name='voice-features'
          legend={
            <Text as="span" color="currentColor">
              Adjust your voice feature settings
            </Text>
          }
          disabled={isVoiceEnabled}
          >
          <Switch
            checked={isTranscriptionEnabled}
            onChange={(e) => setIsTranscriptionEnabled(e.target.checked)}
          >
            Transcription
          </Switch>
          <Switch
            checked={isIntermediateTranscriptionEnabled}
            onChange={(e) => setIsIntermediateTranscriptionEnabled(e.target.checked)}
          >
            Intermediate Transcription
          </Switch>
        </SwitchGroup>
      </FormControl>
    </>
  )
}

