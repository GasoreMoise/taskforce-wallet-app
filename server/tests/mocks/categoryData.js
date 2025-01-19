const mongoose = require('mongoose');

module.exports = {
  validCategory: {
    name: 'Test Category',
    type: 'expense',
    parent: null
  },
  
  invalidCategory: {
    name: '',
    type: 'invalid'
  },
  
  updateData: {
    name: 'Updated Category'
  },
  
  subcategories: [
    {
      name: 'Subcategory 1',
      type: 'expense',
      parent: new mongoose.Types.ObjectId()
    },
    {
      name: 'Subcategory 2',
      type: 'expense',
      parent: new mongoose.Types.ObjectId()
    }
  ],
  
  categoryHierarchy: {
    name: 'Parent Category',
    type: 'expense',
    subcategories: [
      {
        name: 'Child Category 1',
        type: 'expense'
      },
      {
        name: 'Child Category 2',
        type: 'expense'
      }
    ]
  }
}; 