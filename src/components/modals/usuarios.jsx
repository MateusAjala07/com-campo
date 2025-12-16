import { Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalUsuarios({ isOpen, setIsOpen }) {
  <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 16,
        justifyContent: "center",
      }}
    ></SafeAreaView>
  </Modal>;
}
