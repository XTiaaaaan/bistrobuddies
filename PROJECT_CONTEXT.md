# BistroBuddies --- Master OpenCode Plan

Repository: https://github.com/XTiaaaaan/bistrobuddies

Firebase Storage is NOT used. Firebase is used for Authentication and
Firestore. Cloudinary is used for product images. Vercel hosts the web
app and server-side API functions. PayMongo handles online payments.

## Non-negotiable

-   Extend the existing repository; never create a new Ionic/Angular
    project.
-   Inspect before modifying.
-   Preserve existing pages, assets, branding, and working
    functionality.
-   Do not initialize another Git repository.
-   Do not unnecessarily upgrade major dependencies.
-   Never expose PayMongo or Cloudinary secrets in frontend code,
    GitHub, Firestore, or Capacitor.
-   Enforce security in Firebase rules/backend, not only in the UI.
-   Build/test after every group.
-   Implement only the assigned group, then stop.

## Architecture

Customer Ionic Angular app -\> Firebase Auth + Firestore + Vercel API +
Cloudinary CDN + PayMongo. Admin is part of the same application, with
protected admin routes. Firebase Storage is completely excluded.

## Manual setup order

1.  Clone repository and run the existing app.
2.  Make a backup branch.
3.  Create/use the Firebase project and existing web app.
4.  Enable Email/Password and Google Authentication.
5.  Create/use Firestore; choose its location carefully.
6.  Do NOT enable Firebase Storage.
7.  Create Cloudinary Free account when Group 5 begins.
8.  Create PayMongo test account/keys when Group 4 begins.
9.  Connect the existing GitHub repo to Vercel in Group 8.
10. Configure Capacitor/Android only after web deployment is stable.

## Git

git clone https://github.com/XTiaaaaan/bistrobuddies.git cd
bistrobuddies npm install ionic serve git checkout -b
backup-before-ecommerce git push -u origin backup-before-ecommerce git
checkout -b ecommerce-development git push -u origin
ecommerce-development

## Required first OpenCode prompt

Read PROJECT_CONTEXT.md first. Inspect the existing repository
completely, including package.json, src/app, routes, pages, services,
assets, Firebase configuration, Capacitor configuration, environments,
tests, and Git state. Do not modify anything. Explain what already works
and the safest integration plan for the ecommerce requirements. Do not
create/delete files, install dependencies, or recreate the project. Stop
after inspection.

## Group 1 --- Firebase/Firestore foundation

Manual: confirm Firebase web app already exists; enable Email/Password
and Google; create/use Firestore; do not enable Storage.

Prompt: Read PROJECT_CONTEXT.md. Continue from the existing
BistroBuddies repository. Implement Firebase initialization, Firestore
services, TypeScript models, users/products/orders/payments structures,
admin authorization foundation, timestamps, and initial Firestore
security rules. Product model must include imageUrl and optional
cloudinaryPublicId. DO NOT use or configure Firebase Storage. Do not
implement Cloudinary, PayMongo, cart, checkout, or full admin UI.
Preserve existing architecture. Build/test/fix. Report changes, tests,
manual setup, issues, then stop.

## Group 2 --- Auth/Home/Buy Coffee

Manual: verify Email/Password and Google providers. Test registration,
login, Google login, logout, forgot password, and user profile creation.

Prompt: Read PROJECT_CONTEXT.md. Continue current state. Implement
email/password auth, Google Firebase Auth, logout, forgot password, auth
guards, user profile creation/update, and authenticated state. Turn the
existing dashboard into the customer homepage. Show latest products from
Firestore sorted by createdAt descending with loading/empty/error
states. Rename List of Products to Buy Coffee. Show product cards with
imageUrl, name, description, starting price, availability. Do not
implement cart, checkout, PayMongo, Cloudinary upload, or admin UI.
Build/test/fix and stop.

## Group 3 --- Product/Cart/Checkout

Manual: ensure products exist in Firestore.

Prompt: Read PROJECT_CONTEXT.md. Implement product details,
Small/Medium/Large selection, dynamic size pricing, sugar options,
quantity, cart add/edit/remove/clear, checkout, saved customer
information, editable checkout information, address, customer comment,
subtotal, delivery fee, total, and COD/Online selection. Create secure
order records with purchase-time product snapshots, customer/address
snapshots, totals, payment method, statuses, timestamps. COD starts
unpaid/pending; Online starts pending. Prevent duplicate submissions and
client changes to trusted totals/orderStatus/paymentStatus/payment
records. Do not integrate PayMongo or Cloudinary yet. Build/test/fix and
stop.

## Group 4 --- PayMongo

Manual: create PayMongo test account. Never paste the secret into
OpenCode chat. Keep it server-side.

Prompt: Read PROJECT_CONTEXT.md. Implement secure PayMongo integration
using Vercel/server-side functions. Never expose PAYMONGO_SECRET_KEY to
Angular/Ionic/browser/Capacitor/Firestore/GitHub. Implement server-side
payment creation, payment records, status handling, secure/idempotent
webhook processing, failure/cancel handling, duplicate prevention, and
trusted order updates. Do not trust frontend payment-success flags. Keep
COD working. Document exact environment variable names and webhook
endpoint. Use test mode. Build/test/fix and stop.

## Group 5 --- Admin + Cloudinary

Manual: create Cloudinary Free account. It currently has no credit-card
requirement and 25 monthly credits shared across storage, image
bandwidth, and transformations. Keep API Secret private.

Prompt: Read PROJECT_CONTEXT.md. Implement protected admin dashboard,
product CRUD, availability, categories, prices, sugar options,
Cloudinary product-image upload/preview/replacement, order management,
customer management, payment visibility, and real-time customer order
status. DO NOT use Firebase Storage. Product image flow must be Admin UI
-\> secure Vercel API -\> Cloudinary -\> image URL/public ID -\>
Firestore. Keep Cloudinary API Secret server-side. Prefer
signed/server-side uploads. Preserve historical order snapshots.
Customers cannot change trusted order/payment fields. Build/test/fix and
stop.

## Group 6 --- Orders/Profile/Search

Prompt: Read PROJECT_CONTEXT.md. Implement My Orders, order details,
profile editing, saved addresses, default address, admin customer
management, product/order search/filter/sort, and availability handling.
Preserve historical purchase-time product information and prices.
Build/test/fix and stop.

## Group 7 --- Polish/Security

Prompt: Read PROJECT_CONTEXT.md. Polish responsive customer/admin UI and
add loading/empty/error states. Audit Firebase Auth, Firestore rules,
admin authorization, Vercel APIs, Cloudinary credentials/uploads,
PayMongo secrets/webhooks, duplicate prevention, trusted totals,
orderStatus/paymentStatus, and customer data isolation. Search the
repository for secrets. Run build/tests/lint if available and fix
errors. Stop.

## Group 8 --- Vercel/Capacitor/Release

Manual: connect the existing GitHub repo to Vercel; configure
environment variables; use Secret type for private credentials; add the
production Vercel domain to Firebase Auth authorized domains; configure
PayMongo webhook; verify Cloudinary; inspect Capacitor before changing
app ID; prepare Android debug APK/release APK/AAB; never commit
keystores.

Prompt: Read PROJECT_CONTEXT.md. Perform final production integration
and release preparation. Verify build, Vercel environment variables,
Firebase authorized domains, Google login, Cloudinary production
upload/delivery, PayMongo webhook, Capacitor app ID/name, Android
sync/build, external payment redirect, mobile back button, keyboard,
network errors, and end-to-end customer/admin flows. Prepare debug APK
and release APK/AAB. Do not commit credentials or keystores. Fix
release-blocking issues. Create concise deployment documentation and
stop.

## Final test

Customer: login -\> homepage -\> latest product -\> Buy Coffee -\>
product -\> size -\> sugar -\> quantity -\> cart -\> checkout -\>
comment -\> COD/Online -\> order -\> My Orders -\> status update.

Admin: login -\> dashboard -\> products -\> Cloudinary image upload -\>
orders -\> payment visibility -\> change status -\> customer sees
real-time status.

Security: customer must not access admin data, another customer's order,
product modification, orderStatus/paymentStatus/trusted total
modification, payment confirmation, or self-admin escalation.

## Definition of done

Working customer ecommerce, Google/email auth, profiles, Buy Coffee,
products, sizes, sugar, cart, checkout, comments, addresses, COD, secure
PayMongo, payment records, orders/history, real-time status, admin
dashboard, Cloudinary images, availability, order/customer/payment
management, Firestore rules, Vercel deployment, Capacitor Android
readiness, APK/AAB readiness, and end-to-end tests.

Firebase Storage must remain unused.
