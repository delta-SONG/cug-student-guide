import { getChatGPTUser } from "../../../chatgpt-auth";
import { isAdmin } from "../../../../lib/security";
import { refreshOfficialSources } from "../../../../lib/official";

export async function POST(request:Request){try{const force=new URL(request.url).searchParams.get("force")==="1";if(force){const user=await getChatGPTUser();if(!user||!isAdmin(user))return Response.json({error:"无权强制刷新"},{status:403});}const result=await refreshOfficialSources(force);return Response.json(result);}catch(error){return Response.json({error:error instanceof Error?error.message:"刷新失败"},{status:503})}}
