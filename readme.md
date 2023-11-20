# Custom Content Management System ⚙️

![Hero Page Image](https://github.com/anav5704/custom-cms/blob/main/docs/hero.png)

This is a CMS that acts as an [admin panel](https://ecommerce-custom-cms.vercel.app/), built to manage the [E-commerce store.](https://bit-bazar.vercel.app/) The store is literally an empty shell and all of the content is assigned by the CMS. Users can create and manage stores, billboards, categories, sizes, colors, and products. Orders are automatically created when a purchase is made in the store.

## Technologies Used
- Next JS 14
- TailwindCSS
- Shadcn UI
- Clerk
- Cloudinary
- Prisma
- Serverless PostgreSQL
- Zustand
- Zod
- Stripe

## Getting Started
As per usual, fork and clone this repo and run ```npm install `` to download all the dependencies. Now set up the environment variables. The following will go in a ```.env``` in the root of your project.
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DATABASE_URL
DIRECT_URL // Use this if provided
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
STRIPE_API_KEY
FRONTEND_STORE_URL
```
