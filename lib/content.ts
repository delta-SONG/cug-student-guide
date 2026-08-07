export type SourceType = "official" | "campus_org" | "student";

export type ContentItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  audience: string;
  campus?: string | null;
  college?: string | null;
  sourceType: SourceType;
  sourceName: string;
  sourceUrl?: string | null;
  sourcePublishedAt?: string | null;
  checkedAt?: string | null;
  deadlineAt?: string | null;
  validity?: "active" | "expired" | "possibly_invalid";
};

export const categories = [
  { slug: "course", label: "选课与课程", mark: "课", description: "培养方案、选课通知与真实课程体验" },
  { slug: "club", label: "社团", mark: "社", description: "校级社团入口、招新与活动" },
  { slug: "student-union", label: "学生会", mark: "会", description: "校院学生组织与权益服务" },
  { slug: "activity", label: "校园活动", mark: "活", description: "讲座、志愿服务与文体活动" },
  { slug: "competition", label: "竞赛报名", mark: "赛", description: "报名通知、资格与截止日期" },
  { slug: "tutoring", label: "竞赛辅导", mark: "辅", description: "备赛经验、组队与训练资源" },
  { slug: "postgraduate", label: "保研", mark: "保", description: "推免政策、夏令营与经验" },
  { slug: "abroad", label: "留学", mark: "留", description: "交换、公派与国际合作项目" },
  { slug: "exam", label: "考研", mark: "研", description: "研招政策、宣讲与备考信息" },
] as const;

export const sourceLabels: Record<SourceType, string> = {
  official: "官方渠道",
  campus_org: "校内组织",
  student: "学生经验",
};

export const seedItems: ContentItem[] = [
  {
    id: "graduate-registration-2026",
    category: "exam",
    title: "2026年秋季学期研究生注册安排",
    summary: "研究生院已公布线上注册时间与培养单位审核流程，请按通知要求及时完成。",
    body: "本条为校方通知索引。具体注册对象、时间、审核步骤及特殊情况办理方式，请以研究生院原文为准。",
    audience: "全体研究生",
    campus: "全校",
    sourceType: "official",
    sourceName: "中国地质大学（武汉）研究生院",
    sourceUrl: "https://graduate.cug.edu.cn/",
    sourcePublishedAt: "2026-07-23",
    checkedAt: "2026-08-07",
    deadlineAt: "2026-08-30T22:00:00+08:00",
  },
  {
    id: "graduate-open-day-2026",
    category: "postgraduate",
    title: "第十二届研招校园开放日活动安排",
    summary: "研究生院汇总各招生单位开放日方案与报名入口，适合关注推免和研究生培养的同学查阅。",
    body: "活动报名已结束，页面保留为后续准备参考。各学院具体安排、申请材料和录取政策以原通知为准。",
    audience: "有推免或考研意向的学生",
    sourceType: "official",
    sourceName: "中国地质大学（武汉）研究生院",
    sourceUrl: "https://graduate.cug.edu.cn/",
    sourcePublishedAt: "2026-06-23",
    checkedAt: "2026-08-07",
    deadlineAt: "2026-06-30T17:00:00+08:00",
    validity: "expired",
  },
  {
    id: "graduate-design-competition-2026",
    category: "competition",
    title: "研究生“美丽中国”创新设计大赛校内选拔",
    summary: "研究生院发布校内选拔通知，正文包含赛道说明、参赛要求与校赛安排。",
    body: "请通过原文确认最新报名节点、作品规范和承办单位联系方式。本平台不代替官方报名系统。",
    audience: "在校研究生",
    sourceType: "official",
    sourceName: "中国地质大学（武汉）研究生院",
    sourceUrl: "https://graduate.cug.edu.cn/",
    sourcePublishedAt: "2026-07-06",
    checkedAt: "2026-08-07",
  },
  {
    id: "undergraduate-course-policy",
    category: "course",
    title: "本科课程修读与选课官方入口",
    summary: "集中查看选课通知、课程修读管理、专业目录、通选课专题网与教务办事指南。",
    body: "选课轮次、容量调整、退补选和学分认定可能随学期变化。请优先查看教务处最新通知，并在学校信息门户完成实际操作。",
    audience: "本科生",
    sourceType: "official",
    sourceName: "中国地质大学（武汉）教务处",
    sourceUrl: "https://jwc.cug.edu.cn/",
    checkedAt: "2026-08-07",
  },
  {
    id: "cug-club-federation",
    category: "club",
    title: "大学生社团联合会与社团事务入口",
    summary: "校团委公开的社团管理与服务组织入口，可查询社团工作和相关通知。",
    body: "社团招新与活动信息可能由各社团另行发布。加入前建议核对主办方、地点、费用与校内审批情况。",
    audience: "全体学生",
    sourceType: "campus_org",
    sourceName: "共青团中国地质大学（武汉）委员会",
    sourceUrl: "https://youth.cug.edu.cn/txzz/dxsstlhh.htm",
    checkedAt: "2026-08-07",
  },
  {
    id: "cug-student-union",
    category: "student-union",
    title: "校学生会组织与服务信息",
    summary: "查看校学生会组织体系、权益服务、成长服务与校园活动相关信息。",
    body: "校学生会在校团委指导下开展学生服务。各学院学生会信息请继续通过对应学院官方渠道核验。",
    audience: "全体学生",
    sourceType: "campus_org",
    sourceName: "中国地质大学（武汉）学生会",
    sourceUrl: "https://youth.cug.edu.cn/txzz/xxsh.htm",
    checkedAt: "2026-08-07",
  },
  {
    id: "cug-youth-activities",
    category: "activity",
    title: "校团委校园活动与实践通知",
    summary: "汇总社会实践、志愿服务、校园文化与学生组织活动的官方公告入口。",
    body: "活动时间与报名对象以每篇通知为准。对来源不明的群聊、收费和代报名信息保持谨慎。",
    audience: "全体学生",
    sourceType: "official",
    sourceName: "共青团中国地质大学（武汉）委员会",
    sourceUrl: "https://youth.cug.edu.cn/",
    checkedAt: "2026-08-07",
  },
  {
    id: "cug-international-cooperation",
    category: "abroad",
    title: "校际交流与国际合作官方入口",
    summary: "查看国际合作处发布的校际交流、国际项目与涉外事务通知。",
    body: "留学项目涉及学分、费用、签证和培养方案时，请同时向所在学院与国际合作处确认，不以学生经验替代正式政策。",
    audience: "有交换或留学意向的学生",
    sourceType: "official",
    sourceName: "中国地质大学（武汉）国际合作处",
    sourceUrl: "https://gjhzc.cug.edu.cn/",
    checkedAt: "2026-08-07",
  },
  {
    id: "competition-guidance-notice",
    category: "tutoring",
    title: "竞赛辅导内容发布说明",
    summary: "本栏目用于发布经审核的备赛经验、组队建议和校内训练资源。",
    body: "辅导内容属于经验分享时会明确标记为“学生经验”，不会使用“官方渠道”标签。当前暂无已审核学生辅导内容。",
    audience: "有参赛意向的学生",
    sourceType: "student",
    sourceName: "平台栏目说明",
    checkedAt: "2026-08-07",
  },
];

export function categoryLabel(slug: string) {
  return categories.find((category) => category.slug === slug)?.label ?? "校园信息";
}

export function daysUntil(date?: string | null) {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}
