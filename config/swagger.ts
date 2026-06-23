import swaggerJSDoc from 'swagger-jsdoc';

// Centralized OpenAPI definition. Tags map 1:1 to subdomains (Shared / Surgery
// / Emergency today) so adding a future subdomain just means adding a new tag
// and a new `apis` glob entry below — no restructuring of this file needed.
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Doctar Backend API',
    version: '1.0.0',
    description:
      'API for doctar.in and its subdomains (surgery.doctar.in, emergency.doctar.in, ' +
      'more to come). Routes are grouped by tag: Shared (used by every subdomain), ' +
      'Surgery, and Emergency.\n\n' +
      '⚠️ Known gap: none of the write endpoints (POST/PUT/DELETE) below have ' +
      'server-side admin authentication wired in yet. `middleware/adminAuth.ts` ' +
      'exists as scaffolding but is not applied to any route. Anyone who can reach ' +
      'this API can currently create/update/delete data. This is tracked as a ' +
      'follow-up task and is not yet fixed — endpoints affected are marked ' +
      '"⚠️ No write auth" in their description below.',
  },
  servers: [
    { url: '/', description: 'Current host' },
  ],
  tags: [
    { name: 'Shared', description: 'Used by every subdomain (Blog, Upload, City, DoctorClaim, etc.)' },
    { name: 'Surgery', description: 'surgery.doctar.in resources' },
    { name: 'Emergency', description: 'emergency.doctar.in resources' },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './backend/routes/shared/*.ts',
    './backend/routes/surgery/*.ts',
    './backend/routes/emergency/*.ts',
    // compiled output, so docs still work when running from dist-server in production
    './backend/dist-server/routes/shared/*.js',
    './backend/dist-server/routes/surgery/*.js',
    './backend/dist-server/routes/emergency/*.js',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
