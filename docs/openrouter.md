---
title: Quickstart
subtitle: Get started with OpenRouter
slug: quickstart
headline: OpenRouter Quickstart Guide | Developer Documentation
canonical-url: 'https://openrouter.ai/docs/quickstart'
'og:site_name': OpenRouter Documentation
'og:title': OpenRouter Quickstart Guide
'og:description': >-
  Get started with OpenRouter's unified API for hundreds of AI models. Learn how
  to integrate using OpenAI SDK, direct API calls, or third-party frameworks.
'og:image':
  type: url
  value: >-
    https://openrouter.ai/dynamic-og?pathname=quickstart&title=Quick%20Start&description=Start%20using%20OpenRouter%20API%20in%20minutes%20with%20any%20SDK
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary_large_image
'twitter:site': '@OpenRouterAI'
noindex: false
nofollow: false
---

OpenRouter provides a unified API that gives you access to hundreds of AI models through a single endpoint, while automatically handling fallbacks and selecting the most cost-effective options. Get started with just a few lines of code using your preferred SDK or framework.

<Tip>
  Looking for information about free models and rate limits? Please see the [FAQ](/docs/faq#how-are-rate-limits-calculated)
</Tip>

In the examples below, the OpenRouter-specific headers are optional. Setting them allows your app to appear on the OpenRouter leaderboards. For detailed information about app attribution, see our [App Attribution guide](/docs/app-attribution).

## Using the OpenRouter SDK (Beta)

First, install the SDK:

<CodeGroup>
```bash title="npm"
npm install @openrouter/sdk
```

```bash title="yarn"
yarn add @openrouter/sdk
```

```bash title="pnpm"
pnpm add @openrouter/sdk
```
</CodeGroup>

Then use it in your code:

<CodeGroup>

```typescript title="TypeScript SDK"
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: '<OPENROUTER_API_KEY>',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

const completion = await openRouter.chat.send({
  model: 'openai/gpt-4o',
  messages: [
    {
      role: 'user',
      content: 'What is the meaning of life?',
    },
  ],
  stream: false,
});

console.log(completion.choices[0].message.content);
```
</CodeGroup>

## Using the OpenRouter API directly

<Tip>
  You can use the interactive [Request Builder](/request-builder) to generate OpenRouter API requests in the language of your choice.
</Tip>

<CodeGroup>

```python title="Python"
import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer <OPENROUTER_API_KEY>",
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  data=json.dumps({
    "model": "openai/gpt-4o", # Optional
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
)
```

```typescript title="TypeScript (fetch)"
fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <OPENROUTER_API_KEY>',
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  }),
});
```

```shell title="Shell"
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
  "model": "openai/gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}'
```

</CodeGroup>


## Using the OpenAI SDK

<CodeGroup>
```typescript title="Typescript"
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '<OPENROUTER_API_KEY>',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

```python title="Python"
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="<OPENROUTER_API_KEY>",
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  model="openai/gpt-4o",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
)

print(completion.choices[0].message.content)
```
</CodeGroup>

The API also supports [streaming](/docs/api/reference/streaming).

## Using third-party SDKs

For information about using third-party SDKs and frameworks with OpenRouter, please [see our frameworks documentation.](/docs/guides/community/frameworks-and-integrations-overview)


---
title: Models
subtitle: One API for hundreds of models
headline: OpenRouter Models | Access 400+ AI Models Through One API
canonical-url: 'https://openrouter.ai/docs/guides/overview/models'
'og:site_name': OpenRouter Documentation
'og:title': OpenRouter Models - Unified Access to 400+ AI Models
'og:description': >-
  Access all major language models (LLMs) through OpenRouter's unified API.
  Browse available models, compare capabilities, and integrate with your
  preferred provider.
'og:image':
  type: url
  value: >-
    https://openrouter.ai/dynamic-og?pathname=models&title=AI%20Model%20Hub&description=Access%20all%20LLMs%20through%20one%20unified%20API%20endpoint
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary_large_image
'twitter:site': '@OpenRouterAI'
noindex: false
nofollow: false
---

Explore and browse 400+ models and providers [on our website](/models), or [with our API](/docs/api-reference/models/get-models). You can also subscribe to our [RSS feed](/api/v1/models?use_rss=true) to stay updated on new models.

## Models API Standard

Our [Models API](/docs/api-reference/models/get-models) makes the most important information about all LLMs freely available as soon as we confirm it.

### API Response Schema

The Models API returns a standardized JSON response format that provides comprehensive metadata for each available model. This schema is cached at the edge and designed for reliable integration for production applications.

#### Root Response Object

```json
{
  "data": [
    /* Array of Model objects */
  ]
}
```

#### Model Object Schema

Each model in the `data` array contains the following standardized fields:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique model identifier used in API requests (e.g., `"google/gemini-2.5-pro-preview"`) |
| `canonical_slug` | `string` | Permanent slug for the model that never changes |
| `name` | `string` | Human-readable display name for the model |
| `created` | `number` | Unix timestamp of when the model was added to OpenRouter |
| `description` | `string` | Detailed description of the model's capabilities and characteristics |
| `context_length` | `number` | Maximum context window size in tokens |
| `architecture` | `Architecture` | Object describing the model's technical capabilities |
| `pricing` | `Pricing` | Lowest price structure for using this model |
| `top_provider` | `TopProvider` | Configuration details for the primary provider |
| `per_request_limits` | Rate limiting information (null if no limits) |
| `supported_parameters` | `string[]` | Array of supported API parameters for this model |

#### Architecture Object

```typescript
{
  "input_modalities": string[], // Supported input types: ["file", "image", "text"]
  "output_modalities": string[], // Supported output types: ["text"]
  "tokenizer": string,          // Tokenization method used
  "instruct_type": string | null // Instruction format type (null if not applicable)
}
```

#### Pricing Object

All pricing values are in USD per token/request/unit. A value of `"0"` indicates the feature is free.

```typescript
{
  "prompt": string,           // Cost per input token
  "completion": string,       // Cost per output token
  "request": string,          // Fixed cost per API request
  "image": string,           // Cost per image input
  "web_search": string,      // Cost per web search operation
  "internal_reasoning": string, // Cost for internal reasoning tokens
  "input_cache_read": string,   // Cost per cached input token read
  "input_cache_write": string   // Cost per cached input token write
}
```

#### Top Provider Object

```typescript
{
  "context_length": number,        // Provider-specific context limit
  "max_completion_tokens": number, // Maximum tokens in response
  "is_moderated": boolean         // Whether content moderation is applied
}
```

#### Supported Parameters

The `supported_parameters` array indicates which OpenAI-compatible parameters work with each model:

- `tools` - Function calling capabilities
- `tool_choice` - Tool selection control
- `max_tokens` - Response length limiting
- `temperature` - Randomness control
- `top_p` - Nucleus sampling
- `reasoning` - Internal reasoning mode
- `include_reasoning` - Include reasoning in response
- `structured_outputs` - JSON schema enforcement
- `response_format` - Output format specification
- `stop` - Custom stop sequences
- `frequency_penalty` - Repetition reduction
- `presence_penalty` - Topic diversity
- `seed` - Deterministic outputs

<Note title='Different models tokenize text in different ways'>
  Some models break up text into chunks of multiple characters (GPT, Claude,
  Llama, etc), while others tokenize by character (PaLM). This means that token
  counts (and therefore costs) will vary between models, even when inputs and
  outputs are the same. Costs are displayed and billed according to the
  tokenizer for the model in use. You can use the `usage` field in the response
  to get the token counts for the input and output.
</Note>

If there are models or providers you are interested in that OpenRouter doesn't have, please tell us about them in our [Discord channel](https://openrouter.ai/discord).

## For Providers

If you're interested in working with OpenRouter, you can learn more on our [providers page](/docs/use-cases/for-providers).
