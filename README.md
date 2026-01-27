# Arboretum

![Three abstract shapes side-by-side of different shades of green to represent trees and other plants in an arboretum next to the word "Arboretum" in black against a white background](./arboretum-banner.png)

Arboretum is a web-tool for introductory CS environments that makes authoring accessible data structures low-barrier by supporting common specification languages. Arboretum translates these diagrams and operationalizes our principles into three nonvisual output representations---tabular, navigable, and tactile.

- [Try Arboretum](https://g.riteshkanchi.com/chi26-arboretum/demo)
- [Try an Array in Arboretum](https://g.riteshkanchi.com/chi26-arboretum/array-outputs)
- [Try a Binary Tree in Arboretum](https://g.riteshkanchi.com/chi26-arboretum/tree-outputs)

## Paper

The paper associated with this project can be found at [g.riteshkanchi.com/chi26-arboretum](https://g.riteshkanchi.com/chi26-arboretum).

## Development Details

The study and paper attached to this artifact were built with Node v22.18.0 and npm 10.9.3. Development was tested with the Safari and Chrome browsers on the macOS operating system.

## Environmental Variables

Make sure you set the following environment variables in a `.env.local` file in the root directory:

```
NEXT_PUBLIC_DOMAIN_URL=[the domain URL where your app is hosted, e.g. http://localhost:3000 for local development]
```

This is used to construct absolute URLs for sharing links, updating the current URL, and embedding.

## Building Arboretum

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This project uses Next.js version 15, which requires a minimum Node.js version of 18.18.0.

First, install the dependencies:

```bash
npm ci
```

### Development

To run the development server:

```bash
npm run dev
```

### Production

To build the application for production:

```bash
npm run build
```

To start the production server (after building):

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start using Arboretum.
