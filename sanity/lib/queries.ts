import { groq } from 'next-sanity'

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id, title, slug, publishedAt, excerpt, mainImage, type, readingTime, tags
}`

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, publishedAt, excerpt, mainImage, body, type, readingTime, tags
}`
