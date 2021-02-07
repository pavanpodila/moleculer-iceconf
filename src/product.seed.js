const { v1: uuid } = require('uuid');

module.exports = [
  { _type: 'product', tier: 1, productId: '3m-22.5-3-1', name: '3 Month plan', months: 3, price: 22.5, count: 1 },
  { _type: 'product', tier: 1, productId: '3m-7.5-1-3', name: '3 Month plan', months: 1, price: 7.5, count: 3 },
  { _type: 'product', tier: 1, productId: '6m-45-6-1', name: '6 Month plan', months: 6, price: 45, count: 1 },
  { _type: 'product', tier: 2, productId: '3m-30-3-1', name: '3 Month plan', months: 3, price: 30, count: 1 },
  { _type: 'product', tier: 2, productId: '3m-10-1-3', name: '3 Month plan', months: 1, price: 10, count: 3 },
  { _type: 'product', tier: 2, productId: '6m-60-1-6', name: '6 Month plan', months: 6, price: 60, count: 1 },
  { _type: 'product', tier: 2, productId: '6m-10-1-6', name: '6 Month plan', months: 1, price: 10, count: 6 },
  { _type: 'product', tier: 3, productId: '3m-45-3-1', name: '3 Month plan', months: 3, price: 45, count: 1 },
  { _type: 'product', tier: 3, productId: '3m-15-1-3', name: '3 Month plan', months: 1, price: 15, count: 3 },
  { _type: 'product', tier: 3, productId: '6m-90-6-1', name: '6 Month plan', months: 6, price: 90, count: 1 },
  { _type: 'product', tier: 3, productId: '6m-15-1-6', name: '6 Month plan', months: 1, price: 15, count: 6 },
];
