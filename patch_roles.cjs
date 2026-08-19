const fs = require('fs');
let code = fs.readFileSync('src/types/roles.ts', 'utf8');

code = code.replace(`export const USER_ROLES = [
  'student',
  'general_renter',
  'accommodation_owner',
  'property_owner',
] as const;`, `export const USER_ROLES = [
  'student',
  'general_renter',
  'accommodation_owner',
  'property_owner',
  'manager',
] as const;`);

code = code.replace(`export const ROLE_META: Record<UserRole, {`, `export const ROLE_META: Record<UserRole, {
  label:       string;
  description: string;
  icon:        string;
}> = {
  manager: {
    label:       'Manager',
    description: 'System Manager',
    icon:        '🛡️',
  },
  student: {`);

// Wait, the replacement target might not match exactly. Let me check the exact file structure.
