import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TabSwitcher } from "@/components/navigation/TabSwitcher";
import { TotalFooter } from "@/components/footer/TotalFooter";

export default function GroupScreen() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Nhóm</ThemedText>
      </ThemedView>

      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <ThemedView style={styles.content}>
        {/* Placeholder content */}
        <ThemedText style={styles.placeholderText}>Chưa có nhóm nào</ThemedText>
      </ThemedView>

      <TotalFooter totalAmount={0} label="nhóm" onAddPress={() => {}} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 20,
    color: "#757575",
  },
});
