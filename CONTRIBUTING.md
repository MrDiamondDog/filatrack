# Contributing

> [!WARNING]
> Filatrack is currently undergoing a major overhaul. Many things you would make PRs for are already being worked on.
> If you have something you want to PR, please let me know in the Discord first!

Thank you for your interest in contributing to Filatrack! Please follow this guide before making your first pull request.

## Guidelines

We follow a strict set of guidelines for PRs to Filatrack. If you do not follow these guidelines, your PR will not be accepted.

- **No AI**. AI code will not be of any use, and especially if the whole PR is AI-generated. Trust me, I can tell.
- Code should be self-explanatory, or commented otherwise. Overusing comments is a sign that your code isn't readable.
- Be open to code review. Your PR likely won't be accepted on the first pass, so expect some feedback! No one is perfect.

## Dev enviornment

Make a copy of `.env.example` named `.env`, and fill out all of the values.

Start with the Next.JS app:

- `pnpm i`
- `pnpm dev`

You'll need to set up a Pocketbase instance for anything to work.

- Download the pocketbase exe from https://pocketbase.io/docs/
- Place it in the Filatrack folder, then run `pocketbase serve`.
- It should open a browser with a superuser sign up. Put in whatever info you want, this is a local instance.
- Go to Settings > Import Collections, and import the `pb_schema.json`.
- Go to the `users` collection and set up Google and/or GitHub OAuth.
- Run `pnpm dlx pocketbase-typegen --json pb_schema.json` to generate Typescript types.