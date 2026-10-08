# BistroBuddies Project Context

## PROJECT IDENTITY

Project name: BistroBuddies

Repository:
https://github.com/XTiaaaaan/bistrobuddies

This is an EXISTING Ionic Angular project.

IMPORTANT:
- Never recreate the project.
- Never create a new unrelated Ionic/Angular project.
- Never replace the repository with a template.
- Never initialize another Git repository.
- Preserve existing working code, branding, assets and functionality.
- Inspect existing code before modifying it.
- Avoid unnecessary dependency upgrades.

==================================================
MAIN ARCHITECTURE
==================================================

BistroBuddies has TWO SEPARATE FRONTENDS:

1. CUSTOMER MOBILE APP
2. ADMIN WEB WEBSITE

They may share:
- Firebase project
- Firebase Authentication
- Firestore
- TypeScript models
- shared backend/API services
- Cloudinary backend
- PayMongo backend

But the customer interface and admin interface must remain clearly separated.

CUSTOMER MOBILE APP:
- Customer-facing
- Designed primarily for mobile
- Packaged using Capacitor into Android APK/AAB
- Must NOT expose admin functionality

ADMIN WEB WEBSITE:
- Administrator-facing
- Designed primarily for desktop/web
- Deployed separately as a web application
- Has its own admin login
- Must NOT be part of the normal customer navigation

IMPORTANT:
Do not simply hide admin pages inside the customer UI and call that a separate admin website.

Use an appropriate separate frontend/application structure based on the existing repository.

==================================================
CUSTOMER MOBILE APP
==================================================

Customer features:

- Register
- Email/password login
- Google login
- Logout
- Homepage
- Latest coffee products
- Buy Coffee
- Product details
- Small/Medium/Large
- Sugar levels
- Quantity
- Cart
- Checkout
- Customer name
- Phone/contact number
- Address
- Order comments
- COD
- Online payment
- My Orders
- Order Details
- Real-time order status
- Customer Profile

Customers must NOT have:
- Admin Dashboard
- Admin Product Management
- Admin Order Management
- Admin Customer Management
- Admin Payment Management

==================================================
ADMIN WEB WEBSITE
==================================================

Admin website features:

- Admin Login
- Admin authentication
- Admin authorization
- Admin Dashboard
- Product Management
- Add Product
- Edit Product
- Delete/deactivate Product
- Product availability
- Product categories
- Product size prices
- Sugar options
- Product image management
- Order Management
- Customer Management
- Payment information

Admin functionality must remain in the separate Admin Web.

Do not put admin functionality into the customer mobile navigation.

==================================================
TECHNOLOGY
==================================================

Existing:
- Ionic Angular
- Angular
- TypeScript
- Capacitor

Backend/services:
- Firebase Authentication
- Firebase Firestore
- Cloudinary
- Vercel server/API functions
- PayMongo

Android:
- Capacitor
- APK
- AAB

==================================================
FIREBASE
==================================================

Use the EXISTING BistroBuddies Firebase project.

Authentication:
- Email/password
- Google

Firestore stores:
- users
- products
- orders
- payments

Use Firebase server timestamps where appropriate.

Do not create another Firebase project.

==================================================
FIREBASE STORAGE
==================================================

DO NOT USE FIREBASE STORAGE.

Do not:
- install Firebase Storage
- initialize Firebase Storage
- configure Firebase Storage
- upload product images to Firebase Storage
- create Firebase Storage upload functionality

Product images use Cloudinary.

The Firebase Web configuration may contain a storageBucket property.
This does NOT mean Firebase Storage should be initialized or used.

==================================================
USER MODEL
==================================================

Users should contain information such as:

- uid
- name
- email
- phone
- address
- role
- createdAt
- updatedAt

Roles include:

- customer
- admin

IMPORTANT:
Customers must never be able to select or change their role.

New customer registrations default to:

role = customer

The first development admin may be created by manually assigning:

role = admin

through an appropriate trusted/development process.

Do not create an admin registration option for customers.

==================================================
PRODUCT MODEL
==================================================

Products should contain:

- id
- name
- description
- category
- imageUrl
- cloudinaryPublicId
- smallPrice
- mediumPrice
- largePrice
- sugarOptions
- available
- createdAt
- updatedAt

Do not hardcode product prices in the UI.

==================================================
ORDER MODEL
==================================================

Orders must preserve purchase-time snapshots.

An order should contain:

- id
- customerId
- customerSnapshot
- addressSnapshot
- items
- subtotal
- deliveryFee
- total
- customerComment
- paymentMethod
- paymentStatus
- orderStatus
- createdAt
- updatedAt

Each order item should preserve:

- productId
- productName
- imageUrl
- size
- sugar
- quantity
- unitPrice
- subtotal

Historical orders must not depend on the current product record.

==================================================
ORDER STATUS
==================================================

Use:

- PENDING
- CONFIRMED
- PREPARING
- READY
- COMPLETED
- CANCELLED

Customers should see status changes in real time.

Only authorized admin functionality may change orderStatus.

Customers must NOT be able to change orderStatus.

==================================================
PAYMENT STATUS
==================================================

Use:

- PENDING
- PAID
- FAILED
- REFUNDED

Keep paymentStatus separate from orderStatus.

==================================================
COD
==================================================

For COD orders:

paymentMethod = COD

paymentStatus initially = PENDING

orderStatus initially = PENDING

==================================================
ONLINE PAYMENT
==================================================

Online payments use PayMongo.

IMPORTANT:

The PayMongo secret key must NEVER be exposed to:

- Angular frontend
- browser
- Capacitor
- Firestore
- GitHub
- public client-side environment variables

Use Vercel server/API functions.

Never trust a frontend-only payment success result.

Use server-side verification/webhooks where appropriate.

Use idempotency/duplicate protection where appropriate.

==================================================
CLOUDINARY
==================================================

Cloudinary is used for product images.

Architecture:

Admin Web
→ Vercel server/API
→ Cloudinary
→ image URL/public ID
→ Firestore
→ Customer Mobile App displays image

Cloudinary private credentials must remain server-side.

Never put the Cloudinary API Secret in Angular/client code.

==================================================
ADMIN SECURITY
==================================================

Admin access must be enforced through authentication and authorization.

Do not rely only on hiding buttons.

Customers must not be able to:

- access admin functionality
- create products
- edit products
- delete products
- change product prices
- change product availability
- access admin data
- change orderStatus
- change paymentStatus
- modify trusted totals
- modify payment records
- make themselves admin
- change their own role to admin

==================================================
CUSTOMER SECURITY
==================================================

A customer may access only their own private data.

Customers must not be able to:

- read another customer's profile
- edit another customer's profile
- read another customer's orders
- edit another customer's orders
- change payment status
- change order status
- modify trusted order totals

Products may be publicly readable to authenticated customers as appropriate.

==================================================
NAVIGATION
==================================================

CUSTOMER MOBILE APP:

The existing:

"List of Products"

must become:

"Buy Coffee"

Customer navigation must NOT contain admin pages.

ADMIN WEB:

Use separate admin navigation appropriate for:

- Dashboard
- Products
- Orders
- Customers
- Payments

==================================================
CAPACITOR
==================================================

Capacitor is for the CUSTOMER MOBILE APP.

The customer application should eventually be packaged as:

- Android APK
- Android AAB

The Admin Web does NOT need to be packaged as the customer Android application.

==================================================
VERCEL
==================================================

Vercel is used for:

- Admin Web deployment
- secure server/API functions where applicable

PayMongo and Cloudinary private credentials must be configured as secure server-side environment variables.

Do not commit secrets to GitHub.

==================================================
DEVELOPMENT PROCESS
==================================================

Development is divided into small steps.

Completed/previous steps:
1. Inspect project
2. Firebase foundation
3. Customer authentication
4. Customer homepage + Buy Coffee
5. Product details
6. Cart
7. Checkout + order creation
8. My Orders + realtime status

Current:
9. Separate Admin Web + Admin Product Management

Next:
10. Admin Order Management
11. Cloudinary
12. PayMongo
13. Customer Profile
14. Security Audit
15. UI Cleanup
16. Final System Testing
17. Vercel Deployment
18. Capacitor
19. Android Testing
20. APK/AAB Generation

Only implement the current requested step.

Do not implement future steps unless explicitly requested.

==================================================
DEVELOPMENT STYLE
==================================================

Prefer:

- simple solutions
- reusable services
- reusable components
- TypeScript interfaces/models
- existing Ionic components where appropriate
- existing architecture where practical

Avoid:

- unnecessary libraries
- unnecessary framework upgrades
- unnecessary refactoring
- excessive animations
- unrelated features

Functionality and security are more important than cosmetic complexity.

==================================================
TESTING
==================================================

After each development step:

- build affected application(s)
- run existing tests if available
- run lint if configured
- fix errors caused by the current step

Do not claim something works unless it was verified.

==================================================
IMPORTANT FOR OPENCODE
==================================================

Keep responses short.

Do not repeatedly reread large project documentation unnecessarily.

Do not rewrite working code unnecessarily.

Do not create a new unrelated project.

Do not use Firebase Storage.

Do not expose secrets.

Do not put PayMongo secrets in frontend code.

Do not put Cloudinary secrets in frontend code.

Do not allow customers to become admins.

Keep CUSTOMER MOBILE APP and ADMIN WEB WEBSITE separated.

When a step is complete:

1. Build
2. Test
3. Fix relevant errors
4. Give a short report
5. Stop

Do not automatically continue to the next step.