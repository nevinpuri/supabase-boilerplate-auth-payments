-- Run this in Supabase SQL Editor to clean up test data and check tables

-- First, let's see what's in the products table
SELECT * FROM products;

-- Clean up test data
DELETE FROM products WHERE name = 'Test Price 1';

-- Check if prices table has any data
SELECT * FROM prices;

-- Check if the tables exist with correct schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'prices';