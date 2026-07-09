# Industrial con J

Production-ready podcast platform for **Industrial con J** built with **Next.js App Router**, **TypeScript strict mode**, **Tailwind CSS**, **PostgreSQL**, **Prisma**, and **JWT + bcrypt** admin authentication.

## Stack

- Next.js 15.5.2
- React 19.1.1
- Tailwind CSS 4.1.12
- Prisma 6.15.0
- PostgreSQL
- JWT auth with `jsonwebtoken`
- Password hashing with `bcrypt`
- Local uploads with a cloud-scalable abstraction point

## Features

- Modern marketing-style home page with hero, featured clips, latest episodes, sponsors, recommended episodes, and social CTA
- Episode detail pages with embedded players, timestamps, external platform links, resources, guests, sponsor association, and related episodes
- Guest directory and guest profile pages
- Sponsor showcase grid
- Community surveys and contests with conditional questions and duplicate-response protection
- Global search with guest, topic, and industry filters
- Secure admin dashboard with CRUD for episodes, guests, sponsors, and surveys
- Image upload endpoint usable from the admin forms

## Project Structure

```text
industrial-con-j/
├── app/
│   ├── admin/
│   │   ├── (protected)/
│   │   │   ├── episodes/[id]/page.tsx
│   │   │   ├── episodes/new/page.tsx
│   │   │   ├── guests/[id]/page.tsx
│   │   │   ├── guests/new/page.tsx
│   │   │   ├── sponsors/[id]/page.tsx
│   │   │   ├── sponsors/new/page.tsx
│   │   │   ├── surveys/[id]/page.tsx
│   │   │   ├── surveys/new/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── login/page.tsx
│   ├── api/
│   │   ├── admin/
│   │   ├── auth/login/
│   │   ├── episodes/
│   │   ├── guests/
│   │   ├── search/
│   │   ├── sponsors/
│   │   └── surveys/[id]/respond/
│   ├── community/page.tsx
│   ├── episodes/[slug]/page.tsx
│   ├── episodes/page.tsx
│   ├── guests/[slug]/page.tsx
│   ├── guests/page.tsx
│   ├── search/page.tsx
│   ├── sponsors/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   ├── forms/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── queries.ts
│   ├── utils.ts
│   └── validation.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/uploads/
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Prisma Models

Core models implemented in [`prisma/schema.prisma`](./prisma/schema.prisma):

- `Episode`
- `Guest`
- `Sponsor`
- `Survey`
- `SurveyQuestion`
- `SurveyResponse`
- `SurveyAnswer`
- `AdminUser`

Relationships:

- `Episode <-> Guest`: many-to-many
- `Episode -> Sponsor`: optional many-to-one
- `Survey -> Episode`: optional many-to-one
- `Survey -> SurveyQuestion`: one-to-many
- `Survey -> SurveyResponse`: one-to-many

## API Routes

Public routes:

- `GET /api/episodes`
- `GET /api/episodes/[slug]`
- `GET /api/guests`
- `GET /api/guests/[slug]`
- `GET /api/sponsors`
- `GET /api/search?q=&guest=&tag=&industry=`
- `POST /api/surveys/[id]/respond`

Admin routes:

- `POST /api/auth/login`
- `POST /api/admin/episodes`
- `PATCH /api/admin/episodes/[id]`
- `DELETE /api/admin/episodes/[id]`
- `POST /api/admin/guests`
- `PATCH /api/admin/guests/[id]`
- `DELETE /api/admin/guests/[id]`
- `POST /api/admin/sponsors`
- `PATCH /api/admin/sponsors/[id]`
- `DELETE /api/admin/sponsors/[id]`
- `POST /api/admin/surveys`
- `PATCH /api/admin/surveys/[id]`
- `DELETE /api/admin/surveys/[id]`
- `POST /api/admin/uploads`

## Environment Variables

Copy `.env.example` to `.env` and fill in secure values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/industrial_con_j?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
ADMIN_LOGIN_EMAIL="ignacio.alarcon.s@uchile.cl"
ADMIN_LOGIN_PASSWORD="12345678"
ADMIN_SEED_EMAIL="admin@industrialconj.com"
ADMIN_SEED_PASSWORD="change-this-before-seeding"
UPLOAD_DIR="./public/uploads"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY=""
FORM_EMAIL_TO="vinculacion.dii@uchile.cl"
FORM_EMAIL_FROM="Industrial con J <contacto@dominio-verificado.cl>"
```

`FORM_EMAIL_TO` defaults to `vinculacion.dii@uchile.cl`. `FORM_EMAIL_FROM` must use a domain verified in Resend. Contact and donation forms are sent only to `FORM_EMAIL_TO`; quote requests from TienDIIta are sent to `cein@cein.cl` with a copy to the configured quote email, or `FORM_EMAIL_TO` when no quote email is configured. All forms use the visitor's email as `Reply-To`; without `RESEND_API_KEY`, requests are still stored as contact messages.

## Local Setup

1. Clone the repository:

```bash
git clone <your-github-repo-url>
cd industrial-con-j
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Create the PostgreSQL database:

```sql
CREATE DATABASE industrial_con_j;
```

5. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

6. Generate Prisma Client:

```bash
npx prisma generate
```

7. Seed the initial admin user and sample content:

```bash
npx prisma db seed
```

8. Start the development server:

```bash
npm run dev
```

9. Open the app:

```text
http://localhost:3000
```

10. Open the admin panel:

```text
http://localhost:3000/admin/login
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:migrate`
- `npm run prisma:generate`
- `npm run prisma:seed`

## Notes

- Secrets are environment-driven. No credentials are hardcoded.
- Uploads currently store to `public/uploads` and can be swapped for S3, Cloudinary, or another provider behind the same admin form flow.
- The recommendation engine currently uses shared tags. It is easy to replace with a richer relevance service later.
- The data model and auth layer leave room for future memberships and external platform integrations.
