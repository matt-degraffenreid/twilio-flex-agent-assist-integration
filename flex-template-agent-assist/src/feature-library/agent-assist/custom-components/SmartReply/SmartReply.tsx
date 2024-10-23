//@ts-nocheck
import { Flex as PasteFlexComponent } from '@twilio-paste/core/flex';
import { Box } from '@twilio-paste/core/box';
import { Card } from '@twilio-paste/core/card';

export const SmartReply = () => {
    return (
        <Box margin="space30">
            <Card padding="space50">
                <PasteFlexComponent vAlignContent="center" height={'100%'} overflowY={'scroll'}>
                    <agent-assist-smart-reply></agent-assist-smart-reply>
                </PasteFlexComponent>
            </Card>
        </Box>
    )
}