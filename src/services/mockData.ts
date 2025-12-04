// Mock data generators for FOCUSBOARD
// These simulate AI responses until Netlify function is connected

import { Inspiration, RoutineTask } from './storage';

export function generateMockInspiration(): Omit<Inspiration, 'id' | 'date'> {
  const inspirations = [
    {
      artist: {
        style: 'Art Nouveau',
        name: 'Alphonse Mucha',
        description: 'Peintre tchèque connu pour ses affiches ornementales et ses motifs floraux distinctifs.',
        palette: ['#D4A574', '#8B7355', '#556B2F', '#2F4F4F', '#DEB887'],
      },
      personality: {
        name: 'Marie Curie',
        bio: 'Physicienne et chimiste franco-polonaise, première femme à recevoir un prix Nobel et seule personne à en avoir reçu dans deux domaines scientifiques différents.',
        wikiLink: 'https://fr.wikipedia.org/wiki/Marie_Curie',
      },
      book: {
        title: 'L\'Étranger',
        author: 'Albert Camus',
        summary: 'Meursault, un employé de bureau algérois, apprend la mort de sa mère. Il assiste aux funérailles sans montrer d\'émotion. Plus tard, il commet un meurtre absurde sur une plage et est condamné à mort, moins pour son crime que pour son indifférence.',
        context: 'Publié en 1942, ce roman illustre la philosophie de l\'absurde développée par Camus.',
        importance: 'Œuvre fondatrice de l\'existentialisme littéraire, elle interroge le sens de l\'existence et les conventions sociales.',
      },
      artwork: {
        name: 'La Nuit étoilée',
        artist: 'Vincent van Gogh',
        techniques: 'Huile sur toile, coups de pinceau tourbillonnants, palette bleu-jaune intense',
        meaning: 'Peinte depuis l\'asile de Saint-Rémy, elle représente la vision tourmentée mais sublime du ciel nocturne par Van Gogh.',
      },
      album: {
        title: 'Histoire de Melody Nelson',
        artist: 'Serge Gainsbourg',
        style: 'Pop orchestrale, rock symphonique',
        spotifyLink: 'https://open.spotify.com/album/4gxLz5lUSlJjGW5yzgcDrN',
      },
      invention: {
        name: 'L\'imprimerie',
        inventor: 'Johannes Gutenberg',
        date: 'vers 1440',
        impact: 'A révolutionné la diffusion du savoir, rendant les livres accessibles et permettant la Renaissance et la Réforme.',
      },
      word: {
        word: 'Sérendipité',
        definition: 'Découverte heureuse faite par hasard, capacité à trouver ce qu\'on ne cherchait pas.',
        etymology: 'Du conte persan "Les Trois Princes de Serendip" où les héros font des découvertes fortuites.',
        example: 'La découverte de la pénicilline par Fleming est un exemple de sérendipité.',
      },
      exercise: 'Écrivez un court récit où votre personnage, inspiré par le style de Mucha, découvre par sérendipité un livre qui changera sa vie, le tout sous un ciel étoilé rappelant Van Gogh.',
    },
    {
      artist: {
        style: 'Impressionnisme',
        name: 'Claude Monet',
        description: 'Chef de file du mouvement impressionniste, célèbre pour ses séries de nénuphars et ses études de lumière.',
        palette: ['#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#E0FFFF'],
      },
      personality: {
        name: 'Simone de Beauvoir',
        bio: 'Philosophe, romancière et essayiste française, figure majeure du féminisme et de l\'existentialisme.',
        wikiLink: 'https://fr.wikipedia.org/wiki/Simone_de_Beauvoir',
      },
      book: {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        summary: 'Un aviateur échoué dans le désert rencontre un petit prince venu d\'un astéroïde. À travers son voyage entre les planètes, le prince livre une critique poétique du monde des adultes.',
        context: 'Écrit en 1943 à New York pendant l\'exil de l\'auteur, c\'est un conte philosophique universel.',
        importance: 'L\'un des livres les plus traduits au monde, il aborde l\'amitié, l\'amour et la perte avec une profondeur accessible.',
      },
      artwork: {
        name: 'Les Nymphéas',
        artist: 'Claude Monet',
        techniques: 'Huile sur toile, touches légères, reflets aquatiques',
        meaning: 'Série monumentale représentant le jardin d\'eau de Giverny, explorant la lumière et ses variations.',
      },
      album: {
        title: 'Homework',
        artist: 'Daft Punk',
        style: 'French house, electronic',
        spotifyLink: 'https://open.spotify.com/album/5uRdvUR7xCnHmUW8n64n9y',
      },
      invention: {
        name: 'Le vaccin',
        inventor: 'Edward Jenner',
        date: '1796',
        impact: 'A ouvert la voie à l\'éradication de maladies mortelles et sauvé des millions de vies.',
      },
      word: {
        word: 'Ephémère',
        definition: 'Qui ne dure qu\'un jour, par extension ce qui est de courte durée.',
        etymology: 'Du grec ephêmeros, de epi (sur) et hêmera (jour).',
        example: 'Les fleurs de cerisier sont d\'une beauté éphémère.',
      },
      exercise: 'Créez une lettre que le Petit Prince écrirait à Simone de Beauvoir sur le thème de la liberté, en utilisant les couleurs impressionnistes de Monet.',
    },
  ];

  return inspirations[Math.floor(Math.random() * inspirations.length)];
}

export function generateMockRoutineTasks(date: string): RoutineTask[] {
  const fixedTasks: Omit<RoutineTask, 'id' | 'date'>[] = [
    { title: 'Réveil', time: '07:30', type: 'fixed', completed: false },
    { title: 'Petit déjeuner', time: '07:45', type: 'fixed', completed: false },
    { title: 'Déjeuner', time: '11:30', type: 'fixed', completed: false },
    { title: 'Dîner', time: '19:00', type: 'fixed', completed: false },
    { title: 'Session jeux', time: '14:00', type: 'fixed', completed: false },
    { title: 'Session stream', time: '20:00', type: 'fixed', completed: false },
    { title: 'Coucher', time: '23:30', type: 'fixed', completed: false },
  ];

  const variableTasks = [
    'Lecture - 30 min',
    'Rangement chambre',
    'Exercices physiques',
    'Révision code',
    'Session créativité',
    'Organisation agenda',
    'Recherche emploi',
    'Méditation',
    'Apprentissage langue',
    'Projet personnel',
  ];

  // Pick 3-4 random variable tasks
  const shuffled = variableTasks.sort(() => Math.random() - 0.5);
  const selectedVariable = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

  const allTasks: RoutineTask[] = [
    ...fixedTasks.map((t, i) => ({
      ...t,
      id: `fixed-${i}`,
      date,
    })),
    ...selectedVariable.map((title, i) => ({
      id: `var-${i}`,
      title,
      time: ['09:00', '10:30', '15:00', '17:00'][i] || '16:00',
      type: 'variable' as const,
      completed: false,
      date,
    })),
  ];

  return allTasks.sort((a, b) => a.time.localeCompare(b.time));
}

export function generateMockQuizCode(): { question: string; options: string[]; correct: number }[] {
  return [
    {
      question: 'Quelle est la vitesse maximale autorisée en agglomération ?',
      options: ['30 km/h', '50 km/h', '70 km/h', '90 km/h'],
      correct: 1,
    },
    {
      question: 'Le panneau triangulaire avec un point d\'exclamation signifie :',
      options: ['Stop obligatoire', 'Danger non spécifié', 'Priorité à droite', 'Zone piétonne'],
      correct: 1,
    },
    {
      question: 'À quelle distance minimale doit-on stationner d\'un passage piéton ?',
      options: ['3 mètres', '5 mètres', '10 mètres', '15 mètres'],
      correct: 1,
    },
    {
      question: 'Le taux d\'alcoolémie maximal autorisé pour un conducteur novice est de :',
      options: ['0,2 g/l', '0,5 g/l', '0,8 g/l', '0 g/l'],
      correct: 0,
    },
    {
      question: 'Sur autoroute, quelle est la distance de sécurité minimale recommandée ?',
      options: ['50 mètres', '2 secondes', '100 mètres', '1 seconde'],
      correct: 1,
    },
  ];
}

export function generateMockQuizInspiration(inspirations: string[]): { question: string; options: string[]; correct: number }[] {
  // This would be based on viewed inspirations in production
  return [
    {
      question: 'Quel artiste est associé au mouvement Art Nouveau ?',
      options: ['Picasso', 'Alphonse Mucha', 'Monet', 'Dali'],
      correct: 1,
    },
    {
      question: 'Qui a écrit "L\'Étranger" ?',
      options: ['Victor Hugo', 'Albert Camus', 'Jean-Paul Sartre', 'Marcel Proust'],
      correct: 1,
    },
    {
      question: 'La sérendipité désigne :',
      options: ['Une maladie rare', 'Une découverte fortuite', 'Un style artistique', 'Un genre musical'],
      correct: 1,
    },
  ];
}
