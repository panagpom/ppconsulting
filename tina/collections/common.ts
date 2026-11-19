import type { Collection, TinaField } from 'tinacms';
import type { ProjectConfig } from '../../packages/config/project.mjs';
import { validateCurrentSave, resolveNativeSubmission } from '../validation';
export function collection(
  name: string,
  path: string,
  fields: TinaField[],
  project: ProjectConfig,
  protectedRecords = false,
): Collection {
  return {
    name,
    label: ({ page: 'Pages', offering: 'Offerings', person: 'People', article: 'Articles', campaign: 'Campaigns', settings: 'Settings' } as Record<string, string>)[name] || name,
    path,
    format: 'json',
    fields,
    ui: {
      allowedActions: {
        create: !protectedRecords,
        delete:
          !protectedRecords &&
          !['offering', 'person', 'article'].includes(name),
        createFolder: false,
        createNestedFolder: false,
      },
      beforeSubmit: async ({ values, cms, form }) => {
        try {
          const submission = resolveNativeSubmission(form, values, path);
          const candidate = name === 'article' && submission.operation === 'create' && !values.createdAt
            ? { ...values, createdAt: new Date().toISOString() }
            : values;
          return await validateCurrentSave(
            candidate,
            name,
            project,
            cms,
            submission,
          );
        } catch (error) {
          // Native Form invokes this hook before createDocument/updateDocument's alert handler.
          cms.alerts?.error(
            error instanceof Error
              ? error.message
              : 'The document could not be validated.',
          );
          throw error;
        }
      },
    },
  };
}
