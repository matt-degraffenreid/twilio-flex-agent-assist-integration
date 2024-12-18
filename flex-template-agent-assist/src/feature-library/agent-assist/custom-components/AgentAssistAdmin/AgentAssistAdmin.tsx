import React, { useEffect, useState } from 'react';
import { useFlexSelector } from '@twilio/flex-ui';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { Separator } from '@twilio-paste/core/separator';
import { templates } from '@twilio/flex-ui';
import { StringTemplates as AdminUiStringTemplates } from '../../flex-hooks/strings/AgentAssistAdmin';
import { StringTemplates as AgentAssistStringTemplates } from '../../flex-hooks/strings/AgentAssist';
import { AppState } from '../../../../types/manager';
import AgentAssistUtils from '../../utils/agentAssist/AgentAssistUtils';
import { AgentAssistAdminVoiceSettings } from './AgentAssistAdminComponents/AgentAssistAdminVoiceSettings';
import { AgentAssistAdminGeneralSettings } from './AgentAssistAdminComponents/AgentAssistAdminGeneralSettings';

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

export const AgentAssistAdmin = (props: OwnProps) => {
  const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
  const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(
    props.initialConfig?.conversation_summary ?? true,
  );
  const [isKnowledgeAssistEnabled, setIsKnowledgeAssistEnabled] = useState(
    props.initialConfig?.knowledge_assist ?? true,
  );
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

  const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);

  const agentAssistFeatures = [
    {
      checked: isAgentCoachingEnabled,
      onChange: () => setIsAgentCoachingEnabled(!isAgentCoachingEnabled),
      helpText: templates[AdminUiStringTemplates.AgentCoachingHelperText](),
      label: templates[AgentAssistStringTemplates.AgentCoaching](),
    },
    {
      checked: isConversationSummaryEnabled,
      onChange: () => setIsConversationSummaryEnabled(!isConversationSummaryEnabled),
      helpText: templates[AdminUiStringTemplates.ConversationSummarizationHelperText](),
      label: templates[AgentAssistStringTemplates.ConversationSummarization](),
    },
    {
      checked: isSmartReplyEnabled,
      onChange: () => setIsSmartReplyEnabled(!isSmartReplyEnabled),
      helpText: templates[AdminUiStringTemplates.SmartReplyHelperText](),
      label: templates[AgentAssistStringTemplates.SmartReply](),
    },
    {
      checked: isKnowledgeAssistEnabled,
      onChange: () => setIsKnowledgeAssistEnabled(!isKnowledgeAssistEnabled),
      helpText: templates[AdminUiStringTemplates.KnowledgeAssistHelperText](),
      label: templates[AgentAssistStringTemplates.KnowledgeAssist](),
    },
  ];

  const setAllowSave = () => {
    props.setAllowSave(props.feature, true);
  };

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      knowledge_assist: isKnowledgeAssistEnabled,
      agent_coaching: isAgentCoachingEnabled,
      conversation_summary: isConversationSummaryEnabled,
      smart_reply: isSmartReplyEnabled,
      debug: isDebugEnabled,
    });
  }, [
    isAgentCoachingEnabled,
    isConversationSummaryEnabled,
    isSmartReplyEnabled,
    isDebugEnabled,
    isKnowledgeAssistEnabled,
  ]);

  return (
    <>
      <AgentAssistAdminGeneralSettings {...props}/>
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>Agent Assist Features</FormSectionHeading>
        <FormControl key={'agent-assist-feature-control'}>
          <SwitchGroup
            name="agent-assist-features"
            legend={<></>}
            // disabled={conversationProfile.hasError || conversationProfile.configItem === ''}
          >
            {agentAssistFeatures.map((feature) => {
              const { label, ...props } = feature;
              return <Switch {...props}>{label}</Switch>;
            })}
          </SwitchGroup>
        </FormControl>
      </FormSection>
      <Separator orientation="horizontal" />
      <AgentAssistAdminVoiceSettings {...props} />
      <Separator orientation="horizontal" />
      <FormSection>
        <FormSectionHeading>Troubleshooting</FormSectionHeading>
        <FormControl key={'debug-control'}>
          <Switch checked={isDebugEnabled} onChange={() => setIsDebugEnabled(!isDebugEnabled)}>
            {templates[AgentAssistStringTemplates.Debug]()}
          </Switch>
        </FormControl>
      </FormSection>
    </>
  );
};
