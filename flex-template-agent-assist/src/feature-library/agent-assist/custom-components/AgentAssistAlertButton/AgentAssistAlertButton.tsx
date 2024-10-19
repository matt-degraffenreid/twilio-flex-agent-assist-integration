import React, { useEffect } from 'react';
import { Flex } from '@twilio-paste/core/flex';
import { IconButton, templates, Icon } from '@twilio/flex-ui';

import { AgentAssistIcon } from '../../flex-hooks/icons/AgentAssistIcon.jsx';

export const AgentAssistAlertButton = () => {
  return (
    <Flex vAlignContent="center">
      <IconButton icon={<AgentAssistIcon />} />
    </Flex>
  );
};
