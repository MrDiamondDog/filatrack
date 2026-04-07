# Self Hosting

This guide will provide all the information you need to self host Filatrack. It's relatively simple!

> !NOTE
> You can host everything locally if you want- you'll only be able to access Filatrack locally (obviously)
> If you want to access Filatrack from other places, set up a reverse proxy.

## Pocketbase

The first thing to do is set up Pocketbase. This is the backend and API that Filatrack interfaces with.

I recommend following the [official Pocketbase deployment guide](https://pocketbase.io/docs/going-to-production/#deployment-strategies).

The simplest set up is simply downloading the Pocketbase executable and running `pocketbase serve`.

Once Pocketbase is running, it should open a URL for you to set up a superuser. If it doesn't, the URL should be in the console.
Sign up using whatever credentials (keep it secure) and go to settings.

### Settings

In the settings page, set the `Application Name` to whatever you want (it only shows up in emails), then set the `Application URL` to the
URL to the URL for your Pocketbase instance. (If you plan on using Filatrack not locally, then use the domain that Pocketbase will be hosted on.)

Turn on rate limiting if you wish, and make sure to set the `User IP proxy headers` if you're using Cloudflare or similar.

### Mail

If you wish to have functionality for password resets or login notifications, then go to the `Mail Settings` tab to set everything up.
You'll probably need a functioning SMTP server.

### Database setup

Download the Pocketbase schema from [here](https://raw.githubusercontent.com/MrDiamondDog/filatrack/refs/heads/overhaul/pb_schema.json)

Once you have the schema file, go to the `Import Collections` tab and click `Load from JSON file`, and upload the schema file. It will let you
look over all the changes, but you should be able to just press `Review` and `Confirm and Import`. That's it!

## Filatrack setup

There are two approaches for setting up Filatrack:

1. Docker Container (recommended)
2. From source

### Docker Container

Make sure you have docker installed and run this command to download and run the Filatrack container:

Linux:
```
docker run -d \
  --name filatrack \
  -p 3000:3000 \
  --env PB_URL="pocketbase url" \
  --env APP_URL="app url" \
  mrdiamonddog/filatrack:latest
```

Windows:
`docker run -d --name filatrack -p 3000:3000 --env PB_URL="pocketbase url" --env APP_URL="app url" mrdiamonddog/filatrack:latest`

Replace `pocketbase url` with the Pocketbase URL you plan on using, and `app url` with the URL you plan on using to access your instance!

> !WARNING
> BOTH URLs need a trailing slash! (http://example.com/ <<) 

If there are no errors, then Filatrack should be running on port 3000! Make sure your pocketbase instance is still running otherwise
you won't be able to access anything.

### From source

This is a lot harder to use than docker, but this will allow you to make your own changes as well!

1. Copy `.env.example` to `.env` and fill out the values.
2. Install dependencies: `pnpm i`
3. Build Pocketbase types: `pnpm build-types`
4. Run the development server: `pnpm dev`, or build the app (`pnpm build`) and run the build (`node .next/standalone/server.js`)
5. Your server should be accesible at port 3000!

## Authentication

Your instance is running... but you can't log in yet!

Go back to the Pocketbase dashboard and go to Collections > `users`, click the cog at the top of the screen, then the options tab.

Now, you may choose what authentication methods you'd like!

- Password authentication: Simple to set up, can only reset password in Pocketbase dashboard unless you set up email.
- OAuth authentication: Harder to set up but is easier to use.

Filatrack will update it's UI based on what you've enabled.

You can turn on the methods you want by clicking the dropdown and selecting `Enable`.

For OAuth, you'll have to get credentials from the providers you choose. Set the redirect URI to `https://[pocketbase url]/api/oauth2-redirect`.

> !NOTE
> Filatrack currently doesn't support OTP or MFA. Turning these on will not work.

That should be it! Try logging in/signing up on Filatrack.

## Help!

If you're confused at any step of the process, we're willing to help! Please visit the [Discord server](https://discord.gg/HUjRATbH2g).

> !WARNING
> PLEASE do not open an issue if you're having issues, unless you are actually reporting a bug or feature request.