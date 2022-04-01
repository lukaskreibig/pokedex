      export interface IStorage { 
        artwork?: string;
        id?: number;
        image?: URL;
        name: string;
        url?: URL;
        __typename?: string;
        sprites?: {
        front_default?: string;
    } | undefined;
        notacard?: boolean;
    }

    export interface IGen {
        id: number;
        range: {from: number, to: number}
        [x: string]: unknown;
    }
