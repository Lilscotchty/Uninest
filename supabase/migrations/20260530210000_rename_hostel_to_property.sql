-- supabase/migrations/20260530210000_rename_hostel_to_property.sql
ALTER TABLE IF EXISTS hostels RENAME TO properties;
ALTER TABLE IF EXISTS properties RENAME COLUMN hostel_id TO property_id;
ALTER TABLE IF EXISTS properties RENAME COLUMN hostel_name TO property_name;

-- Update any foreign key references
ALTER TABLE IF EXISTS bookings RENAME COLUMN hostel_id TO property_id;
ALTER TABLE IF EXISTS reviews RENAME COLUMN hostel_id TO property_id;
ALTER TABLE IF EXISTS saved_hostels RENAME TO saved_properties;
ALTER TABLE IF EXISTS saved_properties RENAME COLUMN hostel_id TO property_id;
