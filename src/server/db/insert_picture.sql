INSERT INTO pictures
(user_id, uploaded, title, description, picture)
VALUES
($1, $2, $3, $4, $5) 
RETURNING *;