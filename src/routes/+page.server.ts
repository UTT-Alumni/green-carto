import type { PageServerLoad } from './$types';
import { getGraph } from '$lib/utils';

export const load: PageServerLoad = async () => {
	return await getGraph();
};
