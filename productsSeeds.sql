DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price FLOAT NOT NULL,
  stock_quantity INT NULL,
  product_sales FLOAT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Spaulding Basketball","sporting goods",13.99,21),
("Nerf Football","sporting goods",7.99,14),
("Nike Golf Driver","sporting goods",150.99,18),
("King size Bedding Set","home",75.99,5),
("10 Piece Cookware Set","home",85.99,4),
("Indoor Throw Pillow","home",16.99,3),
("Iphone Xr","electronics",500,2,50),
("Beats by Dre Headphones","electronics",279.99,24),
("XBOX One","electronics",299.99,38),
("Fitbit Smart Watch","electronics",169.99,36),
("Playstation 4","electronics",321.99,9),
("Louisville Slugger Baseball Bat","sporting goods",24.95),
("coffee mug","home",10.99,10),
("Tennis Racquet","sporting goods",493.99,15);