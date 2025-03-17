import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Container from "/src/components/container";
import Head from 'next/head';
import PostList from "/src/components/postlist";
// //import { PortableText } from "/utils/portabletext";
// // import { urlForImage } from "@/lib/sanity/image";
// import PostList from "/src/components/postlist";
// import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorData } from '/utils/authors';  
import {  mapCategories, getCategoryName } from '/utils/categories'; 

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('content'));

  let categories = new Set();

  files.forEach(filename => {
      const fileContent = fs.readFileSync(path.join('content', filename), 'utf-8');
      const { data } = matter(fileContent);

      if (data.categories) {
          data.categories.forEach(catObj => {
              if (catObj.category) {
                  categories.add(catObj.category); // Extract category name
              }
          });
      }
  });

  // Generate paths for each unique category
  const paths = Array.from(categories).map(category => ({
      params: { category }
  }));

  return {
      paths,
      fallback: false // 404 if category doesn't exist
  };
}

export async function getStaticProps({ params }) {
  const files = fs.readdirSync(path.join('content'));
  const posts = [];
  const cat = params.category ? getCategoryName(params.category) : '';
  files.forEach(filename => {
      const filePath = path.join('content', filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const categories = data.categories ? mapCategories(data.categories.map(item => item.category)) : [];
      
      const author = data.author ? getAuthorData(data.author) : {};
      // Check if the post contains the requested category
      if (data.categories) {
          const categoryNames = data.categories.map(catObj => catObj.category);
          if (categoryNames.includes(params.category)) {
              posts.push({
                  slug: filename.replace('.md', ''),
                  title: data.title || filename.replace('.md', ''),
                  date: data.date,
                  status: data.status,
                  categories,
                  featuredImage: data.featuredImage,
                  excerpt: data.excerpt,
                  meta: data.meta,
                  author,
                  cat
              });
          }
      }
  });

  return {
      props: {
          category: cat,
          posts
      }
  };
}

const Posts = ({ category, posts }) => {
    return (
      <>
     < Head>
      <title>Spel för barn.se - {category}</title>
      <meta name="description" content={`Kolla in våra artiklar om bra spel för barn.`} />
      <meta property="og:title" content="Spel för barn.se - Artiklar" />
      <meta property="og:description" content={`Kolla in våra artiklar om bra spel för barn.`} />
      <meta name="twitter:card" content="summary_large_image" />
      {/* Add other meta tags as needed */}
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