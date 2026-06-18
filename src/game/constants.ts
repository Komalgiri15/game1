import type {
  AchievementDef,
  AvatarDef,
  DifficultyLevel,
  FactOrbData,
  FinalTruthPart,
  MythQuestionSet,
  StageConfig,
} from './types'

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'starting-out',
    label: 'Just Starting Out',
    description:
      'Honest self-check-in: you’re still learning what perimenopause even means.',
    startingClarity: 5,
    questionTime: 12,
    timerLabel: 'Slower pace',
  },
  {
    id: 'informed',
    label: 'Somewhat Informed',
    description:
      'You know the basics — but nuanced myths can still sound almost right.',
    startingClarity: 4,
    questionTime: 9,
    timerLabel: 'Medium pace',
  },
  {
    id: 'confident',
    label: 'Already Confident',
    description:
      'You think you’ve got this — less Clarity and the fastest timer will test that.',
    startingClarity: 3,
    questionTime: 6,
    timerLabel: 'Fastest pace',
  },
]

export const STAGES: StageConfig[] = [
  {
    id: 'perimenopause',
    title: 'Perimenopause',
    subtitle: 'Irregular cycles, early mood shifts, first signs misread',
    clearBanner: 'Perimenopause Understood',
    correctToClear: 3,
    stageColor: '#b5577a',
    stageColorDim: '#ffd9e3',
    bgClass: 'bg-stage-blush',
  },
  {
    id: 'menopause',
    title: 'Menopause',
    subtitle: 'HRT, exercise, symptom management — the confusing middle',
    clearBanner: 'Menopause Understood',
    correctToClear: 4,
    stageColor: '#973f61',
    stageColorDim: '#ffb0c9',
    bgClass: 'bg-stage-rose',
  },
  {
    id: 'post-menopause',
    title: 'Post-Menopause',
    subtitle: 'Long-term health, ongoing hormones, life afterward',
    clearBanner: 'Post-Menopause Understood',
    correctToClear: 4,
    stageColor: '#8e7fb8',
    stageColorDim: '#e8ddff',
    bgClass: 'bg-stage-lavender',
  },
]

/** Full question bank — tier tags control difficulty filtering in stages 2–3 */
export const QUESTION_BANK: MythQuestionSet[] = [
  // ── Perimenopause (all tiers) ──
  {
    id: 'perimenopause-1',
    statement:
      'Irregular periods during perimenopause always mean something is seriously wrong.',
    isTrue: false,
    truth:
      'Irregular cycles are a hallmark of perimenopause. While changes should be discussed with a provider, they are often a normal part of the transition.',
  },
  {
    id: 'perimenopause-2',
    statement:
      'Mood shifts in perimenopause can be linked to changing hormone levels.',
    isTrue: true,
    truth:
      'Fluctuating estrogen and progesterone can affect neurotransmitters like serotonin — this is physiological, not weakness.',
  },
  {
    id: 'perimenopause-3',
    statement:
      'Sleep disruption in your 40s is unrelated to hormonal changes.',
    isTrue: false,
    truth:
      'Hormone shifts commonly disrupt sleep through night sweats, anxiety, and changing progesterone levels.',
  },
  {
    id: 'perimenopause-4',
    statement:
      'You can enter perimenopause years before your last period.',
    isTrue: true,
    truth:
      'Perimenopause can begin in your 30s or 40s — often 4–10 years before menopause — with symptoms starting well before periods stop.',
  },
  {
    id: 'perimenopause-5',
    statement:
      'Brain fog during perimenopause is just a sign you need more coffee.',
    isTrue: false,
    truth:
      'Cognitive changes are linked to hormonal fluctuations and sleep disruption — they are real, not imagined.',
  },
  {
    id: 'perimenopause-6',
    statement:
      'Hot flashes only happen after your last period.',
    isTrue: false,
    truth:
      'Hot flashes and night sweats often begin during perimenopause, sometimes years before periods end.',
  },

  // ── Menopause — simple (starting-out) ──
  {
    id: 'menopause-s1',
    tier: 'simple',
    statement: 'Menopause is officially defined as 12 months without a period.',
    isTrue: true,
    truth:
      'Menopause is a specific point in time — 12 consecutive months without menstruation.',
  },
  {
    id: 'menopause-s2',
    tier: 'simple',
    statement:
      'You should just endure menopause symptoms without seeking help.',
    isTrue: false,
    truth:
      'Symptoms that affect sleep, work, or wellbeing deserve medical attention. Treatment options exist.',
  },
  {
    id: 'menopause-s3',
    tier: 'simple',
    statement: 'Your sex life is over after menopause.',
    isTrue: false,
    truth:
      'Intimacy can continue to be fulfilling. Vaginal dryness and libido changes are treatable.',
  },
  {
    id: 'menopause-s4',
    tier: 'simple',
    statement: 'Menopause affects every woman differently.',
    isTrue: true,
    truth:
      'Symptom type, severity, and duration vary widely. Your experience is valid.',
  },

  // ── Menopause — nuanced (informed) ──
  {
    id: 'menopause-n1',
    tier: 'nuanced',
    statement:
      'Because HRT has risks, it is never appropriate for any woman.',
    isTrue: false,
    truth:
      'HRT risks vary by age, health history, and formulation. For many women, benefits outweigh risks when appropriately prescribed.',
  },
  {
    id: 'menopause-n2',
    tier: 'nuanced',
    statement:
      'Exercise can help manage menopause symptoms, but it cannot replace medical care when needed.',
    isTrue: true,
    truth:
      'Movement supports mood, sleep, and bone health — and works alongside medical options, not instead of them.',
  },
  {
    id: 'menopause-n3',
    tier: 'nuanced',
    statement:
      'Hot flashes are embarrassing but otherwise harmless.',
    isTrue: false,
    truth:
      'Untreated vasomotor symptoms are linked to sleep loss, cardiovascular risk, and reduced quality of life.',
  },
  {
    id: 'menopause-n4',
    tier: 'nuanced',
    statement:
      'Weight gain during menopause is entirely unavoidable no matter what you do.',
    isTrue: false,
    truth:
      'Metabolism shifts, but nutrition, strength training, sleep, and hormonal support can all help.',
  },
  {
    id: 'menopause-n5',
    tier: 'nuanced',
    statement:
      'Natural remedies alone are always enough to manage severe menopause symptoms.',
    isTrue: false,
    truth:
      'Some women benefit from lifestyle changes alone; others need medical treatment. Severity and individual needs matter.',
  },

  // ── Menopause — hard (confident) ──
  {
    id: 'menopause-h1',
    tier: 'hard',
    statement:
      'Since breast cancer risk exists, no woman over 50 should ever consider HRT.',
    isTrue: false,
    truth:
      'Risk is individual. For many healthy women within 10 years of menopause, systemic HRT can be safe and effective.',
  },
  {
    id: 'menopause-h2',
    tier: 'hard',
    statement:
      'If you can push through menopause symptoms, medical treatment is unnecessary.',
    isTrue: false,
    truth:
      'Enduring untreated symptoms can affect cardiovascular health, bone density, and long-term wellbeing.',
  },
  {
    id: 'menopause-h3',
    tier: 'hard',
    statement:
      'Bioidentical hormones marketed as “natural” are always safer than conventional HRT.',
    isTrue: false,
    truth:
      '“Bioidentical” is a marketing term. Safety depends on formulation, dose, and individual health — not the label.',
  },
  {
    id: 'menopause-h4',
    tier: 'hard',
    statement:
      'Antidepressants are only prescribed for menopause when a woman has clinical depression.',
    isTrue: false,
    truth:
      'Low-dose SSRIs/SNRIs are an evidence-based option for hot flashes even without a depression diagnosis.',
  },

  // ── Post-Menopause — simple ──
  {
    id: 'post-s1',
    tier: 'simple',
    statement: 'Bone loss after menopause is inevitable and untreatable.',
    isTrue: false,
    truth:
      'Bone density declines, but exercise, calcium, vitamin D, and medications can significantly slow loss.',
  },
  {
    id: 'post-s2',
    tier: 'simple',
    statement: 'Heart disease risk rises after menopause.',
    isTrue: true,
    truth:
      'After menopause, heart disease becomes the leading health risk for women — monitoring matters.',
  },
  {
    id: 'post-s3',
    tier: 'simple',
    statement: 'Post-menopause means you are officially "old."',
    isTrue: false,
    truth:
      'Menopause is a life stage, not an expiration date. Many women thrive in the decades afterward.',
  },
  {
    id: 'post-s4',
    tier: 'simple',
    statement: 'Strength training is especially important after menopause.',
    isTrue: true,
    truth:
      'Muscle mass and bone density both benefit from resistance training — one of the most powerful tools for healthy aging.',
  },

  // ── Post-Menopause — nuanced ──
  {
    id: 'post-n1',
    tier: 'nuanced',
    statement:
      'Once menopause is over, all symptoms disappear within a few months.',
    isTrue: false,
    truth:
      'Some symptoms resolve, but vaginal dryness, joint pain, or sleep issues can persist and benefit from ongoing care.',
  },
  {
    id: 'post-n2',
    tier: 'nuanced',
    statement:
      'Oestrogen still plays a role in the body after menopause.',
    isTrue: true,
    truth:
      'Local tissues still convert hormones; oestrogen receptors remain active — which is why local treatments can help.',
  },
  {
    id: 'post-n3',
    tier: 'nuanced',
    statement:
      'Nothing can be done to improve hormonal harmony post-menopause.',
    isTrue: false,
    truth:
      'Lifestyle, nutrition, stress management, and targeted therapies can all support wellbeing.',
  },
  {
    id: 'post-n4',
    tier: 'nuanced',
    statement:
      'Cognitive changes after menopause always indicate early dementia.',
    isTrue: false,
    truth:
      'Some cognitive shifts are normal; persistent or worsening concerns should be evaluated by a provider.',
  },
  {
    id: 'post-n5',
    tier: 'nuanced',
    statement:
      'Women no longer need pelvic floor care after menopause.',
    isTrue: false,
    truth:
      'Pelvic floor health remains important — urinary symptoms and prolapse risk can increase with age.',
  },

  // ── Post-Menopause — hard ──
  {
    id: 'post-h1',
    tier: 'hard',
    statement:
      'Because menopause is “over,” cardiovascular risk returns to pre-menopause levels.',
    isTrue: false,
    truth:
      'Cardiovascular risk remains elevated after menopause — it does not simply revert.',
  },
  {
    id: 'post-h2',
    tier: 'hard',
    statement:
      'Local vaginal oestrogen carries the same systemic risks as oral HRT.',
    isTrue: false,
    truth:
      'Low-dose local oestrogen has minimal systemic absorption and is considered safe for most women, including many with breast cancer history.',
  },
  {
    id: 'post-h3',
    tier: 'hard',
    statement:
      'Supplements alone can fully replace the bone-protective effects lost after menopause.',
    isTrue: false,
    truth:
      'Calcium and vitamin D help, but weight-bearing exercise and prescribed medications are often needed for significant protection.',
  },
  {
    id: 'post-h4',
    tier: 'hard',
    statement:
      'Sexual health concerns after menopause are purely psychological, not physical.',
    isTrue: false,
    truth:
      'Vaginal atrophy, reduced lubrication, and tissue changes are physical — and highly treatable.',
  },
]

export const FINAL_TRUTH_DEFAULT: FinalTruthPart[] = [
  {
    statement: 'Menopause inevitably ruins your quality of life.',
    isTrue: false,
    truth:
      'Menopause is a transition — not a verdict. With knowledge, support, and care, quality of life can remain rich and fulfilling.',
  },
  {
    statement:
      'There is nothing you can medically or practically do to manage menopause.',
    isTrue: false,
    truth:
      'From lifestyle changes and HRT to sleep strategies and pelvic health support, evidence-based options exist.',
  },
]

export const FINAL_TRUTH_ALTERNATES: FinalTruthPart[][] = [
  [
    {
      statement:
        'Every woman experiences debilitating menopause symptoms — it is universal.',
      isTrue: false,
      truth:
        'Experience varies enormously. Some women have mild symptoms; others need support — neither is “wrong.”',
    },
    {
      statement:
        'Once symptoms ease, you no longer need any ongoing menopause-related care.',
      isTrue: false,
      truth:
        'Bone health, heart health, and pelvic wellbeing all benefit from continued attention long after hot flashes stop.',
    },
  ],
  [
    {
      statement:
        'Menopause marks the end of a woman’s productive and vital years.',
      isTrue: false,
      truth:
        'Many women report renewed focus, confidence, and purpose in post-menopausal decades.',
    },
    {
      statement:
        'Seeking help for menopause means you have failed to cope on your own.',
      isTrue: false,
      truth:
        'Asking for support is a sign of self-awareness — the same as seeking care for any other health transition.',
    },
  ],
  [
    {
      statement:
        'All menopause symptoms are purely psychological and respond only to mindset.',
      isTrue: false,
      truth:
        'Vasomotor, urogenital, and musculoskeletal changes have clear physiological drivers.',
    },
    {
      statement:
        'Natural ageing after menopause cannot be influenced by lifestyle or medicine.',
      isTrue: false,
      truth:
        'Nutrition, movement, sleep, stress management, and targeted therapies all meaningfully shape outcomes.',
    },
  ],
]

export const FINAL_TRUTH_REVEAL =
  'Menopause is a transition, not an ending. With knowledge, support, and the right care, you can rebuild strength and hormonal harmony.'

export const FACT_ORBS: FactOrbData[] = [
  {
    id: 'sleep',
    label: 'Rest',
    truth: 'Quality sleep supports hormone balance — prioritize rest during perimenopause and beyond.',
  },
  {
    id: 'exercise',
    label: 'Movement',
    truth: 'Strength training protects bone density and metabolism after menopause.',
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    truth: 'Balanced nutrition helps manage weight shifts and supports cardiovascular health.',
  },
  {
    id: 'support',
    label: 'Support',
    truth: 'Talking with a provider about symptoms is strength — not weakness.',
  },
]

export const ACHIEVEMENTS: AchievementDef[] = [
  { streak: 3, title: 'Truth Streak' },
  { streak: 5, title: 'Myth Crusher' },
  { streak: 10, title: 'Clarity Champion' },
]

export const AVATARS: AvatarDef[] = [
  {
    id: 'guide',
    label: 'Guide',
    description: 'Your graceful companion through every stage.',
  },
  {
    id: 'butterfly',
    label: 'Butterfly',
    description: 'Light and airy through early change.',
  },
  {
    id: 'lantern',
    label: 'Lantern',
    description: 'Carries Clarity through the middle journey.',
  },
  {
    id: 'balloon',
    label: 'Balloon',
    description: 'Calm ascent into post-menopause wisdom.',
  },
]

/** Drift speed multiplier by difficulty (higher = faster myths) */
export const DIFFICULTY_SPEED: Record<string, number> = {
  'starting-out': 0.85,
  informed: 1.0,
  confident: 1.2,
}

/** Seconds between myth bubbles (one at a time) */
export const DIFFICULTY_SPAWN: Record<string, number> = {
  'starting-out': 2.3,
  informed: 1.9,
  confident: 1.5,
}

/** Luminous soap-bubble palette — each myth picks a random hue */
export const MYTH_BUBBLE_PALETTE = [
  { color: '#b5577a', dim: '#ffd9e3', halo: 'rgba(255, 190, 210, 0.2)' },
  { color: '#8e7fb8', dim: '#e8ddff', halo: 'rgba(195, 180, 255, 0.2)' },
  { color: '#d6a85c', dim: '#ffead0', halo: 'rgba(255, 215, 160, 0.22)' },
  { color: '#6a9e8a', dim: '#d8f0e4', halo: 'rgba(170, 220, 195, 0.2)' },
  { color: '#5a8eb8', dim: '#d4eaf8', halo: 'rgba(160, 205, 240, 0.2)' },
  { color: '#c96a88', dim: '#ffe2ec', halo: 'rgba(255, 175, 200, 0.2)' },
] as const

/** Stage 1 = 1×, stage 2 = 1.5×, stage 3 = 2× drift speed */
export function stageSpeedMultiplier(stageIndex: number): number {
  return 1 + stageIndex * 0.5
}

