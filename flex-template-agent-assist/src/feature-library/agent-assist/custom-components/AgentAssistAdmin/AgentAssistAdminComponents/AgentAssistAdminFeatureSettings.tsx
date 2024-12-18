import { templates } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { FormSection, FormSectionHeading, FormControl, SwitchGroup, Switch } from '@twilio-paste/core';

import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';

interface OwnProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

export const AgentAssistAdminFeatureSettings = (props: OwnProps) => {
  const [isAgentCoachingEnabled, setIsAgentCoachingEnabled] = useState(props.initialConfig?.agent_coaching ?? true);
  const [isConversationSummaryEnabled, setIsConversationSummaryEnabled] = useState(
    props.initialConfig?.conversation_summary ?? true,
  );
  const [isKnowledgeAssistEnabled, setIsKnowledgeAssistEnabled] = useState(
    props.initialConfig?.knowledge_assist ?? true,
  );
  const [isSmartReplyEnabled, setIsSmartReplyEnabled] = useState(props.initialConfig?.smart_reply ?? true);

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
    });
  }, [isAgentCoachingEnabled, isConversationSummaryEnabled, isSmartReplyEnabled, isKnowledgeAssistEnabled]);
  return (
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
  );
};
