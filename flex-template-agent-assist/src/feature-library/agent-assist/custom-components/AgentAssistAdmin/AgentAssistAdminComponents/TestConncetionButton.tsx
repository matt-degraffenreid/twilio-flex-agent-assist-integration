import { HelpText } from '@twilio-paste/core/help-text';
import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { templates } from '@twilio/flex-ui';
import { StringTemplates as AdminUiStringTemplates } from '../../../flex-hooks/strings/AgentAssistAdmin';

interface Endpoint {
    url: string,
    hasError: boolean;
    statusMessage: string;
}

interface TestConnectionButtonProps {
    endpoint: Endpoint;
    testConnectionFunction: any;
}

export const TestConnectionButton = ({ endpoint, testConnectionFunction }: TestConnectionButtonProps): JSX.Element => {
    return (
        <Stack orientation="horizontal" spacing="space30">
            <Button variant='primary' onClick={(e) => testConnectionFunction()} disabled={endpoint.url === ''}>{templates[AdminUiStringTemplates.TestConnectionCTA]()}</Button>
            {endpoint.statusMessage !== '' && <HelpText id="endpoint-help-text" variant={endpoint.hasError ? "error" : "success"}>{endpoint.statusMessage}</HelpText>}
        </Stack>
    )
}