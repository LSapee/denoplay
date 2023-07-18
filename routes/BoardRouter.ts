import {Router} from 'https://deno.land/x/oak/mod.ts'
const router = new Router();

interface Myboard {
    title: string;
    post : string;
    uuid : string;
}


const kv:Deno.Kv = await Deno.openKv();
// await kv.set(key,{title:"감자",post:"감자1"});
await kv.delete(["boards"]);
router
    .get("/board",async (ctx):Promise<void> =>{
        const dataList= [];
        const result  = await kv.list({prefix:["boards"]});
        for await (const a of result){
            // kv.delete(a.key);
            dataList.push(a.value);
        }
        ctx.response.body = dataList;
    });
router
    .post("/board",async (ctx):Promise<void> =>{

        const {value} = await ctx.request.body({type:"json"});
        const {title,post} = await value;
        const uuid = crypto.randomUUID();
        const key:string[] = ["boards",uuid];
        const boardData:Myboard  = {title:title,post:post,uuid:uuid};
        await kv.set(key,boardData);
        ctx.response.status = 200;
        ctx.response.body = {data : "글쓰기 성공"};
    });
router
    .delete("/board/:id",async (ctx)=>{
        const {id} = ctx.params;
        await kv.delete(["boards",id]);
        ctx.response.status = 200;
        ctx.response.body = {data : "글 삭제 완료"};
    });

router
    .get("/board/:id",async (ctx):Promise<void>=>{
        const {id} = ctx.params;
        const result = await kv.get(["boards",id]);
        // unknown타입이 아니라 Myboard 타입이라고 명시 해줌
        const post:Myboard = result.value as Myboard;
        ctx.response.status =200;
        ctx.response.body = post;
    });
export default new Router().use("/api",router.routes(),router.allowedMethods());