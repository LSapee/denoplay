import { Application, Context, Router, HttpError, send, Status} from "https://deno.land/x/oak/mod.ts";
import {bold, cyan, green, yellow} from "https://deno.land/std@0.192.0/fmt/colors.ts";
import BoardRouter from "./routes/BoardRouter.ts";

const app = new Application();




app.use(BoardRouter.routes());
// app.use(UserRouter.allowedMethods());

// Static Content 스태틱 파일 경로
app.use(async (context):Promise<void> => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/src/`,
        index: "static/index.html",
    });
});

const options = { hostname: "localhost", port: 3000 };

//서버 시작 문구 표시
console.log(
    bold("Start listening on ") + yellow(`${options.hostname}:${options.port}`),
);
await app.listen(options);