import { Memory, JournalEntry, ProgressData } from '@/types';

// Sample data for the patient account (patient@memorylane.com)
export function getPatientSampleData() {
  const now = new Date();
  
  // Generate dates for the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  // Sample Memories
  const memories: Memory[] = [
    {
      id: 'mem-1',
      title: 'Family Vacation 2023',
      description: 'Our wonderful trip to the beach with the whole family. Everyone had such a great time!',
      type: 'photo',
      date: dates[15],
      createdAt: new Date(dates[15]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzE0YjhhNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmFtaWx5IFBob3RvPC90ZXh0Pjwvc3ZnPg==',
      tags: ['family', 'vacation', 'beach'],
    },
    {
      id: 'mem-2',
      title: 'Birthday Celebration',
      description: 'My 65th birthday party with all my grandchildren. So much love and joy!',
      type: 'photo',
      date: dates[8],
      createdAt: new Date(dates[8]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VjNDg5OSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QmlydGhkYXk8L3RleHQ+PC9zdmc+',
      tags: ['birthday', 'celebration', 'family'],
    },
    {
      id: 'mem-3',
      title: 'Garden Harvest',
      description: 'Picking fresh tomatoes from our garden. Nothing beats homegrown vegetables!',
      type: 'photo',
      date: dates[22],
      createdAt: new Date(dates[22]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FyZGVuPC90ZXh0Pjwvc3ZnPg==',
      tags: ['garden', 'vegetables', 'harvest'],
    },
    {
      id: 'mem-4',
      title: 'Wedding Anniversary',
      description: 'Celebrating 45 years together with my wonderful spouse. Here\'s to many more!',
      type: 'photo',
      date: dates[5],
      createdAt: new Date(dates[5]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2E4NTVmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QW5uaXZlcnNhcnk8L3RleHQ+PC9zdmc+',
      tags: ['anniversary', 'love', 'celebration'],
    },
    {
      id: 'mem-5',
      title: 'Grandchildren Visit',
      description: 'The kids came over today. We baked cookies and told stories. Perfect day!',
      type: 'photo',
      date: dates[2],
      createdAt: new Date(dates[2]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R3JhbmRraWRzPC90ZXh0Pjwvc3ZnPg==',
      tags: ['family', 'grandchildren', 'baking'],
    },
    {
      id: 'mem-6',
      title: 'Morning Walk',
      description: 'Beautiful sunrise during my morning walk in the park. Nature is so peaceful.',
      type: 'photo',
      date: dates[12],
      createdAt: new Date(dates[12]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2ZmN2YxZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZjY1MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdW5yaXNlPC90ZXh0Pjwvc3ZnPg==',
      tags: ['walk', 'nature', 'morning'],
    },
    {
      id: 'mem-7',
      title: 'Coffee with Friends',
      description: 'Meeting old friends for coffee. We reminisced about old times. Great conversation!',
      type: 'photo',
      date: dates[18],
      createdAt: new Date(dates[18]).toISOString(),
      content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzhiNWNmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29mZmVlPC90ZXh0Pjwvc3ZnPg==',
      tags: ['friends', 'coffee', 'social'],
    },
  ];

  // Sample Journal Entries
  const journalEntries: JournalEntry[] = [
    {
      id: 'entry-1',
      content: 'Feeling great today! The weather is beautiful and I spent time in the garden. My memory feels sharp today.',
      date: new Date(dates[0]).toISOString(),
      sentiment: 'positive',
      keywords: ['garden', 'weather', 'memory', 'feeling good'],
    },
    {
      id: 'entry-2',
      content: 'Had a wonderful visit with my daughter today. We looked through old photo albums together. Those memories brought back such joy.',
      date: new Date(dates[1]).toISOString(),
      sentiment: 'positive',
      keywords: ['family', 'daughter', 'photos', 'memories', 'joy'],
    },
    {
      id: 'entry-3',
      content: 'Feeling a bit tired today. Took a long nap in the afternoon. Sometimes I forget things but that\'s okay.',
      date: new Date(dates[2]).toISOString(),
      sentiment: 'neutral',
      keywords: ['tired', 'nap', 'forgetting'],
    },
    {
      id: 'entry-4',
      content: 'Played memory games today and did really well! Remembered 8 out of 10 items. Feeling accomplished.',
      date: new Date(dates[3]).toISOString(),
      sentiment: 'positive',
      keywords: ['memory games', 'accomplishment', 'success'],
    },
    {
      id: 'entry-5',
      content: 'Missing my spouse today. It\'s been hard since they passed, but looking at old photos helps.',
      date: new Date(dates[4]).toISOString(),
      sentiment: 'negative',
      keywords: ['missing', 'spouse', 'photos', 'memories'],
    },
    {
      id: 'entry-6',
      content: 'Grandchildren came over! We had so much fun baking cookies and playing games. Their laughter filled the house.',
      date: new Date(dates[5]).toISOString(),
      sentiment: 'positive',
      keywords: ['grandchildren', 'baking', 'fun', 'laughter'],
    },
    {
      id: 'entry-7',
      content: 'Feeling confused about dates today. Had to check the calendar multiple times. But I managed to get through the day.',
      date: new Date(dates[6]).toISOString(),
      sentiment: 'neutral',
      keywords: ['confused', 'dates', 'calendar'],
    },
    {
      id: 'entry-8',
      content: 'Beautiful sunrise this morning. Went for a walk and felt so peaceful. Nature always helps clear my mind.',
      date: new Date(dates[7]).toISOString(),
      sentiment: 'positive',
      keywords: ['sunrise', 'walk', 'nature', 'peaceful'],
    },
    {
      id: 'entry-9',
      content: 'Celebrated my birthday today! All the family came over. So much love and joy. Feeling very grateful.',
      date: new Date(dates[8]).toISOString(),
      sentiment: 'positive',
      keywords: ['birthday', 'family', 'love', 'grateful'],
    },
    {
      id: 'entry-10',
      content: 'Doctor appointment today. Everything looks good. Feeling hopeful about my health.',
      date: new Date(dates[9]).toISOString(),
      sentiment: 'positive',
      keywords: ['doctor', 'health', 'hopeful'],
    },
    {
      id: 'entry-11',
      content: 'Watched my favorite old movie today. Brought back so many memories from when I was younger.',
      date: new Date(dates[10]).toISOString(),
      sentiment: 'positive',
      keywords: ['movie', 'memories', 'nostalgia'],
    },
    {
      id: 'entry-12',
      content: 'Feeling a bit down today. Hard to remember some things. But I know tomorrow will be better.',
      date: new Date(dates[11]).toISOString(),
      sentiment: 'negative',
      keywords: ['down', 'remembering', 'hope'],
    },
    {
      id: 'entry-13',
      content: 'Did my daily memory exercises. Getting better each day! Feeling proud of my progress.',
      date: new Date(dates[12]).toISOString(),
      sentiment: 'positive',
      keywords: ['exercises', 'progress', 'proud'],
    },
    {
      id: 'entry-14',
      content: 'Met with friends for lunch. We laughed and shared stories. Good company always lifts my spirits.',
      date: new Date(dates[13]).toISOString(),
      sentiment: 'positive',
      keywords: ['friends', 'lunch', 'laughing', 'stories'],
    },
    {
      id: 'entry-15',
      content: 'Spent time organizing old photos. Found pictures I hadn\'t seen in years. What a treasure!',
      date: new Date(dates[14]).toISOString(),
      sentiment: 'positive',
      keywords: ['photos', 'organizing', 'treasure', 'memories'],
    },
  ];

  // Sample Progress Data (last 7 days)
  const progressData: ProgressData[] = dates.slice(0, 7).map((date, idx) => ({
    date: new Date(date).toISOString(),
    quizScore: Math.floor(Math.random() * 20) + 75, // 75-95
    engagementTime: Math.floor(Math.random() * 15) + 20, // 20-35 minutes
    sentimentScore: Math.floor(Math.random() * 25) + 60, // 60-85
    recognitions: Math.floor(Math.random() * 2) + 5, // 5-7
  }));

  // Sample Quiz Results
  const quizResults = dates.slice(0, 14).map((date, idx) => ({
    quizId: `quiz-${idx + 1}`,
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    date: new Date(date).toISOString(),
  }));

  return {
    memories,
    journalEntries,
    progressData,
    quizResults,
  };
}

