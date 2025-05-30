import { notFound, redirect } from "next/navigation"
import { getSnippetForEdit } from "@/app/actions"
import { EditSnippet } from "@/components/edit-snippet"

interface EditPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    code?: string
  }>
}

export default async function EditPage({ params, searchParams }: EditPageProps) {
  const { id } = await params
  const { code } = await searchParams

  if (!code) {
    redirect(`/${id}`)
  }

  const snippet = await getSnippetForEdit(id, code)

  if (!snippet) {
    notFound()
  }

  return <EditSnippet snippet={snippet} ownerCode={code} />
} 