# onlinestore
side project of onlinestore, using Typescript, NodeJS, ReactJS and Prisma

Project Summary
This online shopping website is to demonstrate my usage of the following technologies and libraries
1. Typescript, Node, Express, React and Prisma as core technology
2. PostgreSQL is the backend database
3. PrimeReact is the UI library
4. RabbitMQ to demonstrate the usage of message queue
5. JWT are used for the implementation of authentication

Description of the website
The Demo hosted in Render can be access by https://react-onlineshop0x.onrender.com

1. Visitors could use the following users to login:
    a) harrywan@mail.com / abc123
    b) kerrywan@mail.com / abc123
2. The initialize button is to reset the inventory and clear all the orders
3. The user registration function is disbaled in Render
4. The website has three default product, the user could order as many as they want.
5. The ordered products are stored in the shopping cart which could be visit by clicking the number in the top right corner.
6. The ordered products could be check-out by click checkout button in the shopping Cart. If there is enough inventory, the order status will become "Confirm", otherwise will be "Refund".
7. Originally, the checkout order is send to message queue, and the processor.js will be the consumer job for the following tasks:
    a) pickup the pending order
    b) check inventory
    c) if enough inventory, deduce the inventory by the number of ordered and then change the order status to "confirm"
    b) otherwise change the order status to "refund"
8. Since I have not subscribed the RabbitMQ service in Render, the way of message queue is replaced.
9. The Delivery Tab will show the confirmed orders in the Calendar, by the delivery date
10. The List of Order Tab will show all the orders
