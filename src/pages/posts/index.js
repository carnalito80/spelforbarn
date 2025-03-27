import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Container from  "../../components/container"
import PostList from "../../components/postlist"
import Head from 'next/head';
import { mapCategories } from '/utils/categories';  
import { getAuthorData } from '/utils/authors';  

export async function getStaticProps() {
  // Path to the markdown content
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

     // Access the categories array
     const categories = data.categories ? mapCategories(data.categories.map(item => item.category)) : [];
     const author = data.author ? getAuthorData(data.author) : {};

    return {
      slug: fileName.replace(/\.md$/, ''),
      title: data.title,
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "1970-01-01", 
      status: data.status,
      categories,
      featuredImage: data.featuredImage,
      excerpt: data.excerpt,
      meta: data.meta,
      author

    };
  });

   // Sort posts by date (newest first)
   posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      posts,
    },
  };
}

const Posts = ({ posts }) => {
  return (
    <>
   < Head>
    <title>Spel för barn.se - Artiklar</title>
    <meta name="description" content={`Kolla in våra artiklar om bra spel för barn.`} />
    <meta property="og:title" content="Spel för barn.se - Artiklar" />
    <meta property="og:description" content={`Kolla in våra artiklar om bra spel för barn.`} />
    <meta name="twitter:card" content="summary_large_image" />
    
   
  </Head>
    <Container>
      <h1>Artiklar</h1>
      {posts && (
        <Container>
         
          <div className="grid gap-10 md:grid-cols-2 lg:gap-10 ">
            {posts.slice(0, 2).map(post => (
              <PostList
                key={post.title}
                post={post}
                aspect="landscape"
                preloadImage={true}
              />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            {posts.slice(2, 14).map(post => (
              <PostList key={post.slug} post={post} aspect="square" />
            ))}
          </div>
        
        </Container>
      )}
    </Container>
    </>
  );
};

export default Posts;