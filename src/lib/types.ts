export type Actor = {
	id: string;
	name: string;
	description: string;
	type: string;
};

export type D3Node = Actor & {
	index: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
};

export type Relation = {};

export type D3Link = Omit<Relation, 'source' | 'target'> & {
	index: number;
	source: D3Node;
	target: D3Node;
};

export type D3Event = {
	pageX: number;
	pageY: number;
};
