# CRUK technical exercise (React)

**Live demo:** https://avira-react-exercise.vercel.app

## How to run

- `npm install`, then `npm run dev` and open http://localhost:3000
- `npm run test` runs the Playwright tests (Chromium and Mobile Safari). The NASA API is mocked, so tests don't depend on the live service.

## What I built
1. A search form using the CRUK Library's `TextField` and `Select` components, also used  React Hook Form and Zod, with the exact validation messages from the README.
2. The search sends the form values to the NASA API and requests only the first 10 results (`page_size=10`).
3. Results are shown as a list of cards(MediaCards component), it has thumbnail, title and date. with loading, empty and error states.
4. Clicking a card opens a CRUK `Modal` with a larger image, a video player or an audio player. And user will be able to read the description.

## Key decisions I made
- **Modal instead of inline players:** showing every video and audio player in the list would load lots of media up front. With a modal, media loads only when the user opens an item. And this will also avoid too much scroll.
- **Year start:** I check that it contains only digits before converting it, used regex to achieve it. 
Figured out a contradiction in the Readme file -> The Readme  says "min 1900" but the message says "after 1900"; I treated 1900 as allowed, to match "max current year", which is also inclusive. Made sure that an empty year is left out of the search.
- **Build:** `next export` was removed in Next 14, so I replaced it with `output: 'export'` in `next.config.js`, which keeps the starter's static-site approach.

## Challenges and solutions

### Loading media files reliably (the most difficult one)

**Problem:** Each search result includes a link to a list of its media files
(`collection.json` on `images-assets.nasa.gov`). Fetching that list from the
browser worked for some items but failed for others. For example, a video's
list loaded while an image's list was blocked, and the same request worked one
time and failed the next.

**Cause:** Browsers only let a website read data from another website if that
site explicitly allows it (a security rule called CORS). NASA's file host
doesn't always send that permission, so the browser was sometimes blocking the
response.

**Solution:** I fetch the file list from NASA's asset API instead
(`https://images-api.nasa.gov/asset/{nasa_id}`). It returns the same files and
always allows browser requests. From that list, the app picks a web-sized
version (for example `~mobile.mp4` instead of the original, which can be
too larger to load) and switches the link to `https`. 

### Text typed before the page was ready was lost
Playwright tests were flaky: a value typed into the form sometimes disappeared. 
Identified that the page is visible before React  finished loading, and this caused React Hook Form to reset the fields when it loads, this wiped anything typed earlier. Real users on slow devices would lose their input too. I keep the fields disabled until the form is ready; Playwright then waits automatically.

### Linting
The project's lint command (`npm run lint`) didn't work out of the box: it relies on a package that isn't installed. When I tried installing it, it needed more setup and then flagged existing issues in the setup files, which would also have stopped the build. Rather than spend the time fixing the starter's setup, I kept my changes focused and used Prettier (npx prettier --write src) for formatting and the TypeScript compiler (`npx tsc --noEmit`) to catch errors instead.

### Very large media files
NASA lists the original files first, and they can be huge (one video was 168 MB). The modal picks a web-sized version in order of preference (for example `~mobile.mp4`, about 3 MB) and switches links to `https`.

## Testing
Added 13 Playwright tests with a mocked NASA API. The test covers: 
1. the validation messages
2. the search request
2. results for each media type
3. the empty state
4. the modal, and an accessibility (axe) check on the home page.


## With more time
1. Pagination using NASA's `page` parameter and total number of hits
2. Fix the lint setup properly
3. Will fix `npm audit`  critical dependency findings in the npm packages
4. More tests: error states, closing the modal with Esc, mobile layout
5. Upgrade to CRUK React Components v7 using their migration guide
6. Reduce search retries to one (React Query retries three times by default, delaying errors; the modal already uses one retry)

 

## Task details

- We will be testing your ability to understand an existing React/Typescript codebase, find what is already built, and what is not.
- You will be building a form using the CRUK React Component Library controlled by ReactHookForm which uses a Zod validation schema.
- This form which will fetch items from the NASA Library API. The "Form fields" section below describes the fields and their validation which should modify the search query.
- The media returned should be displayed in list below the form, these may be images, video, or audio clips. It is up to you how you display these
- The user should only see the first 10 items on the page. If you have time enabling pagination is a stretch target.
- Code must be clean and production ready, quality is better than quantity.
- You can test your application with Playwright, see src/test folder for example tests and see all the scripts available in the package.json
- Feel free to edit this readme or add a new readme file for any additional information, such as what you might do improve your application in the future.
- Please do not attempt to push to this repo, please create your own fork.

## Tools to be used

- NextJS (server) https://nextjs.org/docs
- NASA Images and Video Library API https://api.nasa.gov/
- CRUK React Component Library Storybook site: https://master.d28a8la187lo73.amplifyapp.com/
- CRUK React Component Library Package: https://www.npmjs.com/package/@cruk/cruk-react-components
- Styled Components (what the CRUK Component Library was built with) https://styled-components.com/docs
- React Hook Form (forms): https://react-hook-form.com/
- Zod (validation) https://zod.dev/

## Form fields

This form has 3 fields and error messages should appear below each field.

### Keywords field

| Attribute | Value    |
| :-------- | :------- |
| Label     | Keywords |
| Name      | keywords |
| Required  | true     |
| Type      | text     |
| Default   | ""       |

### Keywords validation

| Type       | Value | Message                                     |
| :--------- | :---- | :------------------------------------------ |
| min length | 2     | "keywords must have at least 2 characters." |
| max length | 50    | "keywords must have at most 50 characters." |

An error message should appear below the field

### Media type field

| Attribute | Value                       |
| :-------- | :-------------------------- |
| Label     | Media type                  |
| Name      | mediaType                   |
| Required  | true                        |
| Type      | select                      |
| Values    | [“audio”, “video”, “image”] |
| Default   | ""                          |

### Media types validation

| Type     | Value             | Message                       |
| :------- | :---------------- | :---------------------------- |
| if unset | null or undefined | "Please select a media type." |

### Year start field

| Attribute | Value      |
| :-------- | :--------- |
| Label     | Year start |
| Name      | yearStart  |
| Required  | false      |
| Type      | text       |
| Default   | ""         |

### Year start validation

| Type        | Value                  | Message                                 |
| :---------- | :--------------------- | :-------------------------------------- |
| number type | any non digit charater | "Please enter a valid number."          |
| min         | 1900                   | "Year start must be after 1900."        |
| max         | current year           | "Year start must not be in the future." |

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view your application.

The page auto-updates as you edit the files.

## Testing

To test your code run:

```bash
npm run test:debug
```

This will open up a browser window to show you your test in action
The page will auto-update as you edit files.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
