import React, { useEffect, useState } from 'react';
import { FormControl, FormSection, FormSectionHeading } from '@twilio-paste/core/form';
import { Switch } from '@twilio-paste/core/switch';
import { Separator } from '@twilio-paste/core/separator';
import { templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';

import { StringTemplates as AgentAssistStringTemplates } from '../../flex-hooks/strings/AgentAssist';
import { AgentAssistAdminVoiceSettings } from './AgentAssistAdminVoiceSettings';
import { AgentAssistAdminFeatureSettings } from './AgentAssistAdminFeatureSettings';
import { AgentAssistAdminGeneralSettings } from './AgentAssistAdminGeneralSettings';
import { updateAgentAssistAdminState } from '../../flex-hooks/states/AgentAssistAdmin';

interface OwnProps {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
}

export const AgentAssistAdmin = (props: OwnProps) => {
  const dispatch = useDispatch();
  const [isDebugEnabled, setIsDebugEnabled] = useState(props.initialConfig?.debug ?? false);
  const setAllowSave = () => {
    props.setAllowSave(props.feature, true);
  };
  useEffect(() => {
    dispatch(updateAgentAssistAdminState({ ...props.initialConfig }));
  }, []);

  useEffect(() => {
    setAllowSave();
    props.setModifiedConfig(props.feature, {
      ...props.initialConfig,
      debug: isDebugEnabled,
    });
  }, [isDebugEnabled]);

  return (
    <>
      <AgentAssistAdminGeneralSettings {...props} />
      <Separator orientation="horizontal" />
      <AgentAssistAdminFeatureSettings {...props} />
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
