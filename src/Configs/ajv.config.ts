import AjvErrors from 'ajv-errors';
import Ajv from 'ajv';

export const ajv = new Ajv({ allErrors: true });
AjvErrors(ajv);
