import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";

export function formatTime(text: string): string {
    try {
        const crDate = new Date(text);
        const crTime = format(crDate, "dd/MM/yyyy HH:mm");
        return crTime;
    } catch (e) {
        console.log(e);
        return "Error";
    }
    }

export async function getRepoDetails(repo: string){
    const url = `https://api.github.com/repos/${repo}`;
    const response = fetch(url);
    const json = response.then((res) => res.json());
    return await json;
}