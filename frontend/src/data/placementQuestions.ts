export interface PlacementQuestion {
  id: number;
  category: 'grammar' | 'vocabulary' | 'reading';
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PlacementTestSet {
  id: number;
  title: string;
  questions: PlacementQuestion[];
}

// ══════════════════════════════════════
// BỘ 1 — Trích từ Sample Graduation Test 1 & 2
// ══════════════════════════════════════
const set1: PlacementQuestion[] = [
  // --- GRAMMAR (8 câu) ---
  { id: 1, category: 'grammar', difficulty: 'easy',
    question: 'Diao Chan therapy helps you with ___.', 
    options: ['relaxation', 'relax', 'relaxed', 'relaxing'], correctIndex: 0 },
  { id: 2, category: 'grammar', difficulty: 'easy',
    question: 'What you need is just 30 minutes ___ a day.',
    options: ['massage total body', 'total massage body', 'total body massage', 'body massage total'], correctIndex: 2 },
  { id: 3, category: 'grammar', difficulty: 'medium',
    question: 'Our service is ___ is convenient for businessmen.',
    options: ['available 24/7 which', 'available 24/7, which', 'available 24/7', 'available 24/7 that'], correctIndex: 1 },
  { id: 4, category: 'grammar', difficulty: 'medium',
    question: 'Our natural resources will be ___ unless we save energy.',
    options: ['used for', 'used in', 'used up', 'used all'], correctIndex: 2 },
  { id: 5, category: 'grammar', difficulty: 'medium',
    question: 'Save the energy ___ every day.',
    options: ['which is consuming', 'we are consumed', 'which are consumed', 'we are consuming'], correctIndex: 3 },
  { id: 6, category: 'grammar', difficulty: 'easy',
    question: 'Set air conditioning to come only ___.',
    options: ['when is required', 'when required', 'when is requiring', 'when requiring'], correctIndex: 1 },
  { id: 7, category: 'grammar', difficulty: 'medium',
    question: 'Do you have a passion for ___?',
    options: ['storyteller', 'telling story', 'storytelling', 'teller of a story'], correctIndex: 2 },
  { id: 8, category: 'grammar', difficulty: 'hard',
    question: 'You\'ll find great literature, meet fellow scribblers, ___ your writing journey to the next level.',
    options: ['that take', 'that takes', 'which takes', 'which take'], correctIndex: 2 },
  // --- VOCABULARY (6 câu) ---
  { id: 9, category: 'vocabulary', difficulty: 'easy',
    question: 'You can ___ a call at 0983850619 in advance.',
    options: ['do', 'change', 'make', 'dial'], correctIndex: 2 },
  { id: 10, category: 'vocabulary', difficulty: 'easy',
    question: 'Free hot drinks are also ___.',
    options: ['composing', 'including', 'composed', 'included'], correctIndex: 3 },
  { id: 11, category: 'vocabulary', difficulty: 'medium',
    question: 'Don\'t leave the apps on your phones ___ unnecessarily.',
    options: ['on standby', 'at standby', 'for standby', 'with standby'], correctIndex: 0 },
  { id: 12, category: 'vocabulary', difficulty: 'easy',
    question: 'Don\'t use your ___ every day. Hang out washing outside.',
    options: ['washing machine', 'drying machine', 'cutting machine', 'fixing machine'], correctIndex: 1 },
  { id: 13, category: 'vocabulary', difficulty: 'medium',
    question: 'Meet and learn from ___ authors.',
    options: ['renownedly', 'renown', 'renowned', 'renowning'], correctIndex: 2 },
  { id: 14, category: 'vocabulary', difficulty: 'easy',
    question: '___ experience required for the workshop.',
    options: ['Never', 'Not', 'Neither', 'No'], correctIndex: 3 },
  // --- READING (6 câu) ---
  { id: 15, category: 'reading', difficulty: 'medium',
    context: 'Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world. It is estimated that ___.',
    question: 'Choose the option that best completes the blank.',
    options: [
      'While women and girls represent half of the world\'s population.',
      'Because women and girls represent half of the world\'s population',
      'Women and girls represent half of the world\'s population',
      'Which women and girls represent half of the world\'s population'
    ], correctIndex: 2 },
  { id: 16, category: 'reading', difficulty: 'hard',
    context: 'There are many people who have passed the landmark age of 100. These are people over eighty who have no major illnesses — called "the wellderly".',
    question: 'The word "elderly" is OPPOSITE in meaning to ___.',
    options: ['short-list', 'short-sighted', 'short-lived', 'short-tempered'], correctIndex: 2 },
  { id: 17, category: 'reading', difficulty: 'hard',
    context: 'Scientists looked at diet and lifestyle for an explanation of long life, but these days they are also looking at genetics.',
    question: 'The word "they" refers to ___.',
    options: ['scientists', 'explanations', 'things', 'diet and lifestyle'], correctIndex: 0 },
  { id: 18, category: 'reading', difficulty: 'hard',
    context: 'The new research into long life did scrutinize groups of people who have a genetic connection.',
    question: 'The word "scrutinize" is closest in meaning to ___.',
    options: ['weigh', 'peruse', 'inspect', 'discover'], correctIndex: 2 },
  { id: 19, category: 'reading', difficulty: 'medium',
    context: 'The World Bank ranks Nepal as the 31st poorest country. Surya Karki and his charity UWS are tackling high illiteracy and poverty rates by funding education.',
    question: 'The word "tackling" is closest in meaning to ___.',
    options: ['addressing', 'planning', 'discussing', 'suffering'], correctIndex: 0 },
  { id: 20, category: 'reading', difficulty: 'hard',
    context: 'The devastating earthquake in 2015 damaged 9,300 schools, displacing hundreds of thousands of families.',
    question: 'The word "displacing" mostly means ___.',
    options: ['making people homeless', 'bringing people safety', 'making people lose directions', 'causing people to panic'], correctIndex: 0 },
];

// ══════════════════════════════════════
// BỘ 2 — Trích từ Sample Graduation Test 3 & 4
// ══════════════════════════════════════
const set2: PlacementQuestion[] = [
  { id: 1, category: 'grammar', difficulty: 'easy',
    question: 'We need some tutors ___ students aged 6 and 9.',
    options: ['who to assist', 'able to assist', 'who is able to assist', 'be able to assist'], correctIndex: 0 },
  { id: 2, category: 'grammar', difficulty: 'easy',
    question: 'You will work with children full of ___.',
    options: ['energizer', 'energetic', 'energy', 'energetically'], correctIndex: 2 },
  { id: 3, category: 'grammar', difficulty: 'medium',
    question: 'Don\'t worry ___ you have tutored before.',
    options: ['about', 'that', 'unless', 'if'], correctIndex: 3 },
  { id: 4, category: 'grammar', difficulty: 'medium',
    question: 'We ___ a Chinese Speaking Competition on June 01.',
    options: ['are hosting', 'have hosted', 'had hosted', 'would host'], correctIndex: 0 },
  { id: 5, category: 'grammar', difficulty: 'medium',
    question: 'All students ___ in speaking Chinese can take part.',
    options: ['interesting', 'interested', 'interest', 'uninteresting'], correctIndex: 1 },
  { id: 6, category: 'grammar', difficulty: 'easy',
    question: 'Welcome to Langley College! Classes start next Monday, but you ___ visit from now.',
    options: ['can', 'must', 'could', 'need to'], correctIndex: 0 },
  { id: 7, category: 'grammar', difficulty: 'medium',
    question: 'Our café ___ from 8 AM to 9 PM on weekdays.',
    options: ['was opened', 'opened', 'is opened', 'opens'], correctIndex: 3 },
  { id: 8, category: 'grammar', difficulty: 'hard',
    question: 'Our café opens from 8 AM to 9 PM, ___ convenient for you.',
    options: ['which is', 'which makes', 'that is', 'that makes'], correctIndex: 0 },
  { id: 9, category: 'vocabulary', difficulty: 'easy',
    question: 'ID cards will be ready for ___.',
    options: ['attention', 'domination', 'collection', 'calculation'], correctIndex: 2 },
  { id: 10, category: 'vocabulary', difficulty: 'medium',
    question: 'Time: 8 AM ___ the 22nd of September.',
    options: ['in', 'at', 'on', 'by'], correctIndex: 2 },
  { id: 11, category: 'vocabulary', difficulty: 'medium',
    question: 'You ___ your normal black T-shirts because another club uses those colors.',
    options: ["shouldn't wear", "can't wear", "couldn't wear", "didn't wear"], correctIndex: 0 },
  { id: 12, category: 'vocabulary', difficulty: 'medium',
    question: 'There will be a ___ spot for snacks.',
    options: ['designated', 'designatedly', 'designating', 'designation'], correctIndex: 0 },
  { id: 13, category: 'vocabulary', difficulty: 'easy',
    question: 'Meet your teachers tomorrow ___ course information.',
    options: ['with more', 'at more', 'and more', 'for more'], correctIndex: 3 },
  { id: 14, category: 'vocabulary', difficulty: 'medium',
    question: 'The school will ___ trophies and medals for the winners.',
    options: ['distribute', 'conduct', 'organize', 'execute'], correctIndex: 0 },
  { id: 15, category: 'reading', difficulty: 'medium',
    context: 'Finishing high school is a big step ___ for young people. There are various paths: universities, vocational training, community colleges, apprenticeships, and online courses.',
    question: 'Choose the best option to fill in the blank.',
    options: [
      'that open many doors for young people',
      'opening many doors for young people',
      'what opens many doors for young people',
      'opens many doors for young people'
    ], correctIndex: 1 },
  { id: 16, category: 'reading', difficulty: 'hard',
    context: 'An engine is a machine that creates mechanical motion from energy. Many people are trying to switch to alternative energy sources because gasoline creates pollution and is non-renewable.',
    question: 'Which is NOT mentioned as renewable energy?',
    options: ['Gasoline', 'Biofuel', 'Hydrogen', 'Electricity'], correctIndex: 0 },
  { id: 17, category: 'reading', difficulty: 'medium',
    context: 'Hybrid cars have both a gasoline-powered engine and an electric one. As the gasoline-powered engine runs, it simultaneously recharges the electric engine.',
    question: 'The word "recharges" is closest in meaning to ___.',
    options: ['resumes', 'retreats', 'repels', 'refreshes'], correctIndex: 3 },
  { id: 18, category: 'reading', difficulty: 'hard',
    context: 'In the UK, jokes and tricks can be played until noon on 1 April. After midday it\'s considered bad luck to play a trick.',
    question: 'Which country is NOT mentioned in the passage about April Fools?',
    options: ['Holland', 'Finland', 'England', 'Scotland'], correctIndex: 1 },
  { id: 19, category: 'reading', difficulty: 'medium',
    context: 'Maybe it\'s not your kind of humour, but watch out, there\'s always someone who will find it funny!',
    question: 'The phrasal verb "watch out" is OPPOSITE in meaning to ___.',
    options: ['be alert', 'be careful', 'just notice it', 'just ignore it'], correctIndex: 3 },
  { id: 20, category: 'reading', difficulty: 'hard',
    context: 'Managing change means managing people\'s fear. Resistance to change comes from a fear of the unknown. If you try and bulldoze this resistance, you will fail.',
    question: 'The word "bulldoze" mostly means ___.',
    options: ['suppress', 'ignore', 'encourage', 'receive'], correctIndex: 0 },
];

// ══════════════════════════════════════
// BỘ 3 — Trích từ Sample Graduation Test 5 & 6
// ══════════════════════════════════════
const set3: PlacementQuestion[] = [
  { id: 1, category: 'grammar', difficulty: 'easy',
    question: 'Join us for an ___ Graduation Party this Friday!',
    options: ['forgettable', 'forgetful', 'unforgettable', 'unforgetful'], correctIndex: 2 },
  { id: 2, category: 'grammar', difficulty: 'medium',
    question: 'Celebrate on a night ___ laughter, music, and memories.',
    options: ['which filled with', 'that filled with', 'was filled with', 'filled with'], correctIndex: 3 },
  { id: 3, category: 'grammar', difficulty: 'easy',
    question: 'From a lively dance floor to games, we\'ve got it ___!',
    options: ['almost', 'most', 'all', 'at all'], correctIndex: 2 },
  { id: 4, category: 'grammar', difficulty: 'medium',
    question: 'Are you ___ 15 years old? Do you wish to make a difference?',
    options: ['upper', 'bigger', 'above', 'along'], correctIndex: 2 },
  { id: 5, category: 'grammar', difficulty: 'medium',
    question: 'Do you really wish ___ a difference?',
    options: ['making', 'to make', 'made', 'had made'], correctIndex: 1 },
  { id: 6, category: 'grammar', difficulty: 'hard',
    question: 'Volunteer for our initiative, ___ clean up our communities.',
    options: ['where we all', 'where all we', 'which we all', 'which all we'], correctIndex: 0 },
  { id: 7, category: 'grammar', difficulty: 'medium',
    question: '___ interested in our campaign, please sign up!',
    options: ['If', 'Provided that', 'While', 'So long as'], correctIndex: 0 },
  { id: 8, category: 'grammar', difficulty: 'hard',
    question: 'Our service ___ you to upload and design your own photo book.',
    options: ['offers', 'allows', 'tells', 'provides'], correctIndex: 1 },
  { id: 9, category: 'vocabulary', difficulty: 'easy',
    question: 'Let\'s ___ this milestone remarkable!',
    options: ['remember', 'make', 'take', 'remind'], correctIndex: 1 },
  { id: 10, category: 'vocabulary', difficulty: 'easy',
    question: 'Be there to share the joy and ___ your success!',
    options: ['celebrate', 'congratulate', 'motivate', 'considerate'], correctIndex: 0 },
  { id: 11, category: 'vocabulary', difficulty: 'medium',
    question: 'A caring experience that not only cares for the environment but also ___ the lives of those in need.',
    options: ['advance', 'deteriorate', 'extends', 'brightens'], correctIndex: 3 },
  { id: 12, category: 'vocabulary', difficulty: 'medium',
    question: 'You can ___ between different layouts, themes, and covers.',
    options: ['pick', 'show', 'decide', 'select'], correctIndex: 3 },
  { id: 13, category: 'vocabulary', difficulty: 'medium',
    question: 'Don\'t ___ your memories – capture them in a book.',
    options: ['regret', 'keep', 'miss', 'erase'], correctIndex: 2 },
  { id: 14, category: 'vocabulary', difficulty: 'medium',
    question: 'Start designing today and ___ 20% off your first order!',
    options: ['receive', 'offer', 'buy', 'convince'], correctIndex: 0 },
  { id: 15, category: 'reading', difficulty: 'medium',
    context: 'Without music and sport classes, a child\'s talent may never be discovered. Classrooms may provide an environment ___ in these fields.',
    question: 'Choose the best option to fill the blank.',
    options: [
      'for these children to expose their potential in these fields',
      'for these children exposing their potential in these fields',
      'that these children exposing their potential in these fields',
      'These children expose their potential in these fields'
    ], correctIndex: 0 },
  { id: 16, category: 'reading', difficulty: 'hard',
    context: 'Cultural diversity refers to the presence of multiple cultural groups within a society. It encompasses various aspects such as language, traditions, beliefs, and values.',
    question: 'The word "encompasses" is closest in meaning to ___.',
    options: ['excludes', 'includes', 'diminishes', 'separates'], correctIndex: 1 },
  { id: 17, category: 'reading', difficulty: 'medium',
    context: 'Cultural diversity can enhance social cohesion by encouraging people to work together and learn from one another.',
    question: 'The word "enhance" could be best replaced by ___.',
    options: ['worsen', 'enrich', 'ignore', 'simplify'], correctIndex: 1 },
  { id: 18, category: 'reading', difficulty: 'hard',
    context: 'Despite its benefits, cultural diversity also presents challenges. Misunderstandings and conflicts can arise when people from different backgrounds interact.',
    question: 'The word "its" refers to ___.',
    options: ['cultural diversity', 'interaction', 'exchange of ideas', 'unique experiences'], correctIndex: 0 },
  { id: 19, category: 'reading', difficulty: 'hard',
    context: 'Multiculturalism faces language and identity barriers. Without efforts to bridge cultural differences, it might lead to social fragmentation.',
    question: 'The word "fragmentation" is closest in meaning to ___.',
    options: ['unity', 'division', 'cooperation', 'similarity'], correctIndex: 1 },
  { id: 20, category: 'reading', difficulty: 'medium',
    context: 'Education plays a crucial role in promoting cultural diversity. Schools can create inclusive environments by incorporating diverse perspectives.',
    question: 'Which is TRUE according to the passage?',
    options: [
      'Cultural diversity always leads to misunderstandings.',
      'Cultural diversity has no impact on creativity.',
      'Cultural diversity can reduce prejudices and promote tolerance.',
      'Cultural diversity is irrelevant in the workplace.'
    ], correctIndex: 2 },
];

// Import các bộ đề từ file tách
import { set4, set5, set6, set7 } from './placementQuestionsSets2';
import { set8, set9, set10 } from './placementQuestionsSets3';

// Export tất cả 10 bộ đề
export const PLACEMENT_TEST_SETS: PlacementTestSet[] = [
  { id: 1, title: 'Bộ đề 1', questions: set1 },
  { id: 2, title: 'Bộ đề 2', questions: set2 },
  { id: 3, title: 'Bộ đề 3', questions: set3 },
  { id: 4, title: 'Bộ đề 4', questions: set4 },
  { id: 5, title: 'Bộ đề 5', questions: set5 },
  { id: 6, title: 'Bộ đề 6', questions: set6 },
  { id: 7, title: 'Bộ đề 7', questions: set7 },
  { id: 8, title: 'Bộ đề 8', questions: set8 },
  { id: 9, title: 'Bộ đề 9', questions: set9 },
  { id: 10, title: 'Bộ đề 10', questions: set10 },
];

// Hàm lấy random 1 bộ đề
export function getRandomTestSet(): PlacementTestSet {
  const idx = Math.floor(Math.random() * PLACEMENT_TEST_SETS.length);
  return PLACEMENT_TEST_SETS[idx];
}

// Hàm lấy bộ đề theo ID
export function getTestSetById(id: number): PlacementTestSet | undefined {
  return PLACEMENT_TEST_SETS.find(s => s.id === id);
}
