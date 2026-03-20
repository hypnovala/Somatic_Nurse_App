import type {
  CheckInSubmission,
  QuestionDefinition,
  SomaticExercise,
  SomaticResult,
  TtsVoiceOption,
} from '@/lib/types';

export const QUESTIONS: QuestionDefinition[] = [
  {
    key: 'activation',
    label: 'How activated does your body feel right now?',
    hint: '1 = calm, 10 = very stressed',
  },
  {
    key: 'fatigue',
    label: 'How tired do you feel after your shift?',
    hint: '1 = energized, 10 = deeply depleted',
  },
  {
    key: 'tension',
    label: 'How much tension are you holding in your body?',
    hint: '1 = loose, 10 = very tight',
  },
  {
    key: 'breathRestriction',
    label: 'How easy does it feel to take a full breath?',
    hint: '1 = easy, 10 = restricted',
  },
  {
    key: 'support',
    label: 'How emotionally supported do you feel right now?',
    hint: '1 = very supported, 10 = very alone',
  },
];

export const TTS_VOICE_OPTIONS: TtsVoiceOption[] = [
  {
    id: 'alloy',
    label: 'Alloy',
    description: 'Clear, steady, and grounded for a calm clinical tone.',
  },
  {
    id: 'verse',
    label: 'Verse',
    description: 'Warm and restorative for a softer reset experience.',
  },
  {
    id: 'sage',
    label: 'Sage',
    description: 'Gentle and reassuring with a composed bedside cadence.',
  },
];

export const EXERCISES: Record<SomaticExercise['id'], SomaticExercise> = {
  grounding: {
    id: 'grounding',
    name: 'Feet-to-Floor Grounding',
    duration: '45–60 sec',
    why: 'Grounding helps the nervous system orient to the present moment and reduce stress load.',
    steps: [
      'Plant both feet firmly on the floor.',
      'Press down slowly as if the ground can hold you.',
      'Look left and right and name 3 neutral things you see.',
      'Exhale a little longer than you inhale for 3 rounds.',
    ],
  },
  sigh: {
    id: 'sigh',
    name: 'Physiological Sigh Reset',
    duration: '20–40 sec',
    why: 'A long exhale is a fast cue of safety and can help reduce body alarm.',
    steps: [
      'Inhale gently through your nose.',
      'Take a short second sip of air.',
      'Exhale slowly through your mouth.',
      'Repeat 3 to 5 cycles without forcing it.',
    ],
  },
  unwind: {
    id: 'unwind',
    name: 'Shoulder Unwind + Jaw Soften',
    duration: '30–60 sec',
    why: 'Unwinding shoulders and jaw releases common places where healthcare stress gets stored.',
    steps: [
      'Roll shoulders up, back, and down slowly.',
      'Let your jaw unclench.',
      'Rest your tongue softly in your mouth.',
      'Take 3 easy breaths into the back of your neck.',
    ],
  },
};

const round = (value: number) => Math.round(value * 10) / 10;

const summarizeNotes = (notes: string): string | undefined => {
  const trimmed = notes.trim();
  if (!trimmed) return undefined;

  const sentence = trimmed.replace(/\s+/g, ' ');
  if (sentence.length <= 180) {
    return sentence;
  }

  return `${sentence.slice(0, 177).trimEnd()}...`;
};

const getSupportMessage = ({ values }: CheckInSubmission, averageLoad: number): string => {
  const { fatigue, activation, breathRestriction, support } = values;

  if (fatigue >= 8) {
    return 'You have carried a great deal today. Let this reset be a small permission slip to soften, release pressure, and let your body do a little less for the next minute.';
  }

  if (activation >= 8 || breathRestriction >= 8) {
    return 'Your system sounds highly activated right now. Nothing is wrong with you—your body is asking for a clear cue of safety, slower exhale, and a gentler pace.';
  }

  if (support >= 8) {
    return 'If you feel alone right now, let this be a reminder that care belongs to you too. You do not have to earn this pause before your body is allowed to receive it.';
  }

  if (averageLoad >= 6) {
    return 'There is a moderate amount for your body to hold right now. Return slowly, one sensation at a time, and let this reset bring you back into contact with the ground beneath you.';
  }

  return 'You are allowed to meet this moment gently. Take this short reset as a way to stay connected to your body with steadiness, care, and a little more space.';
};

const getExercise = ({ values }: CheckInSubmission, averageLoad: number): SomaticExercise => {
  const { activation, breathRestriction, tension, fatigue } = values;

  if (breathRestriction >= 8 || activation >= 8) {
    return EXERCISES.sigh;
  }

  if (tension >= 8 || fatigue >= 8) {
    return EXERCISES.unwind;
  }

  if (averageLoad >= 6) {
    return EXERCISES.grounding;
  }

  return EXERCISES.sigh;
};

const getWhyThisHelps = (exercise: SomaticExercise, averageLoad: number): string => {
  const shared = 'Short somatic practices work by giving your nervous system a concrete sensory cue instead of asking you to think your way out of stress.';

  if (exercise.id === 'sigh') {
    return `${shared} This pattern lengthens the exhale and can lower the sense of internal alarm when your breath feels tight or your mind is still moving at shift-speed.`;
  }

  if (exercise.id === 'unwind') {
    return `${shared} Releasing the jaw, shoulders, and back of the neck can reduce the protective bracing that often lingers after patient care, charting, and sustained vigilance.`;
  }

  return `${shared} When your overall load is elevated, feeling the floor and orienting to your environment helps your body register that this moment is different from the demands you just moved through.`;
};

export const generateSomaticReset = (submission: CheckInSubmission): SomaticResult => {
  const scores = Object.values(submission.values);
  const averageLoad = round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const exercise = getExercise(submission, averageLoad);
  const supportMessage = getSupportMessage(submission, averageLoad);
  const whyThisHelps = getWhyThisHelps(exercise, averageLoad);
  const noteSummary = summarizeNotes(submission.notes);
  const audioScript = `${supportMessage} For your reset, try ${exercise.name}. ${exercise.steps[0]} ${exercise.steps[exercise.steps.length - 1]}`;

  return {
    supportMessage,
    exercise,
    audioScript,
    whyThisHelps,
    noteSummary,
    averageLoad,
  };
};
