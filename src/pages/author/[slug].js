import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Container from "/src/components/container";
import { PortableText } from "/utils/portabletext";
// import { urlForImage } from "@/lib/sanity/image";
import PostList from "/src/components/postlist";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorData } from '/utils/authors';  
import { mapCategories } from '/utils/categories'; 

// Get all the author slugs (from the markdown files) for dynamic paths
export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Extract the author slugs from all markdown files
  const authors = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return data.author ? data.author : null;
  });

  // Remove duplicate authors
  const uniqueAuthors = [...new Set(authors.filter(Boolean))];

  // Generate paths for each unique author
  const paths = uniqueAuthors.map((slug) => ({
    params: { slug },
  }));

  
  return {
    paths,
    fallback: false,
  };
}

// Fetch the author's data and posts by slug
export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // You can define additional author information here (e.g., bio, image)
  const author = slug ? getAuthorData(slug) : {};
  console.log(author)
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { content, data } = matter(fileContent);
      const categories = data.categories ? mapCategories(data.categories.map(item => item.category)) : [];
      if (data.author && data.author === slug) {
        return {
          title: data.title,
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "1970-01-01", // Convert to YYYY-MM-DD
          status: data.status,
          categories,
          featuredImage: data.featuredImage,
          excerpt: data.excerpt,
          meta: data.meta,
          author
        };
      }
      return null;
    })
    .filter(Boolean); // Only keep the posts that match the author slug



   // Sort posts by date (newest first)
   posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // const authorData = {
  //   name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Example: 'john-doe' -> 'John Doe'
  //   slug,
  //   bio: "A passionate writer about space and technology.", // Example bio
  // };

  return {
    props: {
      author,
      posts,
    },
  };
}

export default function Author(props) {
  const { loading, posts, author } = props;
  // console.log(posts)
  // console.log(author)
  // const slug = author?.slug;

  // if (!loading && !slug) {
  //   notFound();
  // }

  return (
    <>
      <Container>
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            {author?.image && (
              <Image
                src={'/images/'+author.image}
                alt={author.name || " "}
                fill
                sizes="(max-width: 320px) 100vw, 320px"
                className="object-cover"
              />
            )}
          </div>
          <h1 className="text-brand-primary mt-2 text-3xl font-semibold tracking-tight dark:text-white lg:text-3xl lg:leading-tight">
            {author.name}
          </h1>
          <div className="mx-auto mt-2 flex max-w-xl flex-col px-5 text-center text-gray-500">
            
            {author.bio && <p> {author.bio} </p>}
          </div>
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
          {posts.map(post => (
              <PostList key={post.title} post={post} aspect="square" />
          ))}
        </div>
      </Container>
    </>
  );
}
