import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const handler: Handler = async (event, context) => {
  const { query } = JSON.parse(event.body || '{}');
  // console.log(query);
  // console.log(process.env.UNSPLASH_ACCESS_KEY);

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  )
    .then((resp) => {
      // console.log(resp);
      return resp.json();
    })
    .catch((error) => console.log('error', error));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
};

export { handler };