# Code Review Notes

## General

- The project structure is clean and modular, following best practices for a modern React + TanStack + Shadcn UI + Tailwind CSS application.
- TypeScript is used throughout, with strict settings enabled for better type safety.
- API calls are abstracted in the `src/api` directory, and DTOs are generated and imported from the root `dtos.ts`.
- State management for order selection uses Zustand, which is lightweight and appropriate for this use case.

## UI/UX

- The UI leverages Shadcn components and custom utility classes for a modern ERP look.
- Responsive design is implemented in the header and footer.
- Data tables are well-abstracted and support sorting, filtering, and pagination.
- Error handling is user-friendly, with a customizable `ErrorPage` component.

## Routing

- TanStack Router is used with file-based routing in `src/routes`.
- The root route (`/`) redirects to `/customer` for a better landing experience.
- Route layouts and not-found handling are implemented in `src/routes/__root.tsx`.

## Data Fetching

- React Query is set up for data fetching and caching.
- API functions are separated by resource (`customers`, `orders`), making them easy to maintain and test.

## Suggestions

- Consider adding unit and integration tests for critical components and API functions.
- Add more documentation for custom hooks and utility functions if the codebase grows.
- If the API grows, consider using a code generator for API clients to reduce boilerplate.
- Accessibility: Review interactive elements for ARIA attributes and keyboard navigation.
- Consider adding error boundaries for unexpected runtime errors.

## Known Issues / TODOs

- Pagination for orders is implemented, but total page count is not displayed if not provided by the API.
- Filtering and searching are client-side; if the dataset grows, consider server-side filtering/searching.
- Some UI components (e.g., DataTable) could be further generalized for reuse.