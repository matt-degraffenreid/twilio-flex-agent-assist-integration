export enum StringTemplates {
  CustomerAttributesHeader = 'CESCustomerAttributesHeader',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.CustomerAttributesHeader]: 'Customer Info',
  },
});
