const bodyJsonSchema = {
    type: 'object',
    required: ['amount', 'description', 'method', 'name', 'cpf', 'card_number'],
    properties: {
      amount: { type: 'integer', minimum: 0 },
      description: { type: 'string', minLength: 3 },
      method: {
        type: 'string',
        enum: ['pix', 'credit_card'],
      },
      name: { type: 'string', minLength: 3 },
      cpf: { type: 'string' , pattern: '[0-9]{3}?[0-9]{3}?[0-9]{3}?[0-9]{2}' },
      card_number: { 
        type: 'string',
        nullable: true,
        pattern: '[0-9]{16}'
      },
        valid: { 
        type: 'string',
        nullable: true,
        pattern: '^(?:0[1-9]|1[0-2])(\\d{2})$'
      },
        cvv: { 
        type: 'string',
        nullable: true,
        pattern: '[0-9]{3}'
      },
    },
    if: {
      properties: {
        method: { const: 'credit_card' }
      }
    },
    then: {
      properties: {
        card_number: { 
          type: 'string',
          nullable: false,
          pattern: '[0-9]{16}'
        },
        valid: { 
          type: 'string',
          nullable: false,
          pattern: '^(?:0[1-9]|1[0-2])(\\d{2})$'
        },
        cvv: { 
          type: 'string',
          nullable: false,
          pattern: '[0-9]{3}'
        }
      },
      required: ['card_number', 'valid', 'cvv']
    },
    errorMessage: {
      properties: {
        amount: 'amount must be an integer',
        description: 'description must have at least 3 characters',
        method: 'the only allowed methods are pix and credit_card',
        name: 'name must have at least 3 characters',
        cpf: 'cpf must not contain dots or dashes. Ex: 12345678900',
        card_number: 'card_number must be a string. Format Ex: 7001700270037004',
        valid: 'valid must be a string and have the format MMYY',
        cvv: 'cvv must be a string and have 3 digits'
      }
    },
}
  
export const transactionSchema = {
    body: bodyJsonSchema,
}
