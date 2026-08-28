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
  assert.match(content, /非官方参考/);
  assert.match(content, /学生经验/);
  assert.match(explorer, /value="external"/);
});

test("detail view exposes attribution and safety notice", async () => {
  const detail = await readFile(new URL("../app/item/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(detail, /打开原始来源/);
  assert.match(detail, /最近核验/);
  assert.match(detail, /来源发布者/);
  assert.match(detail, /不是校方结论/);
  assert.match(detail, /不代替校方正式通知/);
});

test("curated external records retain source links and caution labels", async () => {
  const content = await readFile(new URL("../lib/content.ts", import.meta.url), "utf8");
  assert.match(content, /wh\.bendibao\.com\/edu\/2026820\/199907/);
  assert.match(content, /hicug\.cn\/pages\/jiaowuxitongshiyongzhinan/);
  assert.match(content, /bilibili\.com\/video\/BV1a14y1D74z/);
  assert.match(content, /sourceType: "external"/);
  assert.match(content, /validity: "possibly_invalid"/);
});

test("separates undergraduate and graduate information", async () => {
  const [explorer, undergraduate, graduate, schema] = await Promise.all([
    readFile(new URL("../app/components/HomeExplorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/undergraduate/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/graduate/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);
  assert.match(explorer, /本科生专区/);
  assert.match(explorer, /研究生专区/);
  assert.match(explorer, /<a href="\/undergraduate" className="path-card undergraduate"/);
  assert.match(explorer, /<a href="\/graduate" className="path-card graduate"/);
  assert.match(explorer, /item\.studentLevel === "both"/);
  assert.match(undergraduate, /initialLevel="undergraduate"/);
  assert.match(graduate, /initialLevel="graduate"/);
  assert.match(undergraduate, /mode="explore"/);
  assert.match(graduate, /mode="explore"/);
  assert.match(schema, /student_level/);
});

test("navigation uses real routes and information plaza has its own page", async () => {
  const [explorer, header, explore] = await Promise.all([
    readFile(new URL("../app/components/HomeExplorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/explore/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(header, /href="\/explore">信息广场/);
  assert.match(explorer, /action="\/explore" method="get"/);
  assert.match(explorer, /href={`\/explore\?category=\$\{item\.slug\}`}/);
  assert.match(explorer, /href="\/explore">查看全部信息/);
  assert.match(explore, /mode="explore"/);
  assert.match(explore, /initialQuery={query}/);
});

test("official refresh tolerates a failing source and reports warnings", async () => {
  const official = await readFile(new URL("../lib/official.ts", import.meta.url), "utf8");
  assert.match(official, /const warnings: string\[\] = \[\]/);
  assert.match(official, /warnings\.push/);
  assert.match(official, /warnings\.length === officialSources\.length/);
  assert.match(official, /sourceCount >= 12/);
  assert.match(official, /return \{ skipped: false, count, warnings \}/);
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
