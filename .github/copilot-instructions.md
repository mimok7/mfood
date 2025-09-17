# AI Coding Assistant Instructions for mfood

## Project Overview
mfood is a restaurant POS system built with Next.js 15 App Router, TypeScript, and Supabase. It supports three user roles (guest/manager/admin) and multi-tenant restaurant management.

## Architecture Patterns

### Authentication & Authorization
- **Three Supabase clients**: browser (anon key), server (anon key), admin (service role key)
- **Role hierarchy**: guest (0) < manager (1) < admin (2)
- **Auth utilities** in `lib/auth.ts`:
  - `getSession()`: Returns { user, role, restaurant_id }
  - `requireRole(minRole, options?)`: Redirects if unauthorized, checks restaurant ownership for managers
  - `isAtLeast(role, minRole)`: Role comparison utility

### Data Access Patterns
- **Server components**: Use `createSupabaseServer()` for data fetching
- **Client components**: Use `createSupabaseBrowser()` for mutations
- **Admin operations**: Use `supabaseAdmin()` (service role bypasses RLS)
- **Restaurant scoping**: All data includes `restaurant_id` foreign keys

### API Route Conventions
- **Admin routes**: Use `requireRole('admin')` + `supabaseAdmin()`
- **Manager routes**: Use `requireRole('manager', { targetRestaurantId })`
- **Guest routes**: Public access via QR tokens
- **Form handling**: Server actions with `NextResponse.redirect()` for POST routes

## Critical Workflows

### Development Setup
```bash
npm install
cp .env.example .env
# Set SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# Run SQL migrations in order: 001_schema.sql → 002_policies.sql → 003_seeds.sql → extensions
npm run dev
```

### Admin Restaurant Management
1. Select restaurant from `/admin/restaurants`
2. Navigate via tabs: users/menu/settings/qr
3. Forms submit to API routes, redirect back to same page
4. Use `RestaurantsEditor` pattern: server fetches initial data, client handles form state

### Database Schema Application
- Apply SQL files in numbered order via Supabase SQL Editor
- Core tables: restaurants, user_profile, menu_*, tables, orders, waitlist, kitchen_queue
- RLS policies provide basic read access, admin operations bypass via service role

## Code Patterns & Conventions

### File Structure
- `app/` routes use App Router conventions
- `lib/` utilities: auth, supabase clients, types
- `sql/` migrations numbered with descriptions
- `docs/` Korean documentation for setup and features

### Component Patterns
- Server components for data loading (e.g., `AdminRestaurantsPage`)
- Client components for interactivity (e.g., `RestaurantsEditor`)
- Use `"use client"` directive consistently
- Forms use `FormData` API with server-side processing

### Design System & UI Patterns
- **Color Scheme**: Orange/red gradient themes with blue and green accents
- **Layout Patterns**: Responsive grid systems, card-based designs, gradient backgrounds
- **Typography**: Consistent heading hierarchy with proper font weights
- **Components**: Reusable button styles, form inputs with validation states, loading indicators
- **Navigation**: Next.js Link components for client-side routing
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints

### Database Patterns
- UUID primary keys with `gen_random_uuid()`
- `updated_at` triggers via `set_updated_at()` function
- Restaurant-scoped tables include `restaurant_id uuid references restaurants(id)`
- Menu items belong to categories, orders reference tables

### Error Handling
- API routes return JSON errors or redirect on success
- Client components use try/catch with user-friendly messages
- Auth failures redirect to `/guest` or appropriate role page

## Key Files to Reference

### Core Utilities
- `lib/auth.ts`: Authentication and authorization logic
- `lib/supabase-*.ts`: Three client configurations
- `lib/types.ts`: Role enum and minimal Database typing

### Example Components
- `app/components/Shell.tsx`: Role-based navigation layout
- `app/admin/restaurants/RestaurantsEditor.tsx`: Form state management pattern
- `app/api/admin/restaurants/[id]/settings/route.ts`: Admin API with form processing

### Marketing & Public Pages
- `app/page.tsx`: Professional homepage with role-based redirects, feature showcases, and call-to-action sections
- `app/auth/sign-in/page.tsx`: Enhanced login page with role-based guidance and improved UX
- `app/auth/sign-up/page.tsx`: Comprehensive registration page with validation and benefits showcase
- `app/features/page.tsx`: Detailed feature presentation for QR ordering, kitchen management, and analytics
- `app/pricing/page.tsx`: Three-tier pricing plans with feature comparison and FAQ section
- `app/contact/page.tsx`: Contact page with form handling and multiple communication channels
- `app/not-found.tsx`: User-friendly 404 error page with navigation assistance

### Database Schema
- `sql/001_schema.sql`: Core tables and relationships
- `sql/002_policies.sql`: Row Level Security setup
- `sql/003_seeds.sql`: Demo data for development

## Development Best Practices

### When Adding Features
- Follow role-based access patterns
- Use restaurant scoping for multi-tenant data
- Test with different user roles
- Update SQL migrations for schema changes

### When Modifying Auth
- Update role checks in `requireRole()` calls
- Test redirects for unauthorized access
- Verify restaurant ownership for manager operations

### When Adding API Routes
- Use appropriate Supabase client (admin for writes, server for reads)
- Include role requirements at route start
- Return consistent error formats
- Use redirects for successful form submissions

### When Creating Marketing/Public Pages
- Maintain consistent branding with orange/red gradient themes
- Implement responsive design for mobile/tablet/desktop
- Use role-based redirects for authenticated users
- Include proper SEO meta tags and accessibility features
- Follow form validation patterns with user feedback
- Ensure navigation consistency across all pages</content>
<parameter name="filePath">c:\Users\saint\mfood\.github\copilot-instructions.md