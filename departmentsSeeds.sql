USE bamazon;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs FLOAT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (department_name, over_head_costs)
VALUES ("sporting goods",100),
("home",200),
("electronics",300),
("clothing",50),
("lawn and garden",200),
("hardware",400)
