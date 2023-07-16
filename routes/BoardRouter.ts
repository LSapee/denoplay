import {Router,send} from 'https://deno.land/x/oak/mod.ts'
const router = new Router();

interface Myboard {
    title: string;
    post : string;
}


const kv:Deno.Kv = await Deno.openKv();
// await kv.set(key,{title:"감자",post:"감자1"});

router
    .get("/board",async (ctx)=>{
        const dataList = [];
        const result  = await kv.list({prefix:["boards"]});
        for await (const a of result){
            dataList.push(a.value);
        }
        ctx.response.body = dataList;
    });
router
    .post("/board",async (ctx)=>{

        const {value} = await ctx.request.body({type:"json"});
        const {title,post} = await value;
        const key:string[] = ["boards",crypto.randomUUID()];
        const boardData:Myboard  = {title:title,post:post};
        await kv.set(key,boardData);
        ctx.response.status = 200;
        ctx.response.body = {data : "글쓰기 성공"};
    });
router
    .delete("board",(ctx)=>{

    });
export default new Router().use("/api",router.routes(),router.allowedMethods());