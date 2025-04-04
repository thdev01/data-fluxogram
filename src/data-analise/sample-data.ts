// src/data-analise/sample-data.ts

export const sampleData = {
    tables: [
      {
        name: 'users',
        fields: {
          'id': 'UUID',
          'name': 'string',
          'email': 'string',
          'created_at': 'datetime',
          'role_id': 'int'
        }
      },
      {
        name: 'roles',
        fields: {
          'id': 'int',
          'name': 'string',
          'permissions': 'json'
        }
      },
      {
        name: 'products',
        fields: {
          'id': 'UUID',
          'name': 'string',
          'price': 'float',
          'category_id': 'int',
          'stock': 'int'
        }
      },
      {
        name: 'orders',
        fields: {
          'id': 'UUID',
          'user_id': 'UUID',
          'created_at': 'datetime',
          'status': 'string',
          'total': 'float'
        }
      },
      {
        name: 'order_items',
        fields: {
          'id': 'UUID',
          'order_id': 'UUID',
          'product_id': 'UUID',
          'quantity': 'int',
          'price': 'float'
        }
      }
    ]
  };
  
  export const sampleRelations = [
    {
      source: 'users',
      target: 'roles',
      type: 'belongs_to',
      sourceField: 'role_id',
      targetField: 'id'
    },
    {
      source: 'orders',
      target: 'users',
      type: 'belongs_to',
      sourceField: 'user_id',
      targetField: 'id'
    },
    {
      source: 'order_items',
      target: 'orders',
      type: 'belongs_to',
      sourceField: 'order_id',
      targetField: 'id'
    },
    {
      source: 'order_items',
      target: 'products',
      type: 'belongs_to',
      sourceField: 'product_id',
      targetField: 'id'
    }
  ];