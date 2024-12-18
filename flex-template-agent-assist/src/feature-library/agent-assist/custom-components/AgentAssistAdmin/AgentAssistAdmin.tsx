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
import { io } from "socket.io-client";
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';

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

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(props.initialConfig?.enable_voice ?? false);
  const [notifierServerEndpoint, setNotiferServerEndpoint] = useState<ConfigItem>({
    configItem: props.initialConfig?.notifier_server_endpoint ?? '',
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
  const agentAssistUtils = AgentAssistUtils.instance

  const transcriptionOptions = [
    {
      value: templates[AgentAssistStringTemplates.LiveTranscription](),
      helpText: templates[AdminUiStringTemplates.LiveTranscriptionHelperText](),
      label: templates[AgentAssistStringTemplates.LiveTranscription](),
      defaultChecked: true
    },
    {
      value: templates[AgentAssistStringTemplates.IntermediateTranscription](),
      helpText: templates[AdminUiStringTemplates.IntermediateTranscriptionHelperText](),
      label: templates[AgentAssistStringTemplates.IntermediateTranscription](),
    }
  ]

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
      transcription: isTranscriptionEnabled,
      enable_voice: isVoiceEnabled,
      notifier_server_endpoint: notifierServerEndpoint.configItem,
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
    isKnowledgeAssistEnabled
  ]);

  const validateConversationProfile = (conversationProfile: string): boolean => {
    const regExp = new RegExp("(^projects\/[^\/]+\/locations\/[^\/]+)\/conversationProfiles\/[^\/]+$");
    return regExp.test(conversationProfile);
  }

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
    const error = validateConversationProfile(conversationProfile);
    if(error){
      setConversationProfile({ hasError: false, configItem: conversationProfile, statusMessage: "" })
    }
    else {
      setConversationProfile({ hasError: true, configItem: conversationProfile, statusMessage: "" })
    }
  }

  const validateCustomeApiEndpoint = async () => {
    // try {
    //   const protocalRegExp = new RegExp("^(http|https):\/\/");
    //   const hasProtocal = protocalRegExp.test(customApiEndpoint.configItem);
    //   const url = `${hasProtocal ? "" : "https://"}${customApiEndpoint.configItem}`;

    //   const response = await fetch(`${url}/register`, {
    //     method: 'POST',
    //     headers: [['Authorization', agentToken]],
    //   })

    //   if (response.ok) {
    //     setCustomApiEndpoint({ configItem: url, hasError: false, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess]()})
    //   } else {
    //     setCustomApiEndpoint({ configItem: url, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]() })
    //   }
    // }
    // catch(error){
    //   setCustomApiEndpoint({ ...customApiEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointError]() })
    // }
  }

  //Todo: make this connect to the websocket
  const validateNotifierServerEndpoint = async () => {
    try {
      const protocalRegExp = new RegExp("^(http|https):\/\/");
      const hasProtocal = protocalRegExp.test(customApiEndpoint.configItem);
      const url = `${hasProtocal ? "" : "https://"}${customApiEndpoint.configItem}`;
      
      const response = await fetch(`${url}/register`, {
        method: 'POST',
        headers: [['Authorization', agentToken]],
      })
      const data = await response.json();
      const token = data.token;

      try {
        const websocketRegExp = new RegExp("^(http|https):\/\/");
        const hasWebsocketProtocal = websocketRegExp.test(notifierServerEndpoint.configItem);
        const wsUrl = `${hasWebsocketProtocal ? "" : "https://"}${notifierServerEndpoint.configItem}`;
        const socket = io(wsUrl, {
          auth: {
            token
          },
        });

        socket.on("connect_error", (err) => {
          console.log(`connect_error due to ${err.message}`);
          setNotiferServerEndpoint({ configItem: wsUrl, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToNotifierServerEndpointError]()})
          socket.close()
        });

        socket.on('connect', () => {
          console.log("Websocket Success")
          setNotiferServerEndpoint({ configItem: wsUrl, hasError: false, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess]()})
          socket.close()
        });

        socket.on('unauthenticated', () => {
          console.log("Websocket unauthenticated")
          setNotiferServerEndpoint({ configItem: wsUrl, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToNotifierServerEndpointError]()})
          socket.close()
        });
      }
      catch(error){
        console.log("Network Error")
        setNotiferServerEndpoint({ ...notifierServerEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToNotifierServerEndpointError]()})
      }
    }
    catch (error) {
    }
  }

  const transcriptionVersionHandler = (version: string) => {
    switch (version) {
      case templates[AgentAssistStringTemplates.LiveTranscription]():
        setIsTranscriptionEnabled(
          {
            ...isTranscriptionEnabled,
            version: {
              live_transcription: true,
              intermediate_transcription: false
            }
          })
        break;
      case templates[AgentAssistStringTemplates.IntermediateTranscription]():
      default:
        setIsTranscriptionEnabled(
          {
            ...isTranscriptionEnabled,
            version: {
              live_transcription: false,
              intermediate_transcription: true
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
            <ValidationButton configItem={customApiEndpoint} testConnectionFunction={validateCustomeApiEndpoint} label={templates[AdminUiStringTemplates.TestConnectionCTA]()} />
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
              <Label htmlFor={'notifier-server-endpoint'}>{templates[AgentAssistStringTemplates.NotiferServerEnpoint]()}</Label>
              <Input
                id={'notifier-server-endpoint'}
                name={'notifier-server-endpoint'}
                type="text"
                value={notifierServerEndpoint.configItem}
                onChange={(e) => setNotiferServerEndpoint({...notifierServerEndpoint, configItem: e.target.value})}
                disabled={!isVoiceEnabled}
                required={isVoiceEnabled}
              />
            </>
            <ValidationButton configItem={notifierServerEndpoint} testConnectionFunction={validateNotifierServerEndpoint} label={templates[AdminUiStringTemplates.TestConnectionCTA]()} />
          </Stack>
        </FormControl>
        <FormControl key={'transcription-control'}>
          <SwitchWithOptions
            feature={isTranscriptionEnabled}
            featureChangeHandler={(e: any) => setIsTranscriptionEnabled({ ...isTranscriptionEnabled, enabled: !isTranscriptionEnabled.enabled})}
            featureOptions={transcriptionOptions}
            featureDisabled={!isVoiceEnabled}
            featureLabel={templates[AgentAssistStringTemplates.Transcription]()}
            optionsChangeHandler={transcriptionVersionHandler}
            optionsDisabled={!(isTranscriptionEnabled.enabled && isVoiceEnabled)}
          />
        </FormControl>
      </FormSection>
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