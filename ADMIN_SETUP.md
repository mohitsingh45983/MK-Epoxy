# Admin Dashboard Setup Guide

## Step 1: Install Dependencies

Make sure you have the new dependencies installed:

```bash
npm install
```

## Step 2: Create Admin User

Run the script to create an admin user:

```bash
npm run create-admin <username> <password> <email>
```

Example:
```bash
npm run create-admin admin mypassword123 admin@mkepoxy.com
```

Or use defaults (admin/admin123/admin@mkepoxy.com):
```bash
npm run create-admin
```

## Step 3: Initialize Service Pricing

After logging into the admin dashboard, the pricing will be automatically loaded from the database. If no pricing exists, you can:

1. Login to admin dashboard at `/admin/login`
2. The system will automatically create default pricing on first use
3. Or manually add pricing through the dashboard

## Step 4: Access Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You'll be redirected to `/admin/dashboard`
4. Edit service pricing rates as needed

## Security Notes

- Change the default JWT_SECRET in `.env` file
- Use strong passwords for admin accounts
- The admin dashboard is protected by JWT authentication
- Only authenticated admins can access pricing management

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
```

## Default Pricing

The system will use these default rates if not set in database:
- Epoxy Flooring: ₹80/sqft
- Waterproofing: ₹60/sqft
- PU Flooring: ₹100/sqft
- Industrial Coating: ₹120/sqft
- Crack Filling: ₹40/sqft
- Expansion Joint Treatment: ₹50/sqft

