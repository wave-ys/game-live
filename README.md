# GameLive

A live-streaming web app. Motivated by [next14-twitch-clone](https://github.com/AntonioErdeljac/next14-twitch-clone).

The difference is all third-party dependencies are set up by docker compose, so **you don't need to register accounts on
third party websites and copy secret keys!**

## How to run

1. Set up dependencies.
   ```shell
   docker compose -f ./docker-compose.development.yaml up -d
   ```
2. Run front end.
   ```shell
   pnpm i
   pnpm dev
   ```
3. Run back end.
   ```shell
   dotnet run --launch-profile https
   ```
4. Now visit [https://localhost:7076/](https://localhost:7076/) on your browser.

## License

MIT