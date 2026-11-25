import type {ProjectConfig} from '../../packages/config/project.mjs';

export function createInformationalConfig(
  input: unknown,
  project: ProjectConfig,
  runDirectory: string,
): {
  name: string;
  main: string;
  routes: Array<{pattern: string; custom_domain: boolean}>;
  assets: {directory: string; run_worker_first: string[]};
};
