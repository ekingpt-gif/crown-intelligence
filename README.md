# Crown Intelligence

Next.js landing site for Crown Intelligence.

## Stack
- Next.js
- Vercel-ready deployment
- API route scaffold for lead capture

## Local development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Notes

Current form submissions are captured by `/api/contact` and written locally in development. For production notifications, connect a provider like Resend and add the necessary environment variables in Vercel.
