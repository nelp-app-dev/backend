-- Create a new database if it does not exist already
IF EXISTS (
  SELECT name
   FROM sys.databases
   WHERE name = N'required__database'
)
BEGIN
  DROP DATABASE required__database
END
CREATE DATABASE required__database
