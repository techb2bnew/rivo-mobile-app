import Realm from 'realm';

const OrderSchema = {
  name: 'Order',
  primaryKey: 'id',
  properties: {
    id: 'string',
    points: 'int',
    date: 'string',
    status: 'string',
    items: { type: 'list', objectType: 'Item' },
  },
};

const ItemSchema = {
  name: 'Item',
  properties: {
    id: 'string',
    name: 'string',
    price: 'double',
    quantity: 'int',
    product: { 
      type: 'object',
      objectType: 'Product'
    }
  },
};


const ProductSchema = {
  name: 'Product',
  properties: {
    id: 'string',
    name: 'string',
    sku: 'string',
    product_type: 'string',
    slug: 'string',
    uid: 'string',
  },
};

// Function to create or access Realm instance
let realmInstance; // To ensure a singleton instance

const getRealm = () => {
  if (!realmInstance) {
    realmInstance = new Realm({
      schema: [OrderSchema, ItemSchema,ProductSchema],
    });
  }
  return realmInstance;
};

export default getRealm;
