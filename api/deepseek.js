
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    
    // 优先使用请求头中的 Key (用户自定义)，否则使用环境变量中的 Key
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 10
      ? authHeader.replace('Bearer ', '')
      : process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: { 
          message: 'Server API Key not configured and no user key provided.',
          code: 'MISSING_API_KEY'
        } 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ 
      error: { 
        message: error.message || 'Internal Server Error',
        code: 'INTERNAL_ERROR'
      } 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
