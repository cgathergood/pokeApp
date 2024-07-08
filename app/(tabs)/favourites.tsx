import { storage } from "@/api/mmkv";
import { Pokemon, getPokemonDetail } from "@/api/pokeapi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeIn,
  Layout,
  SlideOutLeft,
} from "react-native-reanimated";

const Favourites = () => {
  const [data, setData] = useState<Pokemon[]>([]);

  const fetchFavorites = useCallback(async () => {
    const pokemonQueries = await Promise.all(
      storage.getAllKeys().map((key) => {
        const pokemonId = key.split("-")[1];
        return getPokemonDetail(pokemonId);
      }),
    );
    setData(pokemonQueries);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, []),
  );

  const removeFavourite = (id: number) => {
    storage.delete(`favourite-${id}`);
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <ScrollView>
      {data.length > 0 &&
        data.map((item, index) => (
          <Animated.View
            key={item.id}
            style={styles.item}
            entering={FadeIn.delay(100 * index)}
            exiting={SlideOutLeft.duration(200)}
            layout={Layout.delay(100)}
          >
            <Image
              source={{ uri: item.sprites.front_default }}
              style={styles.preview}
            />
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeFavourite(item.id)}>
              <Ionicons name="trash" size={20} color="#c10505" />
            </TouchableOpacity>
          </Animated.View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  preview: { width: 100, height: 100 },
  itemText: {
    fontSize: 18,
    textTransform: "capitalize",
    flex: 1,
  },
});
export default Favourites;
