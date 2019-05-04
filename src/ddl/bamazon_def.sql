DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  department_name VARCHAR(40),
  stock_quantity INT NOT NULL
);

ALTER TABLE `bamazon`.`products` 
ADD UNIQUE INDEX `product_name_UNIQUE` (`product_name` ASC) VISIBLE;


CREATE TABLE transactions (
  transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  description VARCHAR(80)
);

ALTER TABLE `bamazon`.`transactions` 
ADD INDEX `validate_product_idx` (`item_id` ASC) VISIBLE;

ALTER TABLE `bamazon`.`transactions` 
ADD CONSTRAINT `validate_product`
  FOREIGN KEY (`item_id`)
  REFERENCES `bamazon`.`products` (`item_id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;