# BistroBuddies Project Context

## PROJECT IDENTITY

Project name: BistroBuddies

Repository:
https://github.com/XTiaaaaan/bistrobuddies

This is an EXISTING Ionic Angular project.

IMPORTANT:
- Never recreate the project.
- Never create a new Ionic/Angular project.
- Never replace the repository with a template.
- Never initialize another Git repository.
- Preserve existing working code, branding, assets, pages and architecture.
- Inspect existing code before modifying it.
- Avoid unnecessary dependency upgrades.

## MAIN GOAL

Turn the existing BistroBuddies application into a functional coffee ecommerce system.

Customer features:
- Register/login
- Email/password authentication
- Google authentication
- Customer profile
- Homepage
- Latest coffee products
- Buy Coffee
- Product details
- Small/Medium/Large sizes
- Size-based prices
- Sugar levels
- Quantity
- Cart
- Checkout
- Customer address/contact information
- Order comments
- COD
- Online payment
- My Orders
- Real-time order status

Admin features:
- Admin login/access
- Dashboard
- Product management
- Add product
- Edit product
- Delete/deactivate product
- Product availability
- Product categories
- Size prices
- Sugar options
- Product image management
- Order management
- Payment information
- Customer management
- Order status updates

## TECHNOLOGY

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
- APK/AAB

## FIREBASE

Use Firebase Authentication and Firestore.

Authentication:
- Email/password
- Google

Firestore stores:
- users
- products
- orders
- payments

Use Firebase server timestamps where appropriate.

## FIREBASE STORAGE

DO NOT USE FIREBASE STORAGE.

Do not:
- install Firebase Storage
- configure Firebase Storage
- create a Firebase Storage bucket
- upload product images to Firebase Storage

Product images use Cloudinary.

## USER MODEL

Users should contain information such as:

- uid
- name
- email
- phone
- address
- role
- createdAt
- updatedAt

Roles may include:

- customer
- admin

Customers may edit only their own profile.

## PRODUCT MODEL

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

## ORDER MODEL

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

## ORDER STATUS

Use:

- PENDING
- CONFIRMED
- PREPARING
- READY
- COMPLETED
- CANCELLED

Customers should see status changes in real time.

## PAYMENT STATUS

Use:

- PENDING
- PAID
- FAILED
- REFUNDED

Keep payment status separate from order status.

## COD

For COD orders:

paymentMethod = COD

paymentStatus initially = PENDING

orderStatus initially = PENDING

## ONLINE PAYMENT

Online payments use PayMongo.

IMPORTANT:

The PayMongo secret key must NEVER be exposed to:

- Angular
- browser
- Capacitor
- Firestore
- GitHub

Use Vercel server/API functions.

Never trust a frontend-only payment success result.

Use server-side verification/webhooks where appropriate.

Never hardcode payment credentials.

## CLOUDINARY

Cloudinary is used for product images.

Architecture:

Admin UI
→ Vercel server/API
→ Cloudinary
→ image URL/public ID
→ Firestore

Cloudinary private credentials must remain server-side.

Never put the Cloudinary secret in Angular code.

## ADMIN SECURITY

Admin access must be enforced through authentication/authorization and security rules.

Do not rely only on hiding buttons.

Customers must not be able to:

- access admin pages/data
- edit products
- delete products
- access other customers
- access other customers' orders
- change orderStatus
- change paymentStatus
- modify trusted totals
- modify payment records
- mark online payments as paid

## CUSTOMER SECURITY

A customer may access only their own private data.

Products may be publicly readable to authenticated customers as appropriate.

Orders must be restricted by customerId.

## NAVIGATION

The existing:

"List of Products"

should become:

"Buy Coffee"

Reuse the existing navigation and BistroBuddies branding.

## DEVELOPMENT STYLE

Prefer:
- simple solutions
- reusable services
- reusable components
- TypeScript interfaces/models
- existing Ionic components
- existing project structure

Avoid:
- unnecessary libraries
- unnecessary refactoring
- unnecessary framework upgrades
- excessive animations
- unrelated features

Functionality is more important than cosmetic complexity.

## TESTING

After each development step:

- build the application
- run available tests
- run lint if available
- fix errors caused by the current step

Do not claim something works unless it was verified.

## DEVELOPMENT PROCESS

Development is intentionally divided into small steps:

1. Inspect project
2. Firebase foundation
3. Authentication
4. Customer homepage
5. Product details
6. Cart
7. Checkout/orders
8. My Orders
9. Admin products
10. Admin orders
11. Cloudinary
12. PayMongo
13. Profile
14. Security
15. UI cleanup
16. Final testing
17. Vercel
18. Capacitor/APK/AAB

Only implement the current requested step.

Do not implement future steps unless explicitly requested.

## IMPORTANT FOR OPENCODE

Keep responses short.

Do not repeatedly reread this file.

Do not rewrite working code unnecessarily.

Do not create a new project.

Do not use Firebase Storage.

Do not expose secrets.

After completing the requested step:

1. Build
2. Test
3. Fix relevant errors
4. Give a short report
5. Stop