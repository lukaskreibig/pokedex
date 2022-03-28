      export interface IStorage {
        artwork?: URL;
        id?: number;
        image?: URL;
        name: string;
        url?: URL;
        __typename?: string;
        sprites?: {
        front_default?: string | URL | undefined;
    } | undefined;
        notacard?: boolean;
    }

    export interface IGen {
        id: number;
        range: {from: number, to: number}
        [x: string]: unknown;
    }
