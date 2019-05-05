# bamazon

### Overview
Amazon-like storefront based on MySQL database.  There are three major functions: a customer 'app' that takes orders from customers, a manager app, and a supervisory app.

The manager app allows a manager to view the current inventory, view inventory items with less than 5 items in stock, add inventory to items, and add new items.

The supervisor app allows the supervisor to add departments, view sales by departments, and to audit transactions (customer sales, manager adds) that affect stock quantities.

### Detailed walk through.

With the starting inventory (as displayed by the manager application):
![1](Images/1.png)

The customer app allows a customer to scroll through the list of items and select what they want to buy.  Then it asks them how many.
![2](Images/2.png)

When the customer has made a selection, it confirms the purchase and displays all the pricing information.
![3](Images/3.png)

The manager can see the change in inventory in their display screen.
![4](Images/4.png)
