import type { Actor, Relation } from './types';

function getFileName(path: string) {
	return /\/([^/]*)\.md/.exec(path)?.[1] || '';
}

export async function getGraph() {
	const actorGlob: Record<string, { metadata: Actor }> = import.meta.glob(
		'../../data/actors/*.md',
		{
			eager: true
		}
	);

	const actors = await Object.entries(actorGlob)
		.map(([id, actor]) => ({ ...actor.metadata, id: getFileName(id) }))
		.sort((a, b) => a.name.localeCompare(b.name));

	const relationGlob: Record<string, { metadata: Relation }> = import.meta.glob(
		'../../data/relations/*.md',
		{
			eager: true
		}
	);

	const relations = await Object.entries(relationGlob).map(([id]) => {
		const [source, target] = getFileName(id).split('_');
		return { source, target };
	});

	return {
		actors,
		relations
	};
}
