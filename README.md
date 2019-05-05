# bamazon

### Overview
Amazon-like storefront based on MySQL database.  There are three major functions: a customer 'app' that takes orders from customers, a manager app, and a supervisory app.

The manager app allows a manager to view the current inventory, view inventory items with less than 5 items in stock, add inventory to items, and add new items.

The supervisor app allows the supervisor to add departments, view sales by departments, and to audit transactions (customer sales, manager adds) that affect stock quantities.

### Detailed walk through.

With the starting inventory (as displayed by the manager application):
![1](./images/1.png)

The customer app allows a customer to scroll through the list of items and select what they want to buy.  Then it asks them how many.
![2](images/2.png)

When the customer has made a selection, it confirms the purchase and displays all the pricing information.
![3](images/3.png)

The manager can see the change in inventory in their display screen.
![4](images/4.png)

The application presents the manager with other options
![5](images/5.png)

They can add inventory:
![6](images/6.png)
![7](images/7.png)

This will, of course, show up in the inventory display screen:
![8](images/8.png)

If the customer attempts to buy more inventory than there is, they will get an error message.
![9](images/9.png)
![10](images/10.png)

The manager can use their superpowers to see the inventory items that are low stock.
![11](images/11.png)

The manager can then use the app to add additional inventory.
![12](images/12.png)

The manager can add new products as well.
![13](images/13.png)

The supervisor has 3 options
![14](images/14.png)

They can add new departments
![15](images/15.png)

The supervisor can view the total sales by department.
The supervisor also can audit the buy/add inventory transactions.
![16](images/16.png)
