import { storage } from "@/api/mmkv";
import { getPokemonDetail } from "@/api/pokeapi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FlipInEasyX,
} from "react-native-reanimated";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigate = useNavigation();
  const [isFavourite, setIsFavourite] = React.useState<boolean>(
    storage.getString(`favourite-${id}`) === "true",
  );

  const pokemonDetailQuery = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => getPokemonDetail(id!),
    refetchOnMount: false,
    // onSuccess: (data: Pokemon) => {
    //   navigate.setOptions({
    //     title: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    //   });
    // },
  });
  // useEffect(() => {
  //   const load = async () => {
  //     const isFavourite = await AsyncStorage.getItem(`favourite-${id}`);
  //     setIsFavourite(isFavourite === "true");
  //   };
  //   load();
  // }, [id]);

  useEffect(() => {
    navigate.setOptions({
      title: "",
      headerRight: () => (
        <Text onPress={toggleFavourite}>
          <Ionicons
            name={isFavourite ? "star" : "star-outline"}
            size={22}
            color={"#fff"}
          />
        </Text>
      ),
    });
  }, [isFavourite]);

  const toggleFavourite = async () => {
    storage.set(`favourite-${id}`, isFavourite ? "false" : "true");
    setIsFavourite(!isFavourite);
  };

  return (
    <View style={{ padding: 10 }}>
      {pokemonDetailQuery.isLoading && (
        <ActivityIndicator style={{ margin: 50 }} />
      )}
      {pokemonDetailQuery.data && (
        <>
          <Animated.View
            style={[styles.card, { alignItems: "center" }]}
            entering={FadeIn.delay(200)}
          >
            <Image
              source={{ uri: pokemonDetailQuery.data.sprites.front_default }}
              style={{ width: 200, height: 200 }}
            />
            <Animated.Text
              style={styles.name}
              entering={FlipInEasyX.delay(300)}
            >
              #{pokemonDetailQuery.data.id} {pokemonDetailQuery.data.name}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={styles.card} entering={FadeInDown.delay(500)}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Stats:</Text>
            {pokemonDetailQuery.data.stats.map((stat: any) => (
              <Text key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </Text>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    elevation: 1,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    textShadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

export default Page;
