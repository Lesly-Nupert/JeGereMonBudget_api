INSERT INTO "user" ("username", "email", "password")
VALUES
  ('Lesly', 'lesly@example.com', 'password1'),
  ('Mirette', 'mirette@example.com', 'password2');

INSERT INTO "account" ("name", "user_id")
VALUES
  ('Account1', 1), 
  ('Account2', 2); 

INSERT INTO "transaction" ("amount", "name", "type", "account_id")
VALUES
  (1000.00, 'Salaire', 'revenus', 1),
  (50.00, 'Courses', 'dépenses', 2);

