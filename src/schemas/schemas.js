import Realm from 'realm';

// Define the Item schema
const OrderSchema = {
    name: 'Order',
    primaryKey: 'id',
    properties: {
      id: 'string',
      points: 'int',
      date: 'string',
      time: 'string',
      status: 'string',
      location: 'string',
      store: 'string',
      deliveryMethod: 'string',
      subtotal: 'double',
      shipping: 'double',
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
      image: 'string',
    },
  };

// Function to create or access Realm instance
let realmInstance; // To ensure a singleton instance

const getRealm = () => {
  if (!realmInstance) {
    realmInstance = new Realm({
      schema: [OrderSchema, ItemSchema],
    });
  }
  return realmInstance;
};

export default getRealm;
