// Educational Example: Do NOT use to spoof headers deceptively.
export default {
  async fetch(request, env, ctx) {
    // 1. Get parameters from the worker's URL.
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const query = searchParams.get('query'); // Get the 'query' parameter.

    if (!url) {
      return new Response('Please provide a ?url= parameter.', { status: 400 });
    }

    // 2. Create a new request object to send to the destination.
    const newRequest = new Request(url, {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });

    // 3. Dynamically build the Referer URL.
    let refererUrl;
    if (query) {
      // If a 'query' parameter is provided, use it for the Google search Referer.
      refererUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    } else {
      // If no 'query' is provided, fall back to the generic Google homepage.
      refererUrl = 'https://www.google.com/';
    }

    // Set the dynamic 'Referer' header.
    newRequest.headers.set('Referer', refererUrl);

    // 4. Send the modified request to the destination server.
    return fetch(newRequest);
  },
};
