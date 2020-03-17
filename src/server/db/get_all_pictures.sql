SELECT 
    id,
    user_id,
    uploaded,
    title,
    description, 
    ENCODE(picture, 'base64') as base64pict
FROM pictures ORDER BY title asc