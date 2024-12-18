import { FormSection, FormSectionHeading, FormControl, Switch, Stack, Label, Input } from "@twilio-paste/core";
import { templates, useFlexSelector } from "@twilio/flex-ui";
import { AppState } from '../../../../../types/manager';
import { SwitchWithOptions } from "./SwitchWithOptions";
import { ValidationButton } from "./ValidationButton";
import { StringTemplates as AdminUiStringTemplates} from '../../../flex-hooks/strings/AgentAssistAdmin';
import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { Transcription } from '../../../types/ServiceConfiguration';
import { useEffect, useState } from "react";
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';

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

export const AgentAssistAdminVoiceSettings = (props: OwnProps) => {
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
    ];
    
    const setAllowSave = () => {
        props.setAllowSave(props.feature, true);
    }

    useEffect(() => {
        setAllowSave();
        props.setModifiedConfig(props.feature, {
          ...props.initialConfig,
          transcription: isTranscriptionEnabled,
          enable_voice: isVoiceEnabled,
          notifier_server_endpoint: notifierServerEndpoint.configItem,
          },
        );
      }, 
      [
        isTranscriptionEnabled,
        isVoiceEnabled, 
        notifierServerEndpoint, 
      ]);
    
    const validateNotifierServerEndpoint = async () => {
        const onSuccess = () => setNotiferServerEndpoint({ ...notifierServerEndpoint, hasError: false, statusMessage: templates[AdminUiStringTemplates.ConnectingToCustomApiEndpointSuccess]()});
        const onError = () => setNotiferServerEndpoint({ ...notifierServerEndpoint, hasError: true, statusMessage: templates[AdminUiStringTemplates.ConnectingToNotifierServerEndpointError]()});
        
        try {
            await agentAssistUtils.getAgentAssistAuthToken(agentToken);
            agentAssistUtils.getWebsocketStatus(notifierServerEndpoint.configItem, onSuccess, onError);
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

    return (
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
    )
}