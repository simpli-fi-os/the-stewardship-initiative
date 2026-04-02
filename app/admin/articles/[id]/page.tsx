import { notFound } from 'next/navigation'
import { fetchArticleById } from '@/lib/articles'
import ArticleEditor from './ArticleEditor'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminArticleEditPage({ params }: Props) {
  const { id } = await params
  const article = await fetchArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <div>
      <ArticleEditor article={article} />
    </div>
  )
}
