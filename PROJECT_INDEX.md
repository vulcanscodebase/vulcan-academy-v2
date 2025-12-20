# Vulcan Academy V2 - Project Index

## 📋 Project Overview

**Project Name:** Vulcan Academy V2  
**Framework:** Next.js 14.2.16 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS 4.1.9  
**UI Library:** Radix UI components + shadcn/ui  
**State Management:** React Context API  
**HTTP Client:** Axios  
**Form Handling:** React Hook Form + Zod validation

---

## 🗂️ Project Structure

```
vulcan-academy-v2/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── (about-us)/        # About page components
│   ├── (auth)/            # Authentication components
│   ├── (cart)/            # Shopping cart components
│   ├── (contact-us)/      # Contact page components
│   ├── (extra-page)/      # Extra page components
│   ├── (home)/            # Homepage components
│   ├── (interview-master)/ # Interview master components
│   ├── (layout-wrapper)/  # Layout components (Navbar, Footer)
│   ├── (my-dashboard)/    # Dashboard components
│   ├── (policies)/        # Policy page components
│   ├── (testes)/          # Test components
│   ├── (user)/            # User profile components
│   ├── api/               # API client utilities
│   ├── context/           # React Context providers
│   └── ui/                # Reusable UI components (shadcn/ui)
├── data/                  # Static data files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── public/                # Static assets
├── styles/                # Global styles
└── utils/                 # Utility functions
```

---

## 📄 Routes & Pages

### Public Routes

| Route | Page File | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Homepage |
| `/about` | `app/about/page.tsx` | About Us page |
| `/contact` | `app/contact/page.tsx` | Contact Us page |
| `/interview` | `app/interview/page.tsx` | Vulcan Prep 360 public page |
| `/tests` | `app/tests/page.tsx` | Tests page |
| `/signin` | `app/signin/page.tsx` | Sign In page |
| `/signup` | `app/signup/page.tsx` | Sign Up page |
| `/forgot-password` | `app/forgot-password/page.tsx` | Forgot Password page |
| `/checkout` | `app/checkout/page.tsx` | Checkout page |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy Policy |
| `/refund-policy` | `app/refund-policy/page.tsx` | Refund Policy |
| `/shipping-policy` | `app/shipping-policy/page.tsx` | Shipping Policy |
| `/terms-and-conditions` | `app/terms-and-conditions/page.tsx` | Terms and Conditions |
| `/user-profile` | `app/user-profile/page.tsx` | User Profile page |

### Protected/User Routes

| Route | Page File | Description |
|-------|-----------|-------------|
| `/user-dash` | `app/user-dash/page.tsx` | User Dashboard (main) |
| `/user-dash/courses` | `app/user-dash/courses/page.tsx` | User's enrolled courses |
| `/user-dash/interview-master` | `app/user-dash/interview-master/page.tsx` | Vulcan Prep 360 dashboard |
| `/user-dash/mytests` | `app/user-dash/mytests/page.tsx` | User's tests |

### Admin Routes

| Route | Page File | Description |
|-------|-----------|-------------|
| `/super-admin` | `app/super-admin/page.tsx` | Super Admin dashboard |

---

## 🧩 Components Index

### Layout Components
- **`components/(layout-wrapper)/navbar.tsx`** - Main navigation bar
- **`components/(layout-wrapper)/footer.tsx`** - Site footer

### Home Page Components
- **`components/(home)/hero-section.tsx`** - Hero/banner section
- **`components/(home)/about-our.tsx`** - About section
- **`components/(home)/how-it-works.tsx`** - How it works section
- **`components/(home)/our-products.tsx`** - Products showcase
- **`components/(home)/client-says.tsx`** - Testimonials
- **`components/(home)/guidance-section.tsx`** - Guidance section
- **`components/(home)/progress-section.tsx`** - Progress tracking
- **`components/(home)/before-footer-section.tsx`** - Pre-footer CTA

### Authentication Components
- **`components/(auth)/signin.tsx`** - Sign in form
- **`components/(auth)/signup.tsx`** - Sign up form
- **`components/(auth)/forgot-password.tsx`** - Password recovery form

### Cart & Checkout Components
- **`components/(cart)/cart.tsx`** - Shopping cart sidebar/drawer
- **`components/(cart)/cartitem.tsx`** - Individual cart item
- **`components/(cart)/checkout.tsx`** - Checkout form
- **`components/(cart)/coupon.tsx`** - Coupon code input

### About Us Components
- **`components/(about-us)/who-we-are.tsx`** - Company introduction
- **`components/(about-us)/our-purpose.tsx`** - Mission/purpose
- **`components/(about-us)/our-expertise.tsx`** - Expertise showcase
- **`components/(about-us)/our-leaders.tsx`** - Leadership team
- **`components/(about-us)/questions.tsx`** - FAQ section
- **`components/(about-us)/before-footer.tsx`** - Pre-footer section

### Contact Us Components
- **`components/(contact-us)/get-in-touch.tsx`** - Contact form
- **`components/(contact-us)/location.tsx`** - Location/map
- **`components/(contact-us)/before-footers.tsx`** - Pre-footer section

### Dashboard Components
- **`components/(my-dashboard)/user-navbar.tsx`** - Dashboard navigation
- **`components/(my-dashboard)/my-courses.tsx`** - User courses list
- **`components/(my-dashboard)/interview-master.tsx`** - Vulcan Prep 360 dashboard
- **`components/(my-dashboard)/tests.tsx`** - Tests dashboard

### Vulcan Prep 360 Components
- **`components/(interview-master)/coursescardpublic.tsx`** - Public course cards
- **`components/(interview-master)/coursessection.tsx`** - Courses section
- **`components/(interview-master)/pagination.tsx`** - Pagination component
- **`components/(interview-master)/shimmer.tsx`** - Loading shimmer
- **`components/(interview-master)/shimmercard.tsx`** - Card shimmer loader

### User Profile Components
- **`components/(user)/profile.tsx`** - User profile form
- **`components/(user)/profile-header.tsx`** - Profile header section

### Policy Components
- **`components/(policies)/privacy-policy.tsx`** - Privacy policy content
- **`components/(policies)/refund-policy.tsx`** - Refund policy content
- **`components/(policies)/shipping-policy.tsx`** - Shipping policy content
- **`components/(policies)/terms-and-conditions.tsx`** - Terms content

### Other Components
- **`components/(extra-page)/extra-page.tsx`** - Extra/generic page
- **`components/(testes)/vulcan-journey.tsx`** - Journey/timeline component
- **`components/testimonials-section.tsx`** - Testimonials display
- **`components/theme-provider.tsx`** - Theme context provider (dark/light mode)

### UI Components (shadcn/ui)
Located in `components/ui/` - Comprehensive set of reusable UI components:
- Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card
- Carousel, Chart, Checkbox, Dialog, Drawer, Dropdown Menu
- Form, Input, Label, Loader, Pagination, Popover
- Progress, Radio Group, Select, Separator, Sheet, Sidebar
- Skeleton, Slider, Switch, Table, Tabs, Textarea
- Toast, Toggle, Tooltip, and more...

---

## 🔌 API Integration

### API Client Configuration
- **Base URL:** `http://localhost:5001/api`
- **File:** `components/api/index.tsx`
- **Features:** Axios interceptors for token refresh, error handling

### API Endpoints

#### Authentication APIs
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/user` - Get current user from token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password with token
- `POST /auth/setup-password` - Setup initial password
- `GET /auth/verify-email/:token` - Verify email address
- `POST /auth/resend-verification-email` - Resend verification email

#### User APIs
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user by ID
- `GET /users/profile-status` - Get profile completion status

#### Course APIs
**File:** `components/api/coursesApi.tsx`

- `GET /courses` - Get all courses (public, with pagination)
  - Query params: `page`, `limit`
- `GET /orders/purchased-course` - Get user's purchased courses (private)
- `POST /courses/enter` - Enter/start a course (private)
  - Body: `{ courseId: string }`

#### Cart APIs
**File:** `components/api/cartApi.tsx`

- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
  - Body: `{ productId, quantity, ... }`
- `PUT /cart/:productId` - Update item quantity
  - Body: `{ quantity: number }`
- `DELETE /cart/item/:productId` - Remove specific item from cart
- `DELETE /cart` - Clear entire cart

#### Order APIs
**File:** `components/api/orderApi.tsx`

- `POST /orders/create` - Create order from cart (private)
- `GET /orders/:orderId` - Get order details (private)
- `GET /orders` - Get all user orders (private)
- `POST /orders/apply-coupon` - Apply coupon code to order
  - Body: `{ orderId: string, couponCode: string }`
- `POST /orders/initiate-razorpay` - Initiate Razorpay payment
  - Body: `{ orderId: string }`

---

## 🔐 Context Providers

### AuthContext
**File:** `components/context/authcontext.tsx`

**Features:**
- User authentication state management
- Login, register, logout functions
- Token management and refresh
- Profile completion tracking
- Menu state management

**Exports:**
- `AuthProvider` - Context provider component
- `useAuth` - Hook to access auth context

### CartContext
**File:** `components/context/cartcontext.tsx`

**Features:**
- Shopping cart state management
- Add/remove items
- Cart persistence

**Exports:**
- `CartProvider` - Context provider component
- Cart management hooks

---

## 🎨 Styling & Theming

### Global Styles
- **`app/globals.css`** - Global CSS styles
- **`styles/globals.css`** - Additional global styles

### Theme Configuration
- **Theme Provider:** `components/theme-provider.tsx`
- **Mode:** Supports dark/light/system theme switching
- **Library:** `next-themes`

### Tailwind Configuration
- **Version:** 4.1.9
- **Animations:** `tailwindcss-animate` package
- **PostCSS:** Configured via `postcss.config.mjs`

---

## 🎣 Custom Hooks

| Hook | File | Description |
|------|------|-------------|
| `use-mobile` | `hooks/use-mobile.ts` | Detect mobile device |
| `use-outside-click` | `hooks/use-outside-click.tsx` | Handle outside click events |
| `use-toast` | `hooks/use-toast.ts` | Toast notification hook |
| `useLenis` | `hooks/useLenis.tsx` | Smooth scrolling with Lenis |

---

## 🛠️ Utilities

### Auth Utilities
**File:** `utils/auth.ts`
- Token management helpers
- Request handlers
- Authentication utilities

### General Utilities
**File:** `lib/utils.ts`
- Common utility functions
- Class name merging (clsx, tailwind-merge)

---

## 📦 Key Dependencies

### Core
- `next` (14.2.16) - React framework
- `react` & `react-dom` (^18) - UI library
- `typescript` (^5) - Type safety

### UI & Styling
- `tailwindcss` (^4.1.9) - CSS framework
- `@radix-ui/*` - Headless UI primitives
- `lucide-react` - Icon library
- `@tabler/icons-react` - Additional icons
- `motion` - Animation library
- `@studio-freight/lenis` - Smooth scrolling

### Forms & Validation
- `react-hook-form` (^7.60.0) - Form handling
- `zod` (3.25.67) - Schema validation
- `@hookform/resolvers` - Form validation integration

### State & Data
- `axios` (^1.12.2) - HTTP client
- React Context API - State management

### UI Components
- `sonner` - Toast notifications
- `react-toastify` - Additional toast support
- `recharts` - Chart library
- `embla-carousel-react` - Carousel component

### Other
- `next-themes` - Theme switching
- `date-fns` - Date utilities
- `@vercel/analytics` - Analytics

---

## 🎯 Key Features

1. **Authentication System**
   - User registration and login
   - Password reset functionality
   - Email verification
   - Token-based authentication with refresh
   - Protected routes

2. **E-commerce Features**
   - Shopping cart
   - Checkout process
   - Coupon codes
   - Order management

3. **Course Management**
   - Course browsing
   - Course enrollment
   - User dashboard for enrolled courses
   - Vulcan Prep 360 section

4. **User Dashboard**
   - Course tracking
   - Test management
   - Interview preparation tools
   - Profile management

5. **Admin Panel**
   - Super admin dashboard
   - User management capabilities

6. **UI/UX**
   - Responsive design
   - Dark/light theme support
   - Smooth scrolling animations
   - Loading states (shimmer effects)
   - Toast notifications
   - Modern component library

---

## 📝 Configuration Files

- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.mjs`** - Next.js configuration
- **`postcss.config.mjs`** - PostCSS configuration
- **`components.json`** - shadcn/ui component configuration
- **`.gitignore`** - Git ignore rules

---

## 🚀 Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "next lint"          // Run ESLint
}
```

---

## 📂 Static Assets

**Location:** `public/`

### Images
- `vulcans-logo.png` - Main logo
- `hero-section.jpg/png` - Hero images
- `about.jpg` - About page image
- `learning.jpg`, `learning1.jpg` - Learning images
- `teacher.jpg` - Teacher image
- `training.jpg` - Training image
- `registration.jpg` - Registration image
- `avatar-of-a-happy-user.jpg` - User avatar placeholder
- `placeholder-logo.png/svg` - Logo placeholders
- `placeholder-user.jpg` - User placeholder
- `Privacy & Policy.png` - Policy image

---

## 🔍 Environment Setup

### API Configuration
- **Base URL:** Currently set to `http://localhost:5001/api` in `components/api/index.tsx`
- **CORS:** Configured with credentials (`withCredentials: true`)
- **Timeout:** 120 seconds

### Image Domains
Configured in `next.config.mjs`:
- `example.com`
- `cdn.example.com`

---

## 📊 Data Files

- **`data/guidance-data.json`** - Guidance section content

---

## 🎨 Design System

### Component Architecture
- Uses shadcn/ui component library
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Custom theme configuration
- Responsive mobile-first design

### Animation & Interactions
- Smooth scrolling via Lenis
- Motion animations
- Loading shimmer effects
- Toast notifications
- Carousel components

---

## 🔒 Security Features

- Token-based authentication
- Automatic token refresh
- Secure API interceptors
- Protected routes
- CSRF protection (via credentials)

---

## 📱 Responsive Design

- Mobile-first approach
- Custom `use-mobile` hook for device detection
- Responsive navigation (navbar)
- Adaptive layouts for all pages

---

## 🧪 Development Notes

- TypeScript strict mode enabled
- ESLint configured (can be ignored during builds)
- TypeScript errors can be ignored during builds (for rapid development)
- Path aliases configured: `@/*` maps to project root

---

## 📚 Next Steps & Improvements

1. Add environment variable management (`.env.local`)
2. Implement proper error boundaries
3. Add unit and integration tests
4. Set up proper API environment configuration
5. Add loading skeletons for all async operations
6. Implement proper SEO metadata
7. Add analytics tracking
8. Optimize image loading
9. Implement proper caching strategies
10. Add internationalization (i18n) if needed

---

**Last Updated:** Generated automatically  
**Project Version:** 0.1.0  
**Maintainer:** Development Team

