import type { Metadata } from 'next'
import DirectoryView from './DirectoryView'

// Demo data for alpha - will be replaced with Supabase queries
const DEMO_MEMBERS = [
  {
    id: '1', name: 'Matt Chandler', title: 'Elder, Lead Pastor',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3ddc2ef162-0e17-4de5-a0ce-f4c469c53118?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Offering guidance in leadership development, public speaking coaching, and theological resource recommendations.',
    bio: 'Matt Chandler serves as the Lead Pastor of The Village Church in Flower Mound, Texas.',
    skills: [{ id: '1', name: 'Leadership', color: '#EF4444' }, { id: '2', name: 'Teaching', color: '#3B82F6' }, { id: '3', name: 'Creative', color: '#8B5CF6' }],
    email: 'mchandler.tsi@example.com', available: true, featured: true,
  },
  {
    id: '2', name: 'Maddie Clay', title: 'Events Coordinator',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3db723bd3c-6ba8-417f-b5fb-6ee215e1cc0b?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Expert in planning and executing large-scale events. Can help with logistics and vendor coordination.',
    bio: 'Maddie Clay coordinates events for The Village Church, ensuring gatherings run smoothly.',
    skills: [{ id: '4', name: 'Admin', color: '#6B7280' }, { id: '5', name: 'Management', color: '#EAB308' }],
    email: 'mclay.tsi@example.com', available: true, featured: false,
  },
  {
    id: '3', name: 'Josh Cockrum', title: 'High School Associate Minister',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dd6673b94-aa2a-4652-afaa-5b124693fd17?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Passionate about mentoring high school students. Available for discipleship and student leadership training.',
    bio: 'Josh Cockrum serves in the high school ministry, helping students grow in their faith.',
    skills: [{ id: '2', name: 'Teaching', color: '#3B82F6' }, { id: '6', name: 'Counseling', color: '#14B8A6' }],
    email: 'jcockrum.tsi@example.com', available: true, featured: false,
  },
  {
    id: '5', name: 'Frankie Colombo', title: 'Facilities Technician I',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d5ddde929-0653-47c7-9f29-751d4d7800ca?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Skilled in general maintenance and repairs. Can help with basic plumbing, electrical, and carpentry tasks.',
    bio: 'Frankie Colombo helps maintain the church facilities, ensuring a safe and functional environment.',
    skills: [{ id: '7', name: 'Home Repair', color: '#F97316' }, { id: '8', name: 'Tech', color: '#EC4899' }],
    email: 'fcolombo.tsi@example.com', available: true, featured: false,
  },
  {
    id: '4', name: 'Kayley Cockrum', title: 'Events Coordinator',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d678fef78-0e19-4605-a404-2b7bbd7a1fdf?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Specializes in creating welcoming environments for church events. Can offer advice on decor and hospitality.',
    bio: 'Kayley Cockrum works alongside the events team to create memorable and impactful experiences for the church community.',
    skills: [{ id: '4', name: 'Admin', color: '#6B7280' }, { id: '3', name: 'Creative', color: '#8B5CF6' }],
    email: 'kcockrum.tsi@example.com', available: true, featured: false,
  },
  {
    id: '6', name: 'Nick Crawford', title: 'Elder, Lead Pastor',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dcf147e9f-8189-40e2-9866-e810eff9ea84?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Experienced in pastoral leadership and church planting strategy. Available for ministry coaching.',
    bio: 'Nick Crawford serves as a lead pastor, focusing on church leadership and new ministry initiatives.',
    skills: [{ id: '1', name: 'Leadership', color: '#EF4444' }, { id: '2', name: 'Teaching', color: '#3B82F6' }],
    email: 'ncrawford.tsi@example.com', available: true, featured: false,
  },
  {
    id: '7', name: 'Jenni David', title: 'Childcare Coordinator',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d02942849-ddc1-465a-86b6-1d1517889943?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Manages childcare services and volunteers. Can provide resources for family discipleship and parenting.',
    bio: 'Jenni David coordinates the childcare ministry, providing a safe and nurturing environment for the youngest members of the church.',
    skills: [{ id: '4', name: 'Admin', color: '#6B7280' }, { id: '6', name: 'Counseling', color: '#14B8A6' }],
    email: 'jdavid.tsi@example.com', available: true, featured: false,
  },
  {
    id: '8', name: 'Laura Dunnican', title: 'Global Missions Mobilizer',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3deb76d697-53f7-4b18-9cfe-4cd1294cc735?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Connects members with global missions opportunities. Guidance on cross-cultural ministry and support raising.',
    bio: 'Laura Dunnican mobilizes the church for global missions, equipping and sending members worldwide.',
    skills: [{ id: '1', name: 'Leadership', color: '#EF4444' }, { id: '4', name: 'Admin', color: '#6B7280' }],
    email: 'ldunnican.tsi@example.com', available: true, featured: false,
  },
  {
    id: '9', name: 'Bryan Eaton', title: 'Home Groups Minister',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d99904d02-b677-4f46-903b-7987418f21f4?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Oversees the Home Groups ministry. Can provide training for group leaders and curriculum resources.',
    bio: 'Bryan Eaton is dedicated to fostering community and spiritual growth through the Home Groups ministry at The Village.',
    skills: [{ id: '2', name: 'Teaching', color: '#3B82F6' }, { id: '1', name: 'Leadership', color: '#EF4444' }],
    email: 'beaton.tsi@example.com', available: true, featured: false,
  },
  {
    id: '10', name: 'Lindsey Eenigenburg', title: 'Executive Director, Engagement',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d5e9aad0f-73ab-4b73-99f2-8a96d1115d36?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Focuses on connecting members to the church community. Can help with strategic communication and engagement planning.',
    bio: 'Lindsey Eenigenburg leads the engagement team, helping people get connected and involved in the life of the church.',
    skills: [{ id: '5', name: 'Management', color: '#EAB308' }, { id: '3', name: 'Creative', color: '#8B5CF6' }],
    email: 'leenigenburg.tsi@example.com', available: true, featured: false,
  },
  {
    id: '11', name: 'Justin Elafros', title: 'Minister, Senior Director, Adult Ministries',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3dcc96b990-ab81-4520-8a9a-6c34abee0e19?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Directs adult ministries, including classes and discipleship programs. Can offer curriculum development advice.',
    bio: 'Justin Elafros provides leadership to all adult ministries, ensuring there are clear pathways for spiritual growth.',
    skills: [{ id: '1', name: 'Leadership', color: '#EF4444' }, { id: '2', name: 'Teaching', color: '#3B82F6' }, { id: '5', name: 'Management', color: '#EAB308' }],
    email: 'jelafros.tsi@example.com', available: true, featured: false,
  },
  {
    id: '12', name: 'Rachel Ellis', title: 'Missions Coordinator',
    photo_url: 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d25bad8d6-cc1a-4c05-a64b-e68b25544632?w=798&h=1000&fit=crop&crop=faces&auto=compress,format',
    description: 'Coordinates logistics for local and global missions efforts. Can help with trip planning and administrative support.',
    bio: 'Rachel Ellis supports the missions ministry through administrative and logistical coordination, helping to advance the gospel locally and globally.',
    skills: [{ id: '4', name: 'Admin', color: '#6B7280' }, { id: '9', name: 'Finance', color: '#22C55E' }],
    email: 'rellis.tsi@example.com', available: true, featured: false,
  },
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // TODO: Fetch org data from Supabase based on slug
  return {
    title: 'The Village Church Directory',
    description: 'Connecting needs with the giftedness of our church family at The Village Church.',
  }
}

export default function DirectoryPage({ params }: { params: { slug: string } }) {
  // TODO: Fetch from Supabase: SELECT * FROM members WHERE org_id = (SELECT id FROM organizations WHERE slug = params.slug)
  const members = DEMO_MEMBERS
  const orgName = 'The Village Church'
  const orgLogoUrl = 'https://www.thevillagechurch.net/Themes/TheVillageChurch/Assets/Images/primary-logo-white.svg'
  const orgHeroUrl = 'https://thevillagechurch.imgix.net/https%3a%2f%2forigin.thevillagechurch.net%2fGetImage.ashx%3fGuid%3d027908df-c101-4994-a244-13fcbbc118c9?w=1100&h=550&fit=crop&auto=compress'

  return (
    <DirectoryView
      members={members}
      orgName={orgName}
      orgSlug={params.slug}
      orgLogoUrl={orgLogoUrl}
      orgHeroUrl={orgHeroUrl}
    />
  )
}
