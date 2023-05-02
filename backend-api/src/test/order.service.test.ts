// Import necessary modules and functions
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { INewOrder } from '../models/order.model';
import { orderService } from '../services/order.service';

// Mock input data for testing
const mockInput: INewOrder = {
  customer: 'John Doe',
  contact: 'john.doe@example.com',
  deliveryAddress: '123 Main St, Anytown, USA',
  purchasedItems: [
    {
      productId: 1,
      quantity: 2,
    },
    {
      productId: 2,
      quantity: 1
    }
  ]
};

// Begin test suite
describe('createOrder', () => {
  it('should create a new order', async () => {
    // Call the createOrder function with the mock input data
    const result = await orderService.createOrder(mockInput);

    // Assert that the result is an object with expected properties
    expect(result).to.be.an('object');
    expect(result).to.have.property('id').that.is.a('number');
    expect(result).to.have.property('customer').that.equals(mockInput.customer);
    expect(result).to.have.property('contact').that.equals(mockInput.contact);
    expect(result).to.have.property('deliveryAddress').that.equals(mockInput.deliveryAddress);
    expect(result).to.have.property('purchasedItems').that.is.an('array').with.lengthOf(mockInput.purchasedItems.length);

    // Assert that each purchased item in the result has expected properties
    for (let i = 0; i < mockInput.purchasedItems.length; i++) {
      expect(result.purchasedItems[i]).to.have.property('id').that.is.a('number');
      expect(result.purchasedItems[i]).to.have.property('productId').that.equals(mockInput.purchasedItems[i].productId);
      expect(result.purchasedItems[i]).to.have.property('quantity').that.equals(mockInput.purchasedItems[i].quantity);
      expect(result.purchasedItems[i]).to.have.property('product').that.is.an('object');
      expect(result.purchasedItems[i].product).to.have.property('id').that.is.a('number');
      expect(result.purchasedItems[i].product).to.have.property('name').that.is.a('string');
      expect(result.purchasedItems[i].product).to.have.property('price').that.is.a('number');
    }
  });

  it('should throw an error if input is invalid', async () => {
    // Call the createOrder function with invalid input (missing required field)
    const invalidInput:INewOrder = {
      customer: 'Jane Doe',
      contact: 'jane.doe@example.com',
      deliveryAddress: '',
      purchasedItems: [
        {
          productId: 1,
          quantity: 2,
        }
      ]
    };

    // Assert that calling the function with invalid input throws an error
    await expect(orderService.createOrder(invalidInput)).to.be.Throw(Error);
  });
});
