import { Memory, JournalEntry, ProgressData, Album } from '@/types';

// Sample data for the patient account (patient@reminoracare.com)
export function getPatientSampleData() {
  const now = new Date();
  
  // Generate dates for the last 365 days (for medicines that may have older start dates)
  const dates = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  // Sample Memories with stock images from Unsplash
  const memories: Memory[] = [
    {
      id: 'mem-1',
      title: 'Family Vacation 2023',
      description: 'Our wonderful trip to the beach with the whole family. Everyone had such a great time!',
      type: 'photo',
      date: dates[15],
      createdAt: new Date(dates[15]).toISOString(),
      content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      tags: ['family', 'vacation', 'beach'],
    },
    {
      id: 'mem-2',
      title: 'Birthday Celebration',
      description: 'My 65th birthday party with all my grandchildren. So much love and joy!',
      type: 'photo',
      date: dates[8],
      createdAt: new Date(dates[8]).toISOString(),
      content: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      tags: ['birthday', 'celebration', 'family'],
    },
    {
      id: 'mem-3',
      title: 'Garden Harvest',
      description: 'Picking fresh tomatoes from our garden. Nothing beats homegrown vegetables!',
      type: 'photo',
      date: dates[22],
      createdAt: new Date(dates[22]).toISOString(),
      content: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      tags: ['garden', 'vegetables', 'harvest'],
    },
    {
      id: 'mem-4',
      title: 'Wedding Anniversary',
      description: 'Celebrating 45 years together with my wonderful spouse. Here\'s to many more!',
      type: 'photo',
      date: dates[5],
      createdAt: new Date(dates[5]).toISOString(),
      content: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      tags: ['anniversary', 'love', 'celebration'],
    },
    {
      id: 'mem-5',
      title: 'Grandchildren Visit',
      description: 'The kids came over today. We baked cookies and told stories. Perfect day!',
      type: 'photo',
      date: dates[2],
      createdAt: new Date(dates[2]).toISOString(),
      content: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      tags: ['family', 'grandchildren', 'baking'],
    },
    {
      id: 'mem-6',
      title: 'Morning Walk',
      description: 'Beautiful sunrise during my morning walk in the park. Nature is so peaceful.',
      type: 'photo',
      date: dates[12],
      createdAt: new Date(dates[12]).toISOString(),
      content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      tags: ['walk', 'nature', 'morning'],
    },
    {
      id: 'mem-7',
      title: 'Coffee with Friends',
      description: 'Meeting old friends for coffee. We reminisced about old times. Great conversation!',
      type: 'photo',
      date: dates[18],
      createdAt: new Date(dates[18]).toISOString(),
      content: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
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

  // Stock images for different album themes
  const albumImageCollections: Record<string, string[]> = {
    'family-vacation': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    ],
    'birthday': [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    'garden': [
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    ],
    'grandchildren': [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    'anniversary': [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    ],
    'morning-walk': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    ],
    'friends': [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    ],
    'holidays': [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    ],
  };

  // Sample Albums
  const createAlbumMemories = (albumId: string, count: number, startDateOffset: number, theme: string): Memory[] => {
    const imageCollection = albumImageCollections[theme] || albumImageCollections['friends'];
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (startDateOffset + i));
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        id: `${albumId}-mem-${i + 1}`,
        title: `Photo ${i + 1}`,
        description: `A wonderful memory from the album collection`,
        type: 'photo' as const,
        date: dateStr,
        createdAt: new Date(dateStr).toISOString(),
        content: imageCollection[i % imageCollection.length],
        tags: ['album', 'collection'],
      };
    });
  };

  // Create albums
  const album1Memories = createAlbumMemories('album-1', 12, 15, 'family-vacation');
  const albums: Album[] = [
    {
      id: 'album-1',
      title: 'Family Vacation 2023',
      description: 'Complete collection of photos from our wonderful family vacation to the beach',
      memories: album1Memories,
      date: dates[15],
      createdAt: new Date(dates[15]).toISOString(),
      tags: ['family', 'vacation', 'beach', 'summer'],
      coverImage: album1Memories[0]?.content,
    },
    {
      id: 'album-2',
      title: 'Birthday Celebrations',
      description: 'All the birthday celebrations and parties throughout the years',
      memories: createAlbumMemories('album-2', 15, 8, 'birthday'),
      date: dates[8],
      createdAt: new Date(dates[8]).toISOString(),
      tags: ['birthday', 'celebration', 'family', 'party'],
      coverImage: createAlbumMemories('album-2', 1, 8, 'birthday')[0]?.content,
    },
    {
      id: 'album-3',
      title: 'Garden Through the Seasons',
      description: 'Documenting our beautiful garden as it changes through the seasons',
      memories: createAlbumMemories('album-3', 20, 22, 'garden'),
      date: dates[22],
      createdAt: new Date(dates[22]).toISOString(),
      tags: ['garden', 'nature', 'seasons', 'flowers'],
      coverImage: createAlbumMemories('album-3', 1, 22, 'garden')[0]?.content,
    },
    {
      id: 'album-4',
      title: 'Grandchildren Growing Up',
      description: 'Precious moments watching the grandchildren grow and play',
      memories: createAlbumMemories('album-4', 18, 2, 'grandchildren'),
      date: dates[2],
      createdAt: new Date(dates[2]).toISOString(),
      tags: ['grandchildren', 'family', 'growth', 'love'],
      coverImage: createAlbumMemories('album-4', 1, 2, 'grandchildren')[0]?.content,
    },
    {
      id: 'album-5',
      title: 'Wedding Anniversary Album',
      description: 'Celebrating 45 years of marriage and all the memories we\'ve made together',
      memories: createAlbumMemories('album-5', 10, 5, 'anniversary'),
      date: dates[5],
      createdAt: new Date(dates[5]).toISOString(),
      tags: ['anniversary', 'wedding', 'love', 'couple'],
      coverImage: createAlbumMemories('album-5', 1, 5, 'anniversary')[0]?.content,
    },
    {
      id: 'album-6',
      title: 'Morning Walks',
      description: 'Beautiful sunrise and nature photos from morning walks',
      memories: createAlbumMemories('album-6', 14, 12, 'morning-walk'),
      date: dates[12],
      createdAt: new Date(dates[12]).toISOString(),
      tags: ['walk', 'nature', 'morning', 'sunrise'],
      coverImage: createAlbumMemories('album-6', 1, 12, 'morning-walk')[0]?.content,
    },
    {
      id: 'album-7',
      title: 'Friends & Social Gatherings',
      description: 'Memories with friends, coffee meetups, and social events',
      memories: createAlbumMemories('album-7', 16, 18, 'friends'),
      date: dates[18],
      createdAt: new Date(dates[18]).toISOString(),
      tags: ['friends', 'social', 'coffee', 'community'],
      coverImage: createAlbumMemories('album-7', 1, 18, 'friends')[0]?.content,
    },
    {
      id: 'album-8',
      title: 'Holiday Memories',
      description: 'Christmas, Thanksgiving, and other holiday celebrations with family',
      memories: createAlbumMemories('album-8', 12, 25, 'holidays'),
      date: dates[25],
      createdAt: new Date(dates[25]).toISOString(),
      tags: ['holidays', 'christmas', 'thanksgiving', 'family'],
      coverImage: createAlbumMemories('album-8', 1, 25, 'holidays')[0]?.content,
    },
  ];

  // Debug: Log albums creation
  console.log('Albums created:', {
    count: albums.length,
    firstAlbum: albums[0] ? {
      id: albums[0].id,
      title: albums[0].title,
      memoriesCount: albums[0].memories.length,
    } : null,
  });

  // Sample Medicines
  interface Medicine {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timeOfDay: string[];
    startDate: string;
    endDate?: string;
    notes?: string;
    takenToday: boolean;
    lastTaken?: string;
  }

  const medicines: Medicine[] = [
    {
      id: 'med-1',
      name: 'Donepezil',
      dosage: '10mg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[90] || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'For memory support. Take with breakfast.',
      takenToday: false,
    },
    {
      id: 'med-2',
      name: 'Memantine',
      dosage: '20mg',
      frequency: 'Twice daily',
      timeOfDay: ['morning', 'evening'],
      startDate: dates[60] || new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take morning dose with breakfast, evening dose with dinner.',
      takenToday: false,
    },
    {
      id: 'med-3',
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[365] || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Low dose aspirin for heart health.',
      takenToday: false,
    },
    {
      id: 'med-4',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[180] || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take with meal for better absorption.',
      takenToday: false,
    },
    {
      id: 'med-5',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeOfDay: ['morning', 'evening'],
      startDate: dates[120] || new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take with meals to reduce stomach upset.',
      takenToday: false,
    },
    {
      id: 'med-6',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      timeOfDay: ['evening'],
      startDate: dates[200] || new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take at bedtime. Helps with cholesterol.',
      takenToday: false,
    },
    {
      id: 'med-7',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[150] || new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Blood pressure medication. Take same time daily.',
      takenToday: false,
    },
    {
      id: 'med-8',
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[90] || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Supports brain health. Take with food.',
      takenToday: false,
    },
    {
      id: 'med-9',
      name: 'Melatonin',
      dosage: '3mg',
      frequency: 'Once daily',
      timeOfDay: ['evening'],
      startDate: dates[45] || new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Take 30 minutes before bedtime to help with sleep.',
      takenToday: false,
    },
    {
      id: 'med-10',
      name: 'Calcium',
      dosage: '600mg',
      frequency: 'Twice daily',
      timeOfDay: ['morning', 'evening'],
      startDate: dates[100] || new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Bone health supplement. Take with meals.',
      takenToday: false,
    },
    {
      id: 'med-11',
      name: 'B12 Vitamin',
      dosage: '1000mcg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[75] || new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Important for energy and nerve function.',
      takenToday: false,
    },
    {
      id: 'med-12',
      name: 'Folic Acid',
      dosage: '400mcg',
      frequency: 'Once daily',
      timeOfDay: ['morning'],
      startDate: dates[80] || new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Supports healthy cell function.',
      takenToday: false,
    },
  ];

  return {
    memories,
    journalEntries,
    progressData,
    quizResults,
    albums,
    medicines,
  };
}

