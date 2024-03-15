import { VariablesConfig, TemplateConfig } from './types';
import { LovelaceCardConfig } from 'custom-card-helpers';

export default (variables: VariablesConfig[] | undefined, templateConfig: TemplateConfig): LovelaceCardConfig => {
  const cardOrElement = templateConfig.card ?? templateConfig.element;
  if (!variables && !templateConfig.default) {
    return cardOrElement;
  }
  let variableArray: VariablesConfig[] = [];
  if (variables) {
    variableArray = variables.slice(0);
  }
  if (templateConfig.default) {
    variableArray = variableArray.concat(templateConfig.default);
  }
  let jsonConfig = JSON.stringify(cardOrElement);
  variableArray.forEach(variable => {
    const key = Object.keys(variable)[0];
    const value = Object.values(variable)[0];
    if (typeof value === 'number' || typeof value === 'boolean') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      jsonConfig = jsonConfig.replace(rxp2, (value as unknown) as string);
    }
    if (typeof value === 'object') {
      const rxp2 = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
      const valueString = JSON.stringify(value);
      jsonConfig = jsonConfig.replace(rxp2, valueString);
    } else {
      const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
      jsonConfig = jsonConfig.replace(rxp, value);
    }
  });
  return JSON.parse(jsonConfig);
};
