const SITE_ARCHITECTURE = [
  {
    key: 'foundation',
    name: '数据准备与整理',
    order: '01',
    description: '从数据导入、整理、可视化到量表预处理，建立进入统计分析前最关键的实践基础。',
    topics: [
      {
        key: 'r-basics',
        name: 'R 基础与数据整理',
        status: '数据基础',
        badge: 'dplyr / tidyr',
        desc: '覆盖数据导入、筛选、重编码、合并、分组汇总、宽长转换与心理学常见数据结构整理。',
        modules: ['数据导入与数据类型', 'select/filter/mutate/summarise', '宽表与长表转换', '缺失值、异常值与重编码', '心理学常见数据结构整理']
      },
      {
        key: 'visualization',
        name: '数据可视化与结果图表',
        status: '图表表达',
        badge: 'ggplot2',
        desc: '训练发表级图表、教学图表和结果段配图，让统计结果能被清楚呈现。',
        modules: ['单变量图', '分组比较图', '相关与回归图', '交互作用图', '结果段配图与图注写法']
      },
      {
        key: 'descriptives',
        name: '描述统计、信度与量表预处理',
        status: '量表准备',
        badge: 'psych',
        desc: '面向心理学高频量表数据，覆盖描述统计、相关矩阵、信度、反向计分和题项清理。',
        modules: ['均值、标准差、偏度、峰度', '相关矩阵与可视化', "Cronbach's alpha、McDonald's omega", '反向计分与总分生成', '题项分析与量表清理']
      }
    ]
  },
  {
    key: 'core',
    name: '常用统计分析',
    order: '02',
    description: '覆盖实验设计、常规实证论文、重复测量、缺失处理与研究设计阶段的样本量设计。',
    topics: [
      {
        key: 'anova',
        name: 't 检验、方差分析与事后比较',
        status: '实验设计',
        badge: 'afex / emmeans',
        desc: '服务心理学实验设计训练，处理被试间、被试内和混合设计，并训练 APA 结果表述。',
        modules: ['独立样本 t 检验', '配对样本 t 检验', '单因素与双因素 ANOVA', '重复测量 ANOVA', '简单效应与事后比较', 'APA 结果表述']
      },
      {
        key: 'regression',
        name: '回归、中介与调节分析',
        status: '实证常用',
        badge: '回归 / lavaan',
        desc: '从相关与线性回归进入中介、调节、交互项、简单斜率和 Bootstrap 间接效应。',
        modules: ['相关与回归', '层级回归', '交互项与简单斜率', '单中介', '链式中介', '调节与调节中介', 'Bootstrap 间接效应与结果写作']
      },
      {
        key: 'mixed-models',
        name: '混合效应模型与重复测量数据',
        status: '重复测量',
        badge: 'lme4 / emmeans',
        desc: '处理嵌套、重复测量与被试/项目双随机结构，承接模型后的边际均值与对比解释。',
        modules: ['随机截距模型', '随机斜率模型', '重复测量与长格式数据', '被试/项目双随机结构', 'GLMM 入门', '模型比较与结果解释']
      },
      {
        key: 'missing-data',
        name: '缺失数据与多重插补',
        status: '数据质量',
        badge: 'mice',
        desc: '围绕心理学数据常见缺失，训练缺失模式判断、删除法比较、多重插补与报告写法。',
        modules: ['缺失模式判断', '删除法与插补法比较', 'mice 基本流程', '插补后汇总', '插补数据的结果报告']
      },
      {
        key: 'power-analysis',
        name: '功效分析与样本量设计',
        status: '研究设计',
        badge: 'simr',
        desc: '把样本量估计前移到研究设计阶段，尤其支持复杂设计与混合模型的模拟功效分析。',
        modules: ['基本功效分析概念', '常见设计样本量估计', '基于模型的模拟功效分析', '纵向/混合模型样本量思路', '研究计划中的写法']
      }
    ]
  },
  {
    key: 'latent',
    name: '潜变量与纵向研究',
    order: '03',
    description: '面向研究生层级和高阶方法训练，承接 SEM、纵向模型、测量等值与量表建模。',
    topics: [
      {
        key: 'sem',
        name: 'CFA、SEM 与测量等值性',
        status: '潜变量模型',
        badge: 'lavaan',
        desc: '覆盖路径分析、CFA、SEM、多组 CFA、测量等值性、潜变量中介与模型修改。',
        modules: ['路径分析', 'CFA', 'SEM', '多组 CFA', '测量等值性', '潜变量中介', '拟合指标与模型修改']
      },
      {
        key: 'longitudinal',
        name: '纵向模型专题',
        status: '可进入训练',
        badge: 'CLPM / RI-CLPM / LGM',
        desc: '围绕多波追踪数据，训练交叉滞后、随机截距、增长轨迹、纵向中介与多组纵向比较。',
        modules: ['交叉滞后模型（CLPM）', '随机截距交叉滞后模型（RI-CLPM）', '潜在增长模型（LGM）', '纵向中介', '多组纵向模型']
      },
      {
        key: 'measurement',
        name: '心理测量与量表建模',
        status: '测量建模',
        badge: 'EFA / CFA / IRT',
        desc: '承接量表开发、题项筛选、因子结构分析、IRT 入门和量表质量报告。',
        modules: ['EFA', 'CFA 与 EFA 衔接', '题项分析', '量表修订', 'IRT 入门', '报告量表质量']
      }
    ]
  },
  {
    key: 'advanced',
    name: '研究拓展与复现',
    order: '04',
    description: '面向更复杂的研究问题，延伸到网络分析、证据综合和可重复研究工作流。',
    topics: [
      {
        key: 'network',
        name: '网络心理测量',
        status: '网络分析',
        badge: 'qgraph / bootnet',
        desc: '训练网络估计、中心性指标、稳定性与精确性检验，以及规范结果表述。',
        modules: ['网络心理测量基本概念', '网络估计', '中心性指标', '稳定性与精确性检验', '网络结果的规范表述']
      },
      {
        key: 'meta',
        name: '元分析与证据综合',
        status: '证据综合',
        badge: 'metafor',
        desc: '覆盖效应量计算、固定/随机效应模型、森林图、漏斗图、调节变量和 meta-regression。',
        modules: ['效应量计算', '固定效应与随机效应', 'forest plot 与 funnel plot', '调节变量分析', 'meta-regression', '元分析结果报告']
      },
      {
        key: 'reproducible',
        name: '可重复研究与动态报告',
        status: '研究工作流',
        badge: 'Quarto / renv',
        desc: '用 Quarto 和 renv 训练从代码、正文、图表到环境快照的一体化可重复研究工作流。',
        modules: ['Quarto 基础', 'R 代码与正文联动', '自动生成图表和结果', '项目环境快照与恢复', '可重复研究工作流']
      }
    ]
  }
];

const LONGITUDINAL_TOPICS = [
  { key: 'clpm', title: 'CLPM', fullName: '交叉滞后模型', desc: '作为纵向分析入门，对比传统交叉滞后路径的解释。', status: '基础模型' },
  { key: 'riclpm', title: 'RI-CLPM', fullName: '随机截距交叉滞后模型', desc: '聚焦 within / between 分离，训练更清晰的纵向效应解释。', status: '进入训练' },
  { key: 'lgm', title: 'LGM', fullName: '潜在增长模型', desc: '描述随时间变化的轨迹与个体差异。', status: '发展轨迹' },
  { key: 'longitudinal-mediation', title: '纵向中介', fullName: '跨时间中介链', desc: '训练跨时间中介链与间接效应写作。', status: '机制解释' },
  { key: 'multi-group-longitudinal', title: '多组纵向模型', fullName: '组间纵向路径比较', desc: '处理不同组别的纵向路径比较。', status: '组间比较' }
];

const TRAINING_TEMPLATE = [
  '研究问题',
  '数据处理',
  '模型代码',
  '结果解读',
  '论文表述',
  '综合练习'
];

const MODULE_DATA = {
  1: {
    title: '研究问题与设计识别',
    objectives: [
      '判断一个研究问题是否适合使用 RI-CLPM',
      '理解纵向交叉滞后设计的前提条件',
      '区分 CLPM 与 RI-CLPM 的适用场景'
    ],
    level: '入门', types: ['判断题'],
    questions: [
      { id:'m1_q1', title:'研究问题筛查：这项研究需要 RI-CLPM 吗？', type:'判断题', level:'入门', score:null },
      { id:'m1_q2', title:'CLPM vs RI-CLPM：哪种设计更合适？', type:'判断题', level:'入门', score:null }
    ]
  },
  2: {
    title: '个体间与个体内',
    objectives: [
      '区分 between-person 与 within-person 效应',
      '理解随机截距的含义与识别方式',
      '避免将个体间相关误读为个体内变化'
    ],
    level: '入门', types: ['多选题'],
    questions: [
      { id:'m2_q1', title:'识别 within-person 效应的描述', type:'多选题', level:'入门', score:null },
      { id:'m2_q2', title:'随机截距的作用：between 层面的分离', type:'多选题', level:'标准', score:null }
    ]
  },
  3: {
    title: 'lavaan 语法基础',
    objectives: [
      '掌握 lavaan 回归运算符 ~ 和测量运算符 =~',
      '理解残差定义与约束写法',
      '能够在代码中正确定义间接效应'
    ],
    level: '标准', types: ['代码补全'],
    questions: [
      { id:'m3_q1', title:'lavaan 运算符识别：~、=~、~~、:=', type:'代码补全', level:'入门', score:null },
      { id:'m3_q2', title:'回归、残差与约束：补全局部语法', type:'代码补全', level:'标准', score:null },
      { id:'m3_q3', title:'路径标签、间接效应与总效应定义', type:'代码补全', level:'标准', score:null },
      { id:'m3_q4', title:'lavaan 报错定位：修改错误语法', type:'错误诊断', level:'标准', score:null }
    ]
  },
  4: {
    title: 'RI-CLPM 基础代码',
    objectives: [
      '搭建完整 RI-CLPM 骨架代码',
      '正确定义随机截距与个体内残差',
      '写出双变量三波交叉滞后路径'
    ],
    level: '标准', types: ['完整代码'],
    questions: [
      { id:'m4_q1', title:'搭建双变量三波 RI-CLPM 骨架', type:'完整代码', level:'标准', score:null },
      { id:'m4_q2', title:'加入残差协方差约束', type:'完整代码', level:'标准', score:null }
    ]
  },
  5: {
    title: '三变量与纵向中介',
    objectives: [
      '在三变量三波纵向设计中定义中介链',
      '理解 within-person 间接效应定义',
      '使用 bootstrap 进行中介检验'
    ],
    level: '进阶', types: ['完整代码'],
    questions: [
      { id:'m5_q1', title:'三变量 RI-CLPM 中的 within 层面中介', type:'完整代码', level:'进阶', score:null },
      { id:'m5_q2', title:'bootstrap 间接效应检验代码', type:'完整代码', level:'进阶', score:null }
    ]
  },
  6: {
    title: '多组约束与释放',
    objectives: [
      '理解多组 RI-CLPM 的参数约束逻辑',
      '写出组间等同约束与释放代码',
      '通过 LRT 判断约束是否合理'
    ],
    level: '进阶', types: ['代码补全'],
    questions: [
      { id:'m6_q1', title:'多组 RI-CLPM：写出组间路径约束代码', type:'代码补全', level:'进阶', score:null },
      { id:'m6_q2', title:'释放约束：哪条路径存在组间差异？', type:'代码补全', level:'进阶', score:null }
    ]
  },
  7: {
    title: '输出结果解释',
    objectives: [
      '从 lavaan 输出中识别关键拟合指标',
      '正确读取路径系数与置信区间',
      '理解随机截距相关的方向与含义'
    ],
    level: '标准', types: ['数值填写'],
    questions: [
      { id:'m7_q1', title:'从输出中提取拟合指标与路径系数', type:'数值填写', level:'标准', score:null },
      { id:'m7_q2', title:'判断模型拟合与间接效应显著性', type:'数值填写', level:'进阶', score:null }
    ]
  },
  8: {
    title: '综合任务',
    objectives: [
      '从研究问题到代码到结果表述的完整训练',
      '整合代码、输出解释与论文写作',
      '避免常见错误：层面混淆与过度推断'
    ],
    level: '进阶', types: ['综合'],
    questions: [
      { id:'m8_q1', title:'综合任务 A：双变量 RI-CLPM 完整流程', type:'综合', level:'进阶', score:null },
      { id:'m8_q2', title:'综合任务 B：三变量纵向中介完整流程', type:'综合', level:'进阶', score:null }
    ]
  }
};

const QUESTION_DATA = {
  m1_q1: {
    title:    '研究问题筛查：这项研究需要 RI-CLPM 吗？',
    type:     'judge',
    level:    '入门',
    scenario: `某研究团队收集了 300 名大学生在大一、大二、大三三个时间点的焦虑（X）和抑郁（Y）水平数据，希望探究焦虑和抑郁之间是否存在纵向交叉影响。研究者认为，个体之间存在稳定的差异（如有人天生更容易焦虑），这些稳定差异可能混淆纵向效应的估计。`,
    tasks:    [
      '判断以下说法是否正确',
      '用自己的话说明为什么这里要关注个体间稳定差异',
      '避免只写"因为是纵向数据"，要说明 RI-CLPM 相比 CLPM 多解决了什么问题'
    ],
    judgeQ:   '该研究应使用 RI-CLPM 而非传统 CLPM，因为需要控制个体间稳定差异。',
    answer:   {
      judge: 'true',
      text_keywords: ['个体间', '稳定差异', 'within', '个体内', 'between', '随机截距', '混淆']
    },
    feedback: {
      correct:  [
        '判断为"正确"是合适的：题干明确说个体之间存在稳定差异，而这正是 RI-CLPM 要分离出来的 between-person 成分。',
        '如果你的理由提到了随机截距、个体间稳定差异或 within/between 区分，就抓住了本题核心。'
      ],
      issues:   [
        '常见误区是只因为"有三个时间点"就选择 RI-CLPM。多波纵向数据是必要条件之一，但不是充分理由。',
        '更关键的理由是：研究者担心个体间稳定差异会混淆交叉滞后路径。'
      ],
      why:      [
        '传统 CLPM 的交叉滞后路径可能混合 between-person 差异与 within-person 波动。RI-CLPM 通过随机截距分离稳定个体差异，使滞后路径更接近"同一个人相对自己平时水平的变化"之间的关系。'
      ],
      next:     ['下一题会让你判断一个更适合传统 CLPM、而不是 RI-CLPM 的情境。']
    },
    hints: [
      '想想研究者提到了"个体之间存在稳定的差异"——这提示了什么？',
      '关注"随机截距"的含义：它是为了控制哪个层面的差异？',
      'RI-CLPM = CLPM + 随机截距。随机截距的作用就是把个体间差异"拿出来"，留下个体内变化。',
      '标准答案：正确。RI-CLPM 通过随机截距控制个体间稳定差异，使交叉滞后路径反映个体内变化，更接近因果推断的目标。'
    ],
    values: [],
    textPrompt: '请用 1-3 句话说明你的判断理由。重点说清楚：为什么"个体间稳定差异"会让 RI-CLPM 比传统 CLPM 更合适。',
    simOutput: null,
    dataName: null
  },
  m1_q2: {
    title:    'CLPM vs RI-CLPM：哪种设计更合适？',
    type:     'judge',
    level:    '入门',
    scenario: `某研究者收集了 120 名被试在实验前、实验后、一个月追踪三个时间点的压力评分和睡眠质量评分。研究目的主要是检验压力变化是否能预测后续睡眠变化。研究者认为样本中的稳定个体差异并不是主要关注点，也没有理论假设认为被试之间长期稳定的压力倾向会混淆研究结论。`,
    tasks: [
      '判断以下说法是否正确',
      '说明为什么这个情境不一定必须使用 RI-CLPM',
      '区分"可以使用纵向模型"和"必须使用 RI-CLPM"'
    ],
    judgeQ: '只要数据有三个时间点，并且变量之间可能存在交叉滞后关系，就必须优先使用 RI-CLPM。',
    answer: {
      judge: 'false',
      text_keywords: ['不是必须', '研究问题', '稳定差异', '个体间', '理论', 'CLPM', 'RI-CLPM']
    },
    feedback: {
      correct: [
        '判断为"错误"是合适的：RI-CLPM 不是所有三波纵向数据的默认答案。',
        '你需要根据研究问题判断是否必须分离个体间稳定差异，而不是只看时间点数量。'
      ],
      issues: [
        '三波数据可以支持 CLPM 或 RI-CLPM 的基本建模，但模型选择不能只由波次数决定。',
        '如果研究重点只是总体层面的时间顺序关联，且没有明确理论要控制稳定个体差异，传统 CLPM 可能仍可作为起点或对照模型。'
      ],
      why: [
        'RI-CLPM 的优势在于把 between-person 稳定差异和 within-person 波动分开。这个优势也意味着模型更复杂、参数更多，对理论理由、样本量和模型识别都有更高要求。'
      ],
      next: [
        '完成 Module 1 后，你应该能先问：我的研究问题到底关心个体内变化，还是只是一般纵向关联？',
        '下一步建议进入 Module 2，专门训练 within-person 与 between-person 的区分。'
      ]
    },
    hints: [
      '先不要看到"三波"就自动选 RI-CLPM。模型选择要回到研究问题。',
      'RI-CLPM 特别适合研究者担心稳定个体差异混淆滞后路径的情境。',
      '如果题干没有强调稳定个体差异，且研究目标只是初步检验纵向关联，CLPM 可以作为起点或比较模型。',
      '标准答案：错误。三波纵向数据不等于必须使用 RI-CLPM；是否使用 RI-CLPM 取决于是否需要分离 between-person 稳定差异与 within-person 变化。'
    ],
    values: [],
    textPrompt: '请用 1-3 句话说明为什么"三波纵向数据"本身不足以决定必须使用 RI-CLPM。',
    simOutput: null,
    dataName: null
  },
  m2_q1: {
    title: '识别 within-person 效应的描述',
    type: 'multi',
    level: '入门',
    scenario: `同一批大学生在三个学期分别报告压力水平和睡眠质量。研究者希望解释 RI-CLPM 中的交叉滞后路径到底代表什么。请判断下列哪些表述真正是在描述 within-person 效应。`,
    tasks: [
      '选出所有属于 within-person 效应的表述',
      '区分"人与人之间谁更高"和"同一个人相对自己平时是否更高"',
      '用一句话说明为什么你选择这些选项'
    ],
    options: [
      { id: 'a', text: '一个人在某学期压力高于自己平时水平时，下一学期睡眠质量是否也偏离自己的平时水平。' },
      { id: 'b', text: '平均压力更高的学生，整体上是否也比其他学生睡眠更差。' },
      { id: 'c', text: '某人在 T1 到 T2 的压力变化，是否预测他/她 T2 到 T3 睡眠相对自身基线的变化。' },
      { id: 'd', text: '女生的平均睡眠质量是否低于男生。' },
      { id: 'e', text: '同一个人在压力暂时升高之后，后续睡眠是否相对自己的稳定水平发生变化。' }
    ],
    answer: {
      multi: ['a', 'c', 'e'],
      text_keywords: ['同一个人', '自己', '平时', '基线', '相对', '个体内', 'within']
    },
    feedback: {
      correct: [
        '正确选项是 A、C、E。它们都把比较对象限定在同一个人内部，也就是相对个人平时水平的偏离。',
        'within-person 效应回答的是：当某个人比自己平时更高或更低时，另一个变量之后是否也发生相对自身的变化。'
      ],
      issues: [
        'B 是 between-person 表述：它比较的是压力更高的人和其他人之间的稳定差异。',
        'D 是组间均值差异，也属于人与人/组与组之间的比较，不是 RI-CLPM 中的个体内滞后效应。'
      ],
      why: [
        'RI-CLPM 的核心价值在于把"谁长期更高"和"同一个人什么时候高于自己平时"分开。交叉滞后路径应解释后者，而不是解释稳定的个体间差异。'
      ],
      next: [
        '下一题会继续追问：随机截距到底把哪一部分差异拿出来。'
      ]
    },
    hints: [
      '看到"比其他人更高"通常是在描述 between-person 差异。',
      '看到"相对自己平时水平"通常是在描述 within-person 变化。',
      'RI-CLPM 的交叉滞后路径不是问"谁比谁高"，而是问"同一个人偏离自己基线之后会发生什么"。',
      '标准答案：A、C、E。B 和 D 都是个体间或组间差异。'
    ],
    values: [],
    textPrompt: '请用一句话说明：within-person 效应和 between-person 效应最关键的区别是什么？',
    simOutput: null,
    dataName: null
  },
  m2_q2: {
    title: '随机截距的作用：between 层面的分离',
    type: 'multi',
    level: '标准',
    scenario: `在 RI-CLPM 中，研究者为焦虑和抑郁分别定义了随机截距 RI_x 和 RI_y。请判断下列哪些说法正确反映了随机截距的作用。`,
    tasks: [
      '选出所有正确描述随机截距作用的说法',
      '说明随机截距和个体内残差成分的区别',
      '避免把随机截距误解为普通截距或随机误差'
    ],
    options: [
      { id: 'a', text: '随机截距表示个体在多个时间点上相对稳定的平均水平差异。' },
      { id: 'b', text: '加入随机截距后，within 层面的路径更接近同一个人相对自身稳定水平的变化关系。' },
      { id: 'c', text: '随机截距的作用是让模型自动证明 X 和 Y 之间存在因果关系。' },
      { id: 'd', text: '随机截距之间的相关可以反映两个变量稳定个体差异之间的关联。' },
      { id: 'e', text: '随机截距就是每个时间点的测量误差，因此通常应该被解释为量表信度问题。' }
    ],
    answer: {
      multi: ['a', 'b', 'd'],
      text_keywords: ['稳定', '个体间', 'between', '随机截距', '个体内', 'within', '分离']
    },
    feedback: {
      correct: [
        '正确选项是 A、B、D。随机截距用于表示并分离个体间稳定差异。',
        'RI_x 与 RI_y 的相关可以解释为两个变量稳定水平之间的个体间关联，而不是个体内滞后效应。'
      ],
      issues: [
        'C 错在"自动证明因果"。RI-CLPM 改善了层面解释，但不能单独证明因果关系。',
        'E 错在把随机截距当作测量误差。随机截距代表跨时间稳定的个体差异，不等同于每个观测点的误差。'
      ],
      why: [
        '如果不分离随机截距，交叉滞后路径可能混入"长期更焦虑的人也长期更抑郁"这种 between-person 关联。RI-CLPM 先把这部分稳定差异拿出来，再估计个体内路径。'
      ],
      next: [
        '完成 Module 2 后，再进入 lavaan 语法时，要把 RI_x/RI_y 和 wx/wy 看成两个层面的模型部件。'
      ]
    },
    hints: [
      '随机截距关注的是跨时间稳定的个体差异。',
      '不要把随机截距理解成测量误差；它更像每个人稳定的平均倾向。',
      'RI_x ~~ RI_y 是 between 层面稳定差异之间的相关，不是交叉滞后路径。',
      '标准答案：A、B、D。C 过度因果化，E 混淆了随机截距和测量误差。'
    ],
    values: [],
    textPrompt: '请用一句话说明：为什么 RI-CLPM 要先把随机截距分离出来？',
    simOutput: null,
    dataName: null
  },
  m3_q1: {
    title: 'lavaan 运算符识别：~、=~、~~、:=',
    type: 'code',
    typeLabel: '代码补全',
    level: '入门',
    scenario: `这一题只训练 lavaan 的四个核心运算符。你不需要写完整模型，只需要把每一行的符号补对，并判断一个语法说法。`,
    tasks: [
      '补全测量模型、回归路径、协方差和定义参数的运算符',
      '判断 := 是否表示模型中的回归路径',
      '用一句话说明 =~ 和 ~ 的区别'
    ],
    judgeQ: '`:=` 用来定义由已有参数计算出来的新参数，它本身不是一条新的回归路径。',
    answer: {
      judge: 'true',
      code_keywords: [],
      code_patterns: [
        'visual\\s*=~\\s*x1\\s*\\+\\s*x2\\s*\\+\\s*x3',
        'y\\s*~\\s*visual',
        'x1\\s*~~\\s*x2',
        'ind\\s*:=\\s*a\\s*\\*\\s*b'
      ],
      text_keywords: ['潜变量', '测量', '回归', '预测', '=~', '~']
    },
    scoring: { code: 60, stat: 20, text: 20 },
    feedback: {
      correct: [
        '这一题的核心是把四个符号分开：=~ 定义潜变量测量关系，~ 定义回归路径，~~ 定义方差或协方差，:= 定义新参数。',
        '`ind := a*b` 是定义参数，不是在模型里新增一条路径。'
      ],
      issues: [
        '最常见错误是把 =~ 和 ~ 混用，导致潜变量定义和回归路径混在一起。',
        '另一个常见错误是把 := 写成 ~，这样 lavaan 会把间接效应误当成回归关系。'
      ],
      why: [
        'RI-CLPM 后续代码会同时出现测量式定义、路径回归、协方差和派生参数。如果这一层符号没分清，后面完整模型会很难排错。'
      ],
      next: [
        '下一题会进一步练习残差方差、协方差、固定参数和路径标签。'
      ]
    },
    hints: [
      '=~ 左边通常是潜变量，右边是观测指标。',
      '~ 左边通常是被预测变量，右边是预测变量。',
      '~~ 可以写方差，也可以写协方差；:= 用来定义由已有标签计算的新参数。',
      '参考答案：visual =~ x1 + x2 + x3；y ~ visual；x1 ~~ x2；ind := a*b。'
    ],
    values: [],
    textLabel: '语法说明',
    textPrompt: '请用一句话说明：`=~` 和 `~` 在 lavaan 中分别表示什么？',
    simOutputLabel: '待补全代码',
    simOutput:
`model <- '
  visual __ x1 + x2 + x3
  y      __ visual
  x1     __ x2
  ind    __ a*b
'`,
    starterCode:
`model <- '
  visual __ x1 + x2 + x3
  y      __ visual
  x1     __ x2
  ind    __ a*b
'`,
    dataName: null
  },
  m3_q2: {
    title: '回归、残差与约束：补全局部语法',
    type: 'code',
    typeLabel: '代码补全',
    level: '标准',
    scenario: `下面是一段 RI-CLPM 前置语法练习。它不是完整 RI-CLPM，只训练回归路径、参数标签、残差方差固定和同波协方差写法。`,
    tasks: [
      '补全带标签的回归路径',
      '补全观测变量残差方差固定为 0 的写法',
      '补全同一时间点 within 成分的协方差',
      '判断固定残差方差的语法含义'
    ],
    judgeQ: '`x1 ~~ 0*x1` 表示把观测变量 x1 的残差方差固定为 0。',
    answer: {
      judge: 'true',
      code_keywords: [],
      code_patterns: [
        'wx2\\s*~\\s*a\\s*\\*\\s*wx1',
        'wy2\\s*~\\s*b\\s*\\*\\s*wy1',
        'x1\\s*~~\\s*0\\s*\\*\\s*x1',
        'y1\\s*~~\\s*0\\s*\\*\\s*y1',
        'wx1\\s*~~\\s*wy1'
      ],
      text_keywords: ['方差', '协方差', '固定', '残差', '~~', '0*']
    },
    scoring: { code: 60, stat: 20, text: 20 },
    feedback: {
      correct: [
        '这题重点是三类写法：带标签回归、固定方差、协方差。',
        '`a*wx1` 中的 a 是路径标签，`0*x1` 中的 0 是固定参数值，两者位置都很重要。'
      ],
      issues: [
        '路径标签应写在右侧预测变量前面，例如 `wx2 ~ a*wx1`，不要写成 `a*wx2 ~ wx1`。',
        '`x1 ~~ 0*x1` 固定的是 x1 的方差/残差方差项；`wx1 ~~ wy1` 则是在写两个变量的协方差。'
      ],
      why: [
        'RI-CLPM 里经常要固定观测变量残差，并允许同波 within 成分相关。局部语法写错，会直接影响模型识别和参数含义。'
      ],
      next: [
        '下一题会训练路径标签如何进入间接效应和总效应定义。'
      ]
    },
    hints: [
      '标签写在预测变量前面：结果变量 ~ 标签*预测变量。',
      '固定参数写法是 数值*变量，例如 0*x1。',
      '同波协方差使用 ~~，例如 wx1 ~~ wy1。',
      '参考答案包含：wx2 ~ a*wx1；wy2 ~ b*wy1；x1 ~~ 0*x1；y1 ~~ 0*y1；wx1 ~~ wy1。'
    ],
    values: [],
    textLabel: '语法说明',
    textPrompt: '请用一句话说明：`~~` 在固定方差和定义协方差时有什么共同点？',
    simOutputLabel: '待补全代码',
    simOutput:
`model <- '
  wx2 __ a*wx1
  wy2 __ b*wy1

  x1  __ 0*x1
  y1  __ 0*y1

  wx1 __ wy1
'`,
    starterCode:
`model <- '
  wx2 __ a*wx1
  wy2 __ b*wy1

  x1  __ 0*x1
  y1  __ 0*y1

  wx1 __ wy1
'`,
    dataName: null
  },
  m3_q3: {
    title: '路径标签、间接效应与总效应定义',
    type: 'code',
    typeLabel: '代码补全',
    level: '标准',
    scenario: `下面是一个最小中介模型，用来训练 lavaan 中的路径标签和定义参数。这里暂时不考虑 RI-CLPM 的完整结构，只练习 a、b、c 路径与间接效应。`,
    tasks: [
      '为 X -> M、M -> Y、X -> Y 三条路径加上标签',
      '用 := 定义间接效应 ind',
      '用 := 定义总效应 total',
      '判断错误的间接效应写法'
    ],
    judgeQ: '`ind ~ a*b` 可以用来定义间接效应，因为间接效应也是一种路径。',
    answer: {
      judge: 'false',
      code_keywords: [],
      code_patterns: [
        'm\\s*~\\s*a\\s*\\*\\s*x',
        'y\\s*~\\s*b\\s*\\*\\s*m\\s*\\+\\s*c\\s*\\*\\s*x',
        'ind\\s*:=\\s*a\\s*\\*\\s*b',
        'total\\s*:=\\s*c\\s*\\+\\s*\\(?\\s*a\\s*\\*\\s*b\\s*\\)?'
      ],
      text_keywords: ['标签', '定义参数', ':=', '已有路径', '间接效应', '不是回归']
    },
    scoring: { code: 60, stat: 20, text: 20 },
    feedback: {
      correct: [
        '间接效应应该用 `:=` 定义，例如 `ind := a*b`。',
        'a、b、c 是路径标签；ind 和 total 是根据这些标签计算出来的定义参数。'
      ],
      issues: [
        '`ind ~ a*b` 是错误思路，因为它把间接效应写成了新的回归路径。',
        '路径标签必须先出现在模型路径中，后面的 `:=` 才能引用它们。'
      ],
      why: [
        '纵向中介和 RI-CLPM 扩展模型都会大量使用标签和定义参数。把路径和派生效应分清，是后续写模型约束的基础。'
      ],
      next: [
        '下一题会给你一段故意写错的 lavaan 代码，练习定位和修正错误。'
      ]
    },
    hints: [
      '路径标签写在预测变量前：m ~ a*x。',
      '直接效应可以写成 y ~ b*m + c*x。',
      '定义参数使用 :=，不是 ~。',
      '参考答案：m ~ a*x；y ~ b*m + c*x；ind := a*b；total := c + (a*b)。'
    ],
    values: [],
    textLabel: '语法说明',
    textPrompt: '请用一句话说明：为什么 `ind := a*b` 要写在路径标签定义之后？',
    simOutputLabel: '待补全代码',
    simOutput:
`model <- '
  m __ a*x
  y __ b*m + c*x

  ind   __ a*b
  total __ c + (a*b)
'`,
    starterCode:
`model <- '
  m __ a*x
  y __ b*m + c*x

  ind   __ a*b
  total __ c + (a*b)
'`,
    dataName: null
  },
  m3_q4: {
    title: 'lavaan 报错定位：修改错误语法',
    type: 'code',
    typeLabel: '错误诊断',
    level: '标准',
    scenario: `下面这段 lavaan 代码看起来像中介模型，但包含几个常见语法错误。请在代码框中写出修正后的版本，并用一句话说明你改了什么。`,
    tasks: [
      '修正标签位置错误',
      '修正间接效应定义错误',
      '修正协方差运算符错误',
      '判断错误代码的主要问题'
    ],
    judgeQ: '错误代码的一个核心问题，是把定义参数 `ind` 写成了回归路径。',
    answer: {
      judge: 'true',
      code_keywords: [],
      code_patterns: [
        'm\\s*~\\s*a\\s*\\*\\s*x',
        'y\\s*~\\s*b\\s*\\*\\s*m\\s*\\+\\s*c\\s*\\*\\s*x',
        'x\\s*~~\\s*m',
        'ind\\s*:=\\s*a\\s*\\*\\s*b'
      ],
      text_keywords: ['标签位置', ':=', '~~', '间接效应', '回归路径', '修正']
    },
    scoring: { code: 60, stat: 20, text: 20 },
    feedback: {
      correct: [
        '修正后的关键是：标签放在预测变量前，协方差使用 `~~`，间接效应用 `:=`。',
        '错误诊断题的目标不是背完整模型，而是看到 lavaan 常见报错时能快速定位语法层面的问题。'
      ],
      issues: [
        '`a*m ~ x` 这类写法标签位置错误；应写成 `m ~ a*x`。',
        '`x ~ m` 是回归路径，不是协方差；协方差应写作 `x ~~ m`。',
        '`ind ~ a*b` 把定义参数误写成路径；应使用 `ind := a*b`。'
      ],
      why: [
        '真实写 lavaan 时，很多错误不是统计思想错，而是符号位置错。能定位这些小错误，后面写 RI-CLPM 完整代码会稳很多。'
      ],
      next: [
        '完成 Module 3 后，可以进入 Module 4，把这些局部语法拼成完整 RI-CLPM 骨架。'
      ]
    },
    hints: [
      '路径标签应写在预测变量前：m ~ a*x。',
      '协方差不是 ~，而是 ~~。',
      '间接效应不是路径，用 := 定义。',
      '参考修正版：m ~ a*x；y ~ b*m + c*x；x ~~ m；ind := a*b。'
    ],
    values: [],
    textLabel: '语法说明',
    textPrompt: '请用一句话说明：这段错误代码最容易造成哪一种 lavaan 语法混淆？',
    simOutputLabel: '错误代码',
    simOutput:
`model_wrong <- '
  a*m ~ x
  y ~ b*m + c*x
  x ~ m
  ind ~ a*b
'`,
    starterCode:
`model_fixed <- '
  # 在这里写出修正后的 lavaan 代码
'`,
    dataName: null
  },
  m4_q1: {
    title:    '搭建双变量三波 RI-CLPM 骨架',
    type:     'code',
    level:    '标准',
    scenario: `使用模拟数据（anxiety_depression_3wave.csv），在 lavaan 中搭建一个双变量（焦虑 x、抑郁 y）三波（T1/T2/T3）的 RI-CLPM 模型。数据已生成，请在本地 R 中运行代码，并将关键结果填写到下方。`,
    tasks:    [
      '定义随机截距 RI_x 和 RI_y（用 =~ 指向三个时间点）',
      '定义个体内残差变量 wx1-wx3, wy1-wy3',
      '写出自回归路径（wx2 ~ wx1，wx3 ~ wx2 等）',
      '写出交叉滞后路径（wy2 ~ wx1，wx2 ~ wy1 等）',
      '提取 CFI、RMSEA、交叉滞后路径系数'
    ],
    judgeQ:   null,
    answer: {
      code_keywords: ['RI_x =~', 'RI_y =~', 'wx', 'wy', '~~'],
      values: { cfi: [0.94, 1.00], rmsea: [0.00, 0.06], beta_yx: [-0.5, 0.5] }
    },
    hints: [
      '随机截距的定义格式：RI_x =~ 1*x1 + 1*x2 + 1*x3',
      '个体内残差：wx1 =~ 1*x1，然后 x1 ~~ 0*x1（固定测量误差为0）',
      `# RI-CLPM 骨架示例\nmodel <- '\n  # 随机截距\n  RI_x =~ 1*x1 + 1*x2 + 1*x3\n  RI_y =~ 1*y1 + 1*y2 + 1*y3\n  # 个体内残差\n  wx1 =~ 1*x1; wx2 =~ 1*x2; wx3 =~ 1*x3\n  wy1 =~ 1*y1; wy2 =~ 1*y2; wy3 =~ 1*y3\n  # 自回归\n  wx2 ~ a*wx1; wx3 ~ a*wx2\n  wy2 ~ b*wy1; wy3 ~ b*wy2\n  # 交叉滞后\n  wx2 ~ c*wy1; wx3 ~ c*wy2\n  wy2 ~ d*wx1; wy3 ~ d*wx2\n'`,
      '参考答案在第3条提示中，请先独立作答后再查看完整代码。'
    ],
    values: [
      { key:'cfi',     label:'CFI' },
      { key:'rmsea',   label:'RMSEA' },
      { key:'beta_yx', label:'β_yx（焦虑→抑郁）' }
    ],
    textPrompt: '用1-2句话描述主要结果，注意区分是"个体内层面"的效应。',
    simOutput: null,
    dataName: 'anxiety_depression_3wave.csv'
  },
  m7_q1: {
    title:    '从输出中提取拟合指标与路径系数',
    type:     'values',
    level:    '标准',
    scenario: `下方是一段 RI-CLPM 的 lavaan 输出摘要（模拟生成）。请仔细阅读输出，回答下方数值填写题和判断题。`,
    tasks:    [
      '找到并填写模型拟合指标 CFI 和 RMSEA',
      '找到并填写 wx→wy 的交叉滞后路径系数',
      '判断模型拟合是否可接受'
    ],
    judgeQ: '该模型的拟合可以接受（CFI > 0.95，RMSEA < 0.06）。',
    answer: {
      judge: 'true',
      values: { cfi: [0.97, 0.97], rmsea: [0.042, 0.042], beta_yx: [0.23, 0.23] }
    },
    hints: [
      '在 lavaan 输出中，拟合指标通常在 Model Test User Model 或 Fit Indices 部分。',
      'CFI 通常 > 0.95 视为良好，RMSEA < 0.06 视为良好，0.06-0.08 为可接受。',
      'CFI = 0.970，RMSEA = 0.042，交叉滞后 β = 0.23，模型拟合可以接受。',
      '以上就是本题的标准答案，请核对你的填写。'
    ],
    values: [
      { key:'cfi',     label:'CFI' },
      { key:'rmsea',   label:'RMSEA' },
      { key:'beta_yx', label:'β（wx→wy 路径）' }
    ],
    textPrompt: '根据输出，用1-2句话描述模型拟合情况与主要路径结论。',
    simOutput:
`lavaan 0.6-17 -- Model Summary
Number of observations: 400

Model Test User Model:
  Test statistic: 18.432
  Degrees of freedom: 14
  P-value: 0.189

Model Fit Indices:
  CFI:   0.970
  TLI:   0.951
  RMSEA: 0.042 [90% CI: 0.000, 0.072]
  SRMR:  0.038

Parameter Estimates:
                   Estimate  SE     z      p
  wy2 ~ wx1 (d)    0.230    0.048  4.79  < .001  ***
  wx2 ~ wy1 (c)    0.054    0.051  1.06   .290
  wx2 ~ wx1 (a)    0.412    0.053  7.77  < .001  ***
  wy2 ~ wy1 (b)    0.381    0.049  7.78  < .001  ***
  RI_x ~~ RI_y     0.381    0.041  9.29  < .001  ***`,
    dataName: null
  }
};
