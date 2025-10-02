-- Insert a new record to the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
    VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account SET account_type = 'Admin';

-- Delete the Tony Stark record from the database.
DELETE FROM public.account WHERE account_id = 1;

-- Query 4 -- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE public.inventory 
	SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior');
	
/*
Query 5 -- Use an inner join to select the make and model fields from the inventory 
table and the classification name field from the classification table for 
inventory items that belong to the "Sport" category.
*/
SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name FROM public.inventory
	INNER JOIN public.classification
	ON public.classification.classification_id = public.inventory.classification_id
	WHERE public.classification.classification_name = 'Sport';


/*
Query 6 -- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query. 
This reference may prove helpful - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-replace/. 
When done the path for both inv_image and inv_thumbnail should resemble this example: /images/vehicles/a-car-name.jpg
*/
UPDATE public.inventory
	SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	 	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
