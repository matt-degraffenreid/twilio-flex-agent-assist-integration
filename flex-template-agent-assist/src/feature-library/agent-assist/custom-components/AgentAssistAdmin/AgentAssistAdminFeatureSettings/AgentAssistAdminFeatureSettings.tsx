import { templates } from '@twilio/flex-ui';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Switch, SwitchGroup } from '@twilio-paste/core/switch';
import { useDispatch, useSelector } from 'react-redux';

import { StringTemplates as AgentAssistStringTemplates } from '../../../flex-hooks/strings/AgentAssist';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';
import { AppState } from '../../../../../types/manager';
import { reduxNamespace } from '../../../../../utils/state';
import { AgentAssistAdminState, updateAgentAssistAdminState } from '../../../flex-hooks/states/AgentAssistAdmin';

export const AgentAssistAdminFeatureSettings = () => {
  const dispatch = useDispatch();
  const { agentCoaching, conversationSummary, smartReply, knowledgeAssist } = useSelector(
    (state: AppState) => state[reduxNamespace].agentAssistAdmin as AgentAssistAdminState,
  );

  const agentAssistFeatures = [
    {
      checked: agentCoaching,
      onChange: () => dispatch(updateAgentAssistAdminState({ agentCoaching })),
      helpText: templates[AdminUiStringTemplates.AgentCoachingHelperText](),
      label: templates[AgentAssistStringTemplates.AgentCoaching](),
    },
    {
      checked: conversationSummary,
      onChange: () => dispatch(updateAgentAssistAdminState({ conversationSummary })),
      helpText: templates[AdminUiStringTemplates.ConversationSummarizationHelperText](),
      label: templates[AgentAssistStringTemplates.ConversationSummarization](),
    },
    {
      checked: smartReply,
      onChange: () => dispatch(updateAgentAssistAdminState({ smartReply })),
      helpText: templates[AdminUiStringTemplates.SmartReplyHelperText](),
      label: templates[AgentAssistStringTemplates.SmartReply](),
    },
    {
      checked: knowledgeAssist,
      onChange: () => dispatch(updateAgentAssistAdminState({ knowledgeAssist })),
      helpText: templates[AdminUiStringTemplates.KnowledgeAssistHelperText](),
      label: templates[AgentAssistStringTemplates.KnowledgeAssist](),
    },
  ];

  return (
    <FormSection>
      <FormSectionHeading>Agent Assist Features</FormSectionHeading>
      <FormControl key={'agent-assist-feature-control'}>
        <SwitchGroup name="agent-assist-features" legend={<></>}>
          {agentAssistFeatures.map((feature) => {
            const { label, ...props } = feature;
            return (
              <Switch data-testid={`enable-${label}-switch`} {...props}>
                {label}
              </Switch>
            );
          })}
        </SwitchGroup>
      </FormControl>
    </FormSection>
  );
};
