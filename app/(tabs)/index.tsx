import { Pokemon, getPokemon } from "@/api/pokeapi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const List = () => {
  const pokemonQuery = useQuery({
    queryKey: ["pokemon"],
    queryFn: getPokemon,
    refetchOnMount: false,
  });

  const renderItem: ListRenderItem<Pokemon> = ({ item }) => (
    <Link href={`/(pokemon)/${item.id}`} key={item.id} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.preview} />
          <Text style={styles.itemText}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={pokemonQuery.data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: "#dfdfdf", width: "100%" }}
          />
        )}
        estimatedItemSize={100}
      />
      {pokemonQuery.isLoading && <ActivityIndicator style={{ margin: 50 }} />}
    </View>
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

export default List;
