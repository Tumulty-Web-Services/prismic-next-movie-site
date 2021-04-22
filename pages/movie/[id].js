const Prismic = require('@prismicio/client');
import { useRouter } from 'next/router'
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

// create a connection between the prismic js library and my apps api on prismic.io
const apiEndpoint = "https://my-first-app1.prismic.io/api";
const client = Prismic.client(apiEndpoint);

export default function Movie({ movie }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
<Head>
        <title>{movie.movie_title.value[0].text}</title>
        <meta cname="description" content={movie.description.value[0].text} />
      </Head>
      <Link href="/">
        <a>
          Home
        </a>
      </Link>
      <h3>Everything in <span style={{color: 'green'}}><u>green</u></span> is data from the database</h3>
      <div style={{color: 'green'}}>
        <h2>{movie.movie_title.value[0].text}</h2>
        <p><strong>Description: {movie.description.value[0].text}</strong></p>
      <Image
       src={movie.poster.value.main.url}
       alt={movie.movie_title.value[0].text}
       height={movie.poster.value.main.dimensions.height}
       width={movie.poster.value.main.dimensions.width}
      /> 

      </div>
    </>
  )
}

export async function getStaticPaths() {
  // make a request for the movie posts from prismic database
  const movieReq = await client.query(Prismic.Predicates.at('document.type', 'movies'))
    .then(res => res.results);

  // ill iterate over all the movies in the array
  // then ill extract the ids and return an array of urls with the ids
  // it'll look something like this [/movie/jkfdlsakjfkld, /movie/klsjiojrlwe]
  const movieUrls = movieReq.map((movie) => `/movie/${movie.id}`);

  return {
    paths: movieUrls,
    fallback: true
  }
};

export async function getStaticProps({ params }) {
  // make a request for the movie posts from prismic database
  const movieReq = await client.getByID(params.id)
    .then(res => res);
  
  return {
    props: {
      movie: movieReq.data.movies
    }
  }
}