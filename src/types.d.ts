export type Metadata = {
  name: string;
  description: string;
  image: string;
  edition: number;
  attributes: { trait_type: string; value: string }[];
  dna?: string;
};

export type LayerRules = {
  [key: string]: Set<string>;
};

export type Group = {
  supply: number;
  groups: string[];
};

export type LocalFileSystemProvider = {
  createSessionToken: () => string;
} & storage.LocalFileSystemProvider;
