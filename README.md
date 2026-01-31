# Filatrack

A super-duper simple way to track your 3d printing filament!

![image](/public/app_example.png)

Made with Next.JS, Auth.JS, Drizzle ORM, and Supabase!

Join the [Discord server](https://filatrack.app/discord) for more info and feature requests!

## Bugs

There definitely are bugs. Please report bugs in the issues on this repo instead of Discord.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for info on how to set up your development enviornment, or join the Discord!

## Self-Hosting

Filatrack is fully self-hostable through Docker!

- `git clone https://github.com/MrDiamondDog/filatrack`
- `docker build -t filatrack .`
- `docker run -p 3000:3000 filatrack`
- http://localhost:3000/

You'll also need to set up the Pocketbase instance to go with it. Set it up [here](https://pocketbase.io/docs/going-to-production/),
then make sure to set up the .env.

## Star History

<a href="https://www.star-history.com/#mrdiamonddog/filatrack&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mrdiamonddog/filatrack&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mrdiamonddog/filatrack&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mrdiamonddog/filatrack&type=Date" />
 </picture>
</a>