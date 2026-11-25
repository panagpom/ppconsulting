import {cmsResponse} from '../packages/config/security-headers.mjs';
import {editor, HttpError, type AccessEnvironment} from './security';

export interface CmsEnvironment extends AccessEnvironment {
  ASSETS: Pick<Fetcher, 'fetch'>;
}

export default {
  async fetch(request: Request, env: CmsEnvironment): Promise<Response> {
    const {pathname} = new URL(request.url);
    if (pathname !== '/cms' && !pathname.startsWith('/cms/')) return env.ASSETS.fetch(request);

    try {
      await editor(request, env);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 503;
      return cmsResponse(new Response(status === 403 ? 'Forbidden' : 'Service unavailable', {status}), env);
    }

    return cmsResponse(await env.ASSETS.fetch(request), env);
  },
} satisfies ExportedHandler<CmsEnvironment>;
