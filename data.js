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
      { id:'m3_q1', title:'补全 lavaan 基本语法：回归与残差', type:'代码补全', level:'标准', score:null },
      { id:'m3_q2', title:'补全 lavaan 语法：间接效应定义', type:'代码补全', level:'标准', score:null }
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
