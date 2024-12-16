import { Radio, RadioGroup } from '@twilio-paste/core/radio-group';
import { Transcription } from '../../../types/ServiceConfiguration';
import { Switch } from '@twilio-paste/core/switch';
import { FormControl } from '@twilio-paste/core/form';

interface SwitchWithOptionsProps {
    feature: Transcription;
    featureLabel: string;
    featureChangeHandler: any;
    featureDisabled?: boolean;
    featureOptions: {
        value: string;
        helpText: string;
        label: string;
        defaultChecked?: boolean;
    }[];
    optionsChangeHandler: any;
    optionsDisabled: boolean;
}

export const SwitchWithOptions = ({ feature, featureLabel, featureChangeHandler, featureOptions, featureDisabled, optionsDisabled, optionsChangeHandler }: SwitchWithOptionsProps): JSX.Element => {
    return (
        <Switch
            checked={feature.enabled}
            onChange={(e) => featureChangeHandler({ ...feature, enabled: e.target.checked })}
            disabled={featureDisabled}
            helpText={
                <FormControl key={`${featureLabel}-version`}>
                    <RadioGroup
                        legend={<></>}
                        name={`${featureLabel}-version`}
                        disabled={optionsDisabled}
                        onChange={(e) => optionsChangeHandler(e)}
                    >
                        {
                            featureOptions.map(feature => {
                                const { label, ...props } = feature;
                                return (
                                    <Radio
                                        {...props}
                                    >
                                        {label}
                                    </Radio>
                                )
                            })
                        }
                    </RadioGroup>
                </FormControl>}
        >
            {featureLabel}
        </Switch>
    )
}