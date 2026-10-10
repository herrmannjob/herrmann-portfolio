import type { Recommendation } from "./types";

/**
 * Recommendations received on LinkedIn (all set to "visible to all LinkedIn
 * users"), copied verbatim on 2026-10-10. Headlines are the authors' current
 * LinkedIn headlines. Translations are shown labelled, with the original
 * always one click away.
 */

const URL = "https://www.linkedin.com/in/souherrmann/details/recommendations/";

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "lucas-assumpcao-de-oliveira",
    name: "Lucas Assumpção de Oliveira",
    headline: "Analista de Qualidade Pleno na PUCRS - Pontifícia Universidade Católica do Rio Grande do Sul",
    relation: "same-team",
    date: "2024-08-30",
    lang: "pt",
    url: URL,
    text: "Gabriel é um profissional esforçado, comprometido e com muito talento! Sempre disposto a dialogar, aceita críticas com receptividade e sempre se esforça para entregar a melhor qualidade possível. Tê-lo em sua equipe é ter alguém trabalhador, sincero e com muito bom humor!",
    translations: {
      en: "Gabriel is a hard-working, committed and very talented professional! Always open to dialogue, he takes criticism well and always strives to deliver the best possible quality. Having him on your team means having someone hard-working, sincere and with a great sense of humor!",
      es: "¡Gabriel es un profesional esforzado, comprometido y con mucho talento! Siempre dispuesto a dialogar, recibe las críticas con apertura y siempre se esfuerza por entregar la mejor calidad posible. Tenerlo en tu equipo es tener a alguien trabajador, sincero y con muy buen humor.",
      zh: "Gabriel 是一位勤奋、投入且非常有才华的专业人士！他总是乐于沟通，能虚心接受批评，并始终努力交付最好的质量。团队里有他，就有了一位勤恳、真诚又很有幽默感的伙伴！",
    },
  },
  {
    id: "aaron-pierre-glienke-nunez",
    name: "Aaron Pierre Glienke Nunez",
    headline:
      "Software Developer | Frontend Angular Specialist | UX & Architecture | High-complexity Banking Systems & Large-scale Operations | IA-Driven Development | Code Quality & Security",
    relation: "different-teams",
    date: "2023-11-28",
    lang: "pt",
    url: URL,
    text: "O Gabriel é um profissional muito capaz e comprometido, sempre estudando e disposto a aprender. propondo melhorias, novas práticas e tecnologias, pensando no todo para a melhoria dos produtos.",
    translations: {
      en: "Gabriel is a very capable and committed professional, always studying and willing to learn — proposing improvements, new practices and technologies, and thinking about the whole picture to make the products better.",
      es: "Gabriel es un profesional muy capaz y comprometido, siempre estudiando y dispuesto a aprender, proponiendo mejoras, nuevas prácticas y tecnologías, pensando en el conjunto para mejorar los productos.",
      zh: "Gabriel 是一位非常能干、投入的专业人士，始终在学习、乐于进步；他会提出改进建议、新的实践和技术，并从全局出发让产品变得更好。",
    },
  },
  {
    id: "gabriel-romero-de-souza",
    name: "Gabriel Romero de Souza",
    headline: "Software Engineer | Golang | PISMO | VISA",
    relation: "same-team",
    date: "2023-11-27",
    lang: "pt",
    url: URL,
    text: "Gabriel é um ótimo programador e colega de trabalho! Sempre disposto a aprender e ensinar, preocupado com as entregas e qualidade de todo o sistema.\nSeu conhecimento técnico em diversos frameworks JS para front-end e sua facilidade em se comunicar e ajudar faz com que seja muito legal e gratificante trabalhar com ele!",
    translations: {
      en: "Gabriel is a great programmer and coworker! Always willing to learn and to teach, and he cares about the deliveries and the quality of the whole system.\nHis technical knowledge of many front-end JS frameworks and how easily he communicates and helps others make working with him really fun and rewarding!",
      es: "¡Gabriel es un excelente programador y compañero de trabajo! Siempre dispuesto a aprender y a enseñar, preocupado por las entregas y la calidad de todo el sistema.\nSu conocimiento técnico en diversos frameworks JS de front-end y su facilidad para comunicarse y ayudar hacen que trabajar con él sea muy agradable y gratificante.",
      zh: "Gabriel 是一位出色的程序员和同事！他总是乐于学习、乐于分享，关注交付成果以及整个系统的质量。\n他对多种前端 JS 框架的技术掌握，加上善于沟通、乐于助人，让和他一起工作非常愉快、很有收获！",
    },
  },
  {
    id: "guilherme-antonio-bohnert",
    name: "Guilherme Antônio Bohnert",
    headline: "Senior Software Engineer - Azure, .NET, Angular, DevOps",
    relation: "different-teams",
    date: "2023-11-27",
    lang: "pt",
    url: URL,
    text: "Trabalhei com Gabriel brevemente e posso dizer que é uma pessoa dedicada e disposta a propor soluções e melhorias práticas nos projetos.",
    translations: {
      en: "I worked with Gabriel briefly and I can say he is a dedicated person, willing to propose solutions and practical improvements to the projects.",
      es: "Trabajé con Gabriel brevemente y puedo decir que es una persona dedicada y dispuesta a proponer soluciones y mejoras prácticas en los proyectos.",
      zh: "我和 Gabriel 短暂共事过，可以说他是一个敬业的人，乐于为项目提出解决方案和切实可行的改进。",
    },
  },
  {
    id: "rafael-fernandes",
    name: "Rafael Fernandes",
    headline: "Full Stack Engineer | Node.js, React and React-Native",
    relation: "same-team",
    date: "2023-11-25",
    lang: "pt",
    url: URL,
    text: "Um ótimo desenvolvedor FrontEnd com bastante conhecimento e experiência.",
    translations: {
      en: "A great front-end developer with a lot of knowledge and experience.",
      es: "Un excelente desarrollador front-end con mucho conocimiento y experiencia.",
      zh: "一位知识渊博、经验丰富的优秀前端开发者。",
    },
  },
  {
    id: "wendricson-castro",
    name: "Wendricson Castro",
    headline:
      "Gestor de Projetos de TI | Scrum Master | Product Owner | Liderança de Equipes | Metodologias Ágeis | Gestão Financeira | Otimização de Receita",
    relation: "managed-directly",
    date: "2023-11-24",
    lang: "pt",
    url: URL,
    text: "Ótimo profissional, comprometido com suas entregas.",
    translations: {
      en: "A great professional, committed to his deliveries.",
      es: "Excelente profesional, comprometido con sus entregas.",
      zh: "优秀的专业人士，对自己的交付成果高度负责。",
    },
  },
  {
    id: "guilherme-zordan",
    name: "Guilherme Zordan",
    headline: "Senior Full-Stack Software Engineer | React | TypeScript | .NET | Node.js | Azure",
    relation: "same-team",
    date: "2020-07-04",
    lang: "pt",
    url: URL,
    text: "O Gabriel é um profissional criativo e mente aberta, com bastante capacidade inovativa na área de testes.",
    translations: {
      en: "Gabriel is a creative, open-minded professional with a strong capacity for innovation in testing.",
      es: "Gabriel es un profesional creativo y de mente abierta, con gran capacidad de innovación en el área de pruebas.",
      zh: "Gabriel 是一位富有创造力、思想开放的专业人士，在测试领域有很强的创新能力。",
    },
  },
  {
    id: "antonio-della-flora",
    name: "Antônio Della Flora",
    headline: "Frontend Software Engineer | React, Typescript, HTML5, CSS",
    relation: "same-team",
    date: "2020-06-25",
    lang: "pt",
    url: URL,
    text: "Excelente profissional. Possui um amplo conhecimento sobre testes e documentação e está sempre aberto a tirar dúvidas para auxiliar no desenvolvimento. Também desenvolveu algumas automações que facilitaram imensamente o time.",
    translations: {
      en: "An excellent professional. He has broad knowledge of testing and documentation and is always open to answering questions to help with development. He also built some automations that made the team's life immensely easier.",
      es: "Excelente profesional. Tiene un amplio conocimiento sobre pruebas y documentación y siempre está abierto a resolver dudas para ayudar en el desarrollo. También desarrolló algunas automatizaciones que facilitaron enormemente el trabajo del equipo.",
      zh: "非常出色的专业人士。他在测试和文档方面知识广博，总是乐于解答疑问、协助开发。他还开发了一些自动化工具，极大地方便了团队。",
    },
  },
  {
    id: "matheus-padilha",
    name: "Matheus Padilha",
    headline: "Senior Software Engineer @ Sicredi | Java & Kotlin | Spring Boot | Kafka | AWS",
    relation: "same-team",
    date: "2020-06-24",
    lang: "pt",
    url: URL,
    text: "Trabalhei pouco com o Gabriel Herrmann, mas ele era muito prestativo quanto aos testes e elaboração da documentação, sempre disposto a conversar para melhor entendimento e esclarecimento de dúvidas.",
    translations: {
      en: "I didn't work with Gabriel Herrmann for long, but he was very helpful with testing and writing documentation, always willing to talk things through to reach a better understanding and clear up doubts.",
      es: "Trabajé poco con Gabriel Herrmann, pero era muy servicial con las pruebas y la elaboración de la documentación, siempre dispuesto a conversar para entender mejor y aclarar dudas.",
      zh: "我和 Gabriel Herrmann 共事时间不长，但他在测试和编写文档方面非常乐于助人，总是愿意沟通，帮助大家更好地理解问题、解答疑惑。",
    },
  },
  {
    id: "romulo-monteiro",
    name: "Rômulo Monteiro",
    headline: "IT Operations Manager - RPA, AI & Data",
    relation: "different-teams",
    date: "2020-06-24",
    lang: "pt",
    url: URL,
    text: "Grande pessoa com conhecimento amplo em diversas areas, sempre disposto a ajudar.",
    translations: {
      en: "A great person with broad knowledge across many areas, always willing to help.",
      es: "Una gran persona con amplio conocimiento en diversas áreas, siempre dispuesta a ayudar.",
      zh: "一个很棒的人，在多个领域都有广泛的知识，总是乐于助人。",
    },
  },
  {
    id: "gabriel-de-oliveira-rigo",
    name: "Gabriel de Oliveira Rigo",
    headline: "Full Stack Developer | Gvdasa",
    relation: "same-team",
    date: "2020-06-24",
    lang: "pt",
    url: URL,
    text: "Trabalhei pouco com o Gabriel Herrmann, mas ele sempre foi muito prestativo quanto a ajudar com o que pudesse. Também sempre demonstrou muito entendimento sobre as tarefas que se propunha fazer",
    translations: {
      en: "I didn't work with Gabriel Herrmann for long, but he was always very willing to help however he could. He also always showed a solid understanding of the tasks he took on.",
      es: "Trabajé poco con Gabriel Herrmann, pero siempre estuvo muy dispuesto a ayudar en lo que pudiera. También demostró siempre mucho entendimiento sobre las tareas que se proponía hacer.",
      zh: "我和 Gabriel Herrmann 共事时间不长，但他总是尽己所能地帮助别人，对自己承担的任务也总是理解得很透彻。",
    },
  },
  {
    id: "mariana-bisognin",
    name: "Mariana Bisognin",
    headline: "Gerente de Atração e Seleção na Datum",
    relation: "different-teams",
    date: "2020-05-29",
    lang: "pt",
    url: URL,
    text: "Gabriel é um ótimo profissional, muito disponível a ensinar e aprender com os colegas. Sempre muito solícito.",
    translations: {
      en: "Gabriel is a great professional, always available to teach and learn from his colleagues. Always very helpful.",
      es: "Gabriel es un excelente profesional, muy dispuesto a enseñar y a aprender de sus compañeros. Siempre muy atento.",
      zh: "Gabriel 是一位出色的专业人士，乐于向同事传授知识，也乐于向他们学习。总是非常热心。",
    },
  },
];
