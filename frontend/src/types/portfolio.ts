export type Profile = {
  name: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  codechef: string;
  leetcode: string;
  resume: string;
};

export type PortfolioData = {
  profile: Profile;
  hero: {
    kicker: string;
    highlights: string[];
  };
  about: {
    title: string;
    paragraphs: string[];
    currentlyWorkingOn: string[];
  };
  skills: Array<{
    title: string;
    items: string[];
  }>;
  skillsIntro: string;
  experience: {
    title: string;
    organization: string;
    badge: string;
    points: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    stack: string[];
    github: string;
    demo: string;
    status: string;
    accent: string;
    features: string[];
  }>;
  projectsIntro: string;
  achievements: Array<{
    title: string;
    description: string;
  }>;
  resume: {
    description: string;
  };
  contact: {
    intro: string;
  };
  footer: {
    copyright: string;
  };
};
