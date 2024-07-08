export interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  sprites?: any;
  abilities?: any;
  stats?: any;
}

export const getPokemon = async (): Promise<Pokemon[]> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150}`);
  const data = await response.json();
  return data.results.map((item: Pokemon, index: number) => ({
    ...item,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
  }));
};

export const getPokemonDetail = async (id: string): Promise<Pokemon> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
};
