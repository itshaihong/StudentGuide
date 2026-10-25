export const controllerLoaders={
  'git-solo':()=>import('../modules/git-solo/course.mjs'),
  git:()=>import('../modules/git/course.mjs'),
  'zynq-7000':()=>import('../modules/zynq-7000/course.mjs'),
  'git-team':()=>import('../modules/git-team/course.mjs'),
  'github-ai':()=>import('../modules/github-ai/course.mjs'),
  'embedded-team':()=>import('../modules/embedded-team/course.mjs')
};
