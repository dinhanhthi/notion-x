# notion-x

My customization of [NotionX's react-notion-x](https://github.com/NotionX/react-notion-x). Personal use only!

## Install

You have to [install Tailwind CSS](https://tailwindcss.com/docs/installation) in your project.

Install this repo as a submodule in your project under the root folder.

```bash
npm i --g yarn
npm i -g rimraf
```

```bash
# first install only
git submodule add https://github.com/dinhanhthi/notion-x.git

# in case your repo has already added this repo as a submodule
# and this is the first time you clone your repo to local
git submodule update --init --recursive

# to update submodule
git submodule update --recursive --remote
```

You have to install the packages lised in `package.json` for both `"dependencies"` and `"devDependencies"`.

You have to have following environment variables (put them in `.env.local`),

```bash
NOTION_TOKEN = "secret_xxx"
NOTION_VERSION = "2022-06-28"
# For Unofficial Posts DB
NOTION_API_WEB = "https://www.notion.so/api/v3"
SPACE_ID = "xxx"
SOURCE_ID = "xxx"
COLLECTION_VIEW_ID = "xxx"
# "dev" or "prod"
ENV_MODE = "dev"
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

> 💡 **Tip**: You can edit the files in the submodule BUT don't commit and push it. After finishing editing, just `cd notion-x` and then `git checkout <file-path>` to discard all changes.