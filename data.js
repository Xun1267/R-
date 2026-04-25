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
    tasks:    ['判断以下说法是否正确', '思考 CLPM 与 RI-CLPM 的核心区别'],
    judgeQ:   '该研究应使用 RI-CLPM 而非传统 CLPM，因为需要控制个体间稳定差异。',
    answer:   { judge: 'true' },
    feedback: {
      correct:  ['正确理解了 RI-CLPM 与 CLPM 的核心区别：随机截距的引入正是为了控制个体间稳定差异。'],
      issues:   ['CLPM 未控制个体间稳定差异，导致交叉滞后路径估计可能被个体间相关混淆。'],
      why:      ['不控制个体间差异时，纵向路径可能反映的是"高焦虑的人也更容易抑郁"（between效应），而非"焦虑的增加导致抑郁的增加"（within效应）。'],
      next:     ['完成模块 2，深入理解 within/between 的区分原理。']
    },
    hints: [
      '想想研究者提到了"个体之间存在稳定的差异"——这提示了什么？',
      '关注"随机截距"的含义：它是为了控制哪个层面的差异？',
      'RI-CLPM = CLPM + 随机截距。随机截距的作用就是把个体间差异"拿出来"，留下个体内变化。',
      '标准答案：正确。RI-CLPM 通过随机截距控制个体间稳定差异，使交叉滞后路径反映个体内变化，更接近因果推断的目标。'
    ],
    values: [],
    textPrompt: null,
    simOutput: null,
    dataName: 'anxiety_depression_3wave.csv'
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
