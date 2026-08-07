import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("public home contains the guide, search and source labels", async () => {
  const [explorer, content] = await Promise.all([
    readFile(new URL("../app/components/HomeExplorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/content.ts", import.meta.url), "utf8"),
  ]);
  assert.match(explorer, /地大指南|校园信息/);
  assert.match(explorer, /搜索课程、社团、竞赛或升学信息/);
  assert.match(content, /官方渠道/);
  assert.match(content, /校内组织/);
  assert.match(content, /学生经验/);
});

test("detail view exposes attribution and safety notice", async () => {
  const detail = await readFile(new URL("../app/item/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(detail, /打开原始来源/);
  assert.match(detail, /最近核验/);
  assert.match(detail, /不代替校方正式通知/);
});

test("removes starter assets and includes the social card", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page + layout + packageJson, /_sites-preview|codex-preview|react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
  await access(new URL("public/og.png", root));
});
