export interface Syncable {
  fieldsToSync?: string[];
  draft?: boolean;
  serverId?: string;
}

export function needsSync(record: Syncable): boolean {
  return (
    !record.draft && !!record.fieldsToSync && record.fieldsToSync.length > 0
  );
}

export function calculateChangeset(
  record: Syncable
): Partial<Syncable & { id: string }> {
  const update = { id: record.serverId };
  if (record.fieldsToSync) {
    record.fieldsToSync.forEach(field => (update[field] = record[field]));
  }
  return update;
}
