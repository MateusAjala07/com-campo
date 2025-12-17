import React from "react";
import { FlatList, View, RefreshControl } from "react-native";
import { cn } from "@/lib/utils";
import ListaErro from "./erro";
import ListaVazia from "./vazia";
import ListaCarregando from "./carregando";

export default function Lista({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  error,
  onRetry,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  className,
  showsVerticalScrollIndicator = false,
  emptyMessage = "Nenhum item encontrado",
  itemCountLoading = 5,
}) {
  if (loading) return <ListaCarregando itemCount={itemCountLoading} />;

  if (error) return <ListaErro message={error} onRetry={onRetry} />;

  if (!data?.length) return <ListaVazia message={emptyMessage} onRefresh={onRefresh} />;

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerClassName="p-4"
      className={cn("flex-1", className)}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
    />
  );
}
