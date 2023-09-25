# notion-x

My customization of [NotionX's react-notion-x](https://github.com/NotionX/react-notion-x). Personal use only!

## Install

You have to [install Tailwind CSS](https://tailwindcss.com/docs/installation) in your project.

You have to clone this repo to the root `/` of your Next.js project **under the name `notion-x`**!

You have to install following packages (just copy them to your `package.json`).

```json
"dependencies": {
  "@fisch0920/medium-zoom": "^1.0.7",
  "@matejmazur/react-katex": "^3.1.3",
  "katex": "^0.16.8",
  "moment": "^2.29.4",
  "mermaid": "^10.4.0",
  "notion-client": "^6.16.0",
  "notion-types": "^6.16.0",
  "notion-utils": "^6.16.0",
  "open-graph-scraper": "^6.2.2",
  "react-copy-to-clipboard": "5.1.0",
  "react-fast-compare": "^3.2.2",
  "react-hotkeys-hook": "^4.4.1",
  "react-image": "^4.1.0",
  "react-lazy-images": "^1.1.0",
  "react-snap-carousel": "^0.3.2",
  "react-syntax-highlighter": "^15.5.0",
  "slugify": "^1.6.6",
  "swr": "^2.2.2"
},
"devDependencies": {
  "@types/react-copy-to-clipboard": "^5.0.4",
  "@types/react-syntax-highlighter": "^15.5.7"
}
```

Put in your `tsconfig.json`,

```json
"compilerOptions": {
  "paths": {
    "@/*": ["./*"],
    "@notion-x/*": ["./notion-x/*"]
  }
}
```

Put below line in `tailwind.config.ts`,

```ts
{
  content: [
    './notion-x/**/*.{js,ts,jsx,tsx,mdx,css,scss}'
  ]
}
```